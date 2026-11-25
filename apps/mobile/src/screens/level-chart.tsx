import type { WeekLevel } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { fontFamily, withAlpha } from '@aptiq/ui';
import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';

import { fechaCorta } from '@/history/rows';

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
          <Polyline
            points={semanas.map((s, i) => `${x(i)},${y(s.global)}`).join(' ')}
            fill="none"
            stroke={tokens.color.ink}
            strokeWidth={tokens.border.selected}
            strokeLinejoin="round"
          />
          {semanas.map((s, i) => (
            <Circle
              key={s.semana}
              cx={x(i)}
              cy={y(s.global)}
              r={tokens.radius.bar}
              fill={tokens.color.ink}
            />
          ))}
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
