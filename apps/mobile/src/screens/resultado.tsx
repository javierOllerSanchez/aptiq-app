import {
  type Breakdown,
  breakdown,
  score,
  type ScoreResult,
  type Tally,
  taxonomy,
  type TypeCode,
} from '@aptiq/engine';
import { perfilDe } from '@/content/content';
import { tokens } from '@aptiq/tokens';
import {
  AptitudeBar,
  Button,
  CountUp,
  entrada,
  GlassCard,
  Icon,
  IconButton,
  PaperBackground,
  PressScale,
  Stamp,
  Text,
} from '@aptiq/ui';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { useStore } from '@/data/provider';
import { usePlan } from '@/purchases/provider';
import { APTITUDE_LABELS, formatNota, isCorrect } from '@/practice/run';
import { InfoFormato } from '@/screens/info-formato';
import { Loading } from '@/screens/loading';

interface Resumen {
  nota: ScoreResult;
  desglose: Breakdown;
  preguntas: number | null;
  /** Número del simulacro entre los terminados (1, 2, 3…). */
  numero: number;
}

const pct = (t: Tally) => (t.total ? Math.round((t.correct / t.total) * 100) : 0);
/** Mínimo de preguntas y de diferencia con la mejor aptitud para señalar una «a reforzar». */
const REFORZAR = { preguntas: 3, puntos: 10 };

/**
 * La aptitud a reforzar solo se señala si hay datos y una diferencia real: con todas al 0 % o con
 * una sola pregunta, marcar una en rojo sería inventar un punto débil.
 */
export function aReforzar(d: Breakdown): string | null {
  const w = d.weakest ? d.byAptitude[d.weakest] : undefined;
  if (!d.weakest || !w || w.total < REFORZAR.preguntas) return null;
  const mejor = Math.max(...Object.values(d.byAptitude).map((t) => (t.total ? pct(t) : 0)));
  return mejor - pct(w) >= REFORZAR.puntos ? d.weakest : null;
}

/** Resultado del simulacro: nota neta con su fórmula, comparación con el mínimo y desglose (RES-01, RES-02, RES-04). */
export function Resultado() {
  const store = useStore();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [resumen, setResumen] = useState<Resumen | null | 'no-encontrado'>(null);
  const [verTipos, setVerTipos] = useState(false);
  const [sello, setSello] = useState(false);
  const { plan } = usePlan();
  const reduce = useReducedMotion();

  useEffect(() => {
    store.attempts().then((list) => {
      const attempt = list.find((a) => a.id === id);
      if (!attempt) return setResumen('no-encontrado');
      // Con `correct` guardado no hace falta regenerar (y una verbal retirada no rompe el resultado).
      const results = attempt.questions.map((q) => ({
        type: q.type,
        correct: isCorrect(q),
        blank: q.answer === null,
      }));
      const desglose = breakdown(results);
      const usado = perfilDe(attempt);
      const nota = score(usado, {
        aciertos: desglose.total.aciertos,
        fallos: desglose.total.fallos,
      });
      const terminados = list
        .filter((a) => a.finishedAt !== null)
        .sort((a, b) => a.empezado - b.empezado);
      setResumen({
        nota,
        desglose,
        preguntas: usado.format.preguntas,
        numero: terminados.findIndex((a) => a.id === id) + 1,
      });
    });
  }, [store, id]);

  // El sello cae cuando la cifra termina de contar (guía §8), con vibración de éxito.
  const supera = resumen !== null && resumen !== 'no-encontrado' && resumen.nota.supera;
  useEffect(() => {
    if (!supera) return;
    const t = setTimeout(() => {
      setSello(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }, tokens.motion.countUp);
    return () => clearTimeout(t);
  }, [supera]);

  if (resumen === null) return <Loading />;
  if (resumen === 'no-encontrado')
    return <Loading text="No se ha encontrado este simulacro." error />;
  const { nota, desglose, preguntas, numero } = resumen;
  const puntos = formatNota(nota.puntos);
  const reforzar = aReforzar(desglose);
  const tiposConPreguntas = (Object.entries(desglose.byType) as [TypeCode, Tally][]).filter(
    ([, t]) => t.total,
  );
  const aptitudes = Object.entries(APTITUDE_LABELS).filter(
    ([apt]) => desglose.byAptitude[apt]?.total,
  );

  return (
    <PaperBackground scroll style={styles.content}>
      <View style={styles.cabecera}>
        <IconButton
          icon="cross"
          label="Cerrar resultado"
          onPress={() => router.replace('/inicio')}
        />
        <Text variant="label" color="graphite" style={styles.titulo}>
          Simulacro{numero > 0 ? ` nº ${numero}` : ''} · Guardia Civil
        </Text>
        <InfoFormato />
      </View>
      <Animated.View entering={entrada(0, reduce)} style={styles.bloque}>
        <Text variant="label" color="graphite">
          Puntos netos
        </Text>
        <View style={styles.nota}>
          <View
            style={styles.cifra}
            accessible
            accessibilityLabel={`Nota ${puntos} sobre ${nota.maxima}`}
          >
            <CountUp value={nota.puntos} format={formatNota} variant="scoreNumber" />
            <Text variant="questionTitle" color="graphite">
              / {nota.maxima}
            </Text>
          </View>
          {sello && (
            // El veredicto de abajo ya lo dice: el sello no se lee dos veces.
            <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <Stamp label="Apto" />
            </View>
          )}
        </View>
        <Text variant="formula" color="graphiteStrong">
          ({nota.formula}) × {nota.maxima}/{preguntas} = {puntos}
        </Text>
        {nota.puntos < 0 && (
          <Text variant="caption" color="graphite">
            Pendiente de confirmar: las bases no dicen si una nota negativa se recorta a 0.
          </Text>
        )}
        <Text variant="bodyStrong">
          {nota.supera ? 'Llegas' : 'No llegas'} a la nota mínima ({nota.minima}).
        </Text>
      </Animated.View>
      <Animated.View entering={entrada(2, reduce)}>
        <GlassCard>
          <View style={styles.cuentas}>
            <Cuenta valor={desglose.total.aciertos} uno="acierto" varios="aciertos" />
            <Cuenta valor={desglose.total.fallos} uno="fallo" varios="fallos" rojo />
            <Cuenta valor={nota.enBlanco} uno="en blanco" varios="en blanco" />
          </View>
        </GlassCard>
      </Animated.View>
      <Animated.View entering={entrada(3, reduce)} style={styles.bloque}>
        <Text variant="label" color="graphite" accessibilityRole="header">
          Por aptitud
        </Text>
        <View style={styles.barras}>
          {aptitudes.map(([apt, label], i) => (
            <AptitudeBar
              key={apt}
              label={label}
              percent={pct(desglose.byAptitude[apt]!)}
              weak={apt === reforzar}
              orden={i}
            />
          ))}
        </View>
        <PressScale
          onPress={() => setVerTipos((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel="Desglose por tipo"
          accessibilityState={{ expanded: verTipos }}
          style={styles.plegable}
        >
          <Text variant="label" color="graphite">
            Por tipo
          </Text>
          <View style={verTipos && styles.girado}>
            <Icon name="chevron" color="graphite" size={tokens.size.chevron} />
          </View>
        </PressScale>
        {verTipos &&
          tiposConPreguntas.map(([code, t]) => (
            <Text key={code}>
              {taxonomy[code].nombre}: {t.correct} de {t.total} · {pct(t)} %
            </Text>
          ))}
      </Animated.View>
      {!plan.premium && (
        <Animated.View entering={entrada(4, reduce)}>
          <PressScale
            onPress={() => router.push('/muro-pago')}
            accessibilityRole="button"
            accessibilityLabel="Simulacros ilimitados y nivel por aptitud con Premium. Ver Premium"
            style={styles.premium}
          >
            <View style={styles.premiumTexto}>
              <Text variant="label" color="graphiteStrong">
                Aptiq Premium
              </Text>
              <Text variant="bodyStrong">Simulacros ilimitados y nivel por aptitud</Text>
            </View>
            <Icon name="chevron" size={tokens.size.chevron} />
          </PressScale>
        </Animated.View>
      )}
      <View style={styles.acciones}>
        <Button
          label="Ver explicaciones"
          onPress={() => router.push({ pathname: '/repasar', params: { id } })}
          variant="primary"
        />
        <Button
          label="Volver al inicio"
          onPress={() => router.replace('/inicio')}
          variant="secondary"
        />
      </View>
    </PaperBackground>
  );
}

function Cuenta({
  valor,
  uno,
  varios,
  rojo = false,
}: {
  valor: number;
  uno: string;
  varios: string;
  /** Rojo solo si hay fallos: el rojo comunica estado (guía §1). */
  rojo?: boolean;
}) {
  const texto = valor === 1 ? uno : varios;
  return (
    <View style={styles.cuenta} accessible accessibilityLabel={`${valor} ${texto}`}>
      <Text variant="questionTitle" color={rojo && valor > 0 ? 'sealText' : 'ink'}>
        {valor}
      </Text>
      <Text variant="label" color="graphite">
        {texto}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.l },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.s },
  titulo: { flex: 1 },
  bloque: { gap: tokens.spacing.s },
  nota: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: tokens.spacing.l },
  cifra: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: tokens.spacing.s,
    flexShrink: 1,
  },
  barras: { gap: tokens.spacing.l },
  plegable: {
    minHeight: tokens.size.touchMin,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.s,
  },
  girado: { transform: [{ rotate: '90deg' }] },
  cuentas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: tokens.spacing.m,
  },
  cuenta: { gap: tokens.spacing.xs },
  premium: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.m,
    padding: tokens.spacing.xl,
    backgroundColor: tokens.color.paperCard,
    borderRadius: tokens.radius.card,
    borderWidth: tokens.border.hairline,
    borderColor: tokens.color.line,
  },
  premiumTexto: { flex: 1, gap: tokens.spacing.xs },
  acciones: { gap: tokens.spacing.s },
});
