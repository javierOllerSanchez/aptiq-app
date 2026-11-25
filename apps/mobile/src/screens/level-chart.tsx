import type { WeekLevel } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { fontFamily, withAlpha } from '@aptiq/ui';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';

import { fechaCorta } from '@/history/rows';

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

const ALTO = 150;
const IZQ = 26;
const DER = 10;
const ARRIBA = 14;
const ABAJO = 32;

export const nivelTexto = (n: number) => n.toFixed(1).replace('.', ',');

/** Resumen en texto del gráfico para VoiceOver y TalkBack (el gráfico solo no se puede leer). */
export function resumenGrafico(semanas: readonly WeekLevel[]): string {
  if (semanas.length === 0) return 'Sin datos de nivel.';
  const vals = semanas.map((s) => nivelTexto(s.global));
  const primero = semanas[0]!.global;
  const ultimo = semanas[semanas.length - 1]!.global;
  const tendencia = ultimo > primero ? 'Sube.' : ultimo < primero ? 'Baja.' : 'Se mantiene.';
  const lista =
    vals.length > 1 ? `${vals.slice(0, -1).join('; ')} y ${vals[vals.length - 1]}` : vals[0];
  return `Nivel global en las últimas ${semanas.length} semanas: ${lista} de 5. ${tendencia}`;
}

/** Evolución del nivel global, escala 1–5 (PRO-01). Prototipo: docs/prototipos/historial-nivel.html. */
export function LevelChart({ semanas }: { semanas: readonly WeekLevel[] }) {
  const [ancho, setAncho] = useState(0);
  const x = (i: number) => IZQ + (i * (ancho - IZQ - DER)) / Math.max(semanas.length - 1, 1);
  const y = (v: number) => ARRIBA + ((5 - v) * (ALTO - ARRIBA - ABAJO)) / 4;
  const reduce = useReducedMotion();
  const puntos = semanas.map((s, i) => [x(i), y(s.global)] as const);
  // Largo de la línea: para dibujarla de izquierda a derecha (Historial v2).
  const largo = puntos.reduce(
    (t, [px, py], i) => (i ? t + Math.hypot(px - puntos[i - 1]![0], py - puntos[i - 1]![1]) : 0),
    0,
  );
  const dibujo = useSharedValue(0);
  useEffect(() => {
    if (ancho === 0) return;
    dibujo.value = reduce
      ? 1
      : withTiming(1, {
          duration: tokens.motion.countUp,
          easing: Easing.bezier(...tokens.motion.easingCurve),
        });
  }, [ancho, reduce, dibujo]);
  const linea = useAnimatedProps(() => ({ strokeDashoffset: largo * (1 - dibujo.value) }));
  const etiqueta = {
    fontFamily: fontFamily('mono', 600),
    fontSize: tokens.type.label.size,
    fill: tokens.color.graphiteStrong,
  };

  return (
    <View
      onLayout={(e) => setAncho(e.nativeEvent.layout.width)}
      accessible
      accessibilityRole="image"
      accessibilityLabel={resumenGrafico(semanas)}
      style={{ height: ALTO }}
    >
      {ancho > 0 && (
        <Svg width={ancho} height={ALTO}>
          {[1, 3, 5].map((v) => (
            <Line
              key={v}
              x1={IZQ}
              x2={ancho - DER}
              y1={y(v)}
              y2={y(v)}
              stroke={withAlpha(tokens.color.ink, tokens.opacity.barTrack)}
              strokeWidth={tokens.border.hairline}
            />
          ))}
          {[1, 3, 5].map((v) => (
            <SvgText key={`t${v}`} x={0} y={y(v) + 4} {...etiqueta}>
              {v}
            </SvgText>
          ))}
          <AnimatedPolyline
            points={puntos.map(([px, py]) => `${px},${py}`).join(' ')}
            fill="none"
            stroke={tokens.color.ink}
            strokeWidth={tokens.border.selected}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={largo || 1}
            animatedProps={linea}
          />
          {semanas.map((s, i) =>
            i === semanas.length - 1 ? (
              // La semana actual, en subrayador: es la que importa.
              <Circle
                key={s.semana}
                cx={x(i)}
                cy={y(s.global)}
                r={tokens.radius.bar * 1.75}
                fill={tokens.color.highlighter}
                stroke={tokens.color.ink}
                strokeWidth={tokens.border.selected}
              />
            ) : (
              <Circle
                key={s.semana}
                cx={x(i)}
                cy={y(s.global)}
                r={tokens.radius.bar}
                fill={tokens.color.ink}
              />
            ),
          )}
          {semanas.map((s, i) => (
            <SvgText
              key={`d${s.semana}`}
              x={x(i)}
              y={ALTO - 6}
              textAnchor={i === semanas.length - 1 ? 'end' : 'middle'}
              {...etiqueta}
            >
              {fechaCorta(new Date(`${s.semana}T12:00:00`).getTime())}
            </SvgText>
          ))}
        </Svg>
      )}
    </View>
  );
}
