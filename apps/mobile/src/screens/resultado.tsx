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
import { AptitudeBar, Button, GlassCard, Icon, PaperBackground, Stamp, Text } from '@aptiq/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import { AJUSTE_MURO, debeAbrirMuro } from '@/purchases/muro';
import { usePlan } from '@/purchases/provider';
import { APTITUDE_LABELS, avisoMezcla, formatNota, isCorrect } from '@/practice/run';
import { Loading } from '@/screens/loading';

interface Resumen {
  nota: ScoreResult;
  desglose: Breakdown;
  preguntas: number | null;
}

const pct = (t: Tally) => (t.total ? Math.round((t.correct / t.total) * 100) : 0);

/** Resultado del simulacro: nota neta con su fórmula, comparación con el mínimo y desglose (RES-01, RES-02, RES-04). */
export function Resultado() {
  const store = useStore();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [resumen, setResumen] = useState<Resumen | null | 'no-encontrado'>(null);
  const [verTipos, setVerTipos] = useState(false);
  const { plan } = usePlan();

  useEffect(() => {
    store.attempts().then((list) => {
      const attempt = list.find((a) => a.id === id);
      if (!attempt) return setResumen('no-encontrado');
      // Con `correct` guardado no hace falta regenerar (y una verbal retirada no rompe el resultado).
      const results = attempt.questions.map((q) => ({ type: q.type, correct: isCorrect(q), blank: q.answer === null }));
      const desglose = breakdown(results);
      const usado = perfilDe(attempt);
      const nota = score(usado, {
        aciertos: desglose.total.aciertos,
        fallos: desglose.total.fallos,
      });
      setResumen({ nota, desglose, preguntas: usado.format.preguntas });
      // Muro de pago al terminar el primer simulacro, una sola vez y nunca en el primer arranque.
      store.getSetting(AJUSTE_MURO).then((visto) => {
        if (!debeAbrirMuro({ premium: plan.premium, visto: visto !== null, terminados: list.filter((a) => a.finishedAt !== null).length })) return;
        store.setSetting(AJUSTE_MURO, '1').then(() => router.push('/muro-pago'));
      });
    });
    // Solo al abrir el resultado: si el plan cambia después, no se vuelve a evaluar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, id]);

  if (resumen === null) return <Loading />;
  if (resumen === 'no-encontrado') return <Loading text="No se ha encontrado este simulacro." />;
  const { nota, desglose, preguntas } = resumen;
  const puntos = formatNota(nota.puntos);
  const tiposConPreguntas = (Object.entries(desglose.byType) as [TypeCode, Tally][]).filter(
    ([, t]) => t.total,
  );

  return (
    <PaperBackground scroll style={styles.content}>
      <Text variant="label" color="graphite">
        Resultado · simulacro · Guardia Civil
      </Text>
      <Text variant="label" color="graphite">
        Puntos netos
      </Text>
      <View style={styles.nota}>
        <View
          style={styles.cifra}
          accessible
          accessibilityLabel={`Nota ${puntos} sobre ${nota.maxima}`}
        >
          <Text variant="scoreNumber">{puntos}</Text>
          <Text variant="questionTitle" color="graphite">
            / {nota.maxima}
          </Text>
        </View>
        {nota.supera && (
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
      {avisoMezcla() && (
        <Text variant="caption" color="graphite">
          {avisoMezcla()}
        </Text>
      )}
      <GlassCard>
        <View style={styles.cuentas}>
          <Cuenta valor={desglose.total.aciertos} texto="Aciertos" />
          <Cuenta valor={desglose.total.fallos} texto="Fallos" rojo />
          <Cuenta valor={nota.enBlanco} texto="En blanco" />
        </View>
      </GlassCard>
      <Text variant="label" color="graphite" accessibilityRole="header">
        Por aptitud
      </Text>
      <View style={styles.barras}>
        {Object.entries(APTITUDE_LABELS).map(([apt, label]) => {
          const t = desglose.byAptitude[apt];
          return t?.total ? (
            <AptitudeBar key={apt} label={label} percent={pct(t)} weak={apt === desglose.weakest} />
          ) : null;
        })}
      </View>
      <Pressable
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
      </Pressable>
      {verTipos &&
        tiposConPreguntas.map(([code, t]) => (
          <Text key={code}>
            {taxonomy[code].nombre}: {t.correct} de {t.total} · {pct(t)} %
          </Text>
        ))}
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
    </PaperBackground>
  );
}

function Cuenta({ valor, texto, rojo = false }: { valor: number; texto: string; rojo?: boolean }) {
  return (
    <View style={styles.cuenta} accessible accessibilityLabel={`${valor} ${texto.toLowerCase()}`}>
      <Text variant="bodyStrong" color={rojo ? 'sealText' : 'ink'}>
        {valor}
      </Text>
      <Text variant="label" color="graphite">
        {texto}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.m },
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
});
