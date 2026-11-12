import {
  type Breakdown,
  breakdown,
  guardiaCivil2026,
  registry,
  score,
  type ScoreResult,
  type Tally,
  taxonomy,
  type TypeCode,
} from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Button, GlassCard, PaperBackground, Stamp, Text } from '@aptiq/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import { APTITUDE_LABELS, AVISO_MEZCLA, formatNota, OPTION_COUNT } from '@/practice/run';
import { Loading } from '@/screens/loading';

interface Resumen {
  nota: ScoreResult;
  desglose: Breakdown;
}

const pct = (t: Tally) => (t.total ? Math.round((t.correct / t.total) * 100) : 0);

/** Resultado del simulacro: nota neta con su fórmula, comparación con el mínimo y desglose (RES-01, RES-02, RES-04). */
export function Resultado() {
  const store = useStore();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [resumen, setResumen] = useState<Resumen | null | 'no-encontrado'>(null);

  useEffect(() => {
    store.attempts().then((list) => {
      const attempt = list.find((a) => a.id === id);
      if (!attempt) return setResumen('no-encontrado');
      const results = attempt.questions.map((q) => {
        const item = registry[q.type].generator.generate(q.seed, q.level, OPTION_COUNT);
        return { type: q.type, correct: q.answer === item.answerIndex, blank: q.answer === null };
      });
      const desglose = breakdown(results);
      const nota = score(guardiaCivil2026, {
        aciertos: desglose.total.aciertos,
        fallos: desglose.total.fallos,
      });
      setResumen({ nota, desglose });
    });
  }, [store, id]);

  if (resumen === null) return <Loading />;
  if (resumen === 'no-encontrado') return <Loading text="No se ha encontrado este simulacro." />;
  const { nota, desglose } = resumen;
  const puntos = formatNota(nota.puntos);
  const tiposConPreguntas = (Object.entries(desglose.byType) as [TypeCode, Tally][]).filter(
    ([, t]) => t.total,
  );

  return (
    <PaperBackground scroll style={styles.content}>
      <Text variant="label" color="graphite">
        Resultado · simulacro · Guardia Civil
      </Text>
      <View style={styles.nota}>
        <View style={styles.shrink}>
          <Text variant="scoreNumber" accessibilityLabel={`Nota ${puntos} sobre ${nota.maxima}`}>
            {puntos}
          </Text>
          <Text color="graphite">
            sobre {nota.maxima} · mínimo {nota.minima}
          </Text>
        </View>
        {nota.supera && <Stamp label="Apto" />}
      </View>
      <Text variant="caption" color="graphite">
        ({nota.formula}) × {nota.maxima}/{guardiaCivil2026.format.preguntas} = {puntos}
      </Text>
      {nota.puntos < 0 && (
        <Text variant="caption" color="graphite">
          Pendiente de confirmar: las bases no dicen si una nota negativa se recorta a 0.
        </Text>
      )}
      <Text variant="bodyStrong">
        {nota.supera ? 'Llegas a la nota mínima.' : 'No llegas a la nota mínima.'}
      </Text>
      {AVISO_MEZCLA && (
        <Text variant="caption" color="graphite">
          {AVISO_MEZCLA}
        </Text>
      )}
      <GlassCard>
        <View style={styles.cuentas}>
          <Cuenta valor={desglose.total.aciertos} texto="Aciertos" />
          <Cuenta valor={desglose.total.fallos} texto="Fallos" rojo />
          <Cuenta valor={nota.enBlanco} texto="En blanco" />
        </View>
      </GlassCard>
      <Text variant="label" color="graphite">
        Por aptitud
      </Text>
      {Object.entries(desglose.byAptitude).map(([apt, t]) => {
        const floja = apt === desglose.weakest;
        return (
          <Text key={apt} color={floja ? 'sealText' : 'ink'}>
            {APTITUDE_LABELS[apt] ?? apt}
            {floja ? ' · a reforzar' : ''}: {t.correct} de {t.total} · {pct(t)} %
          </Text>
        );
      })}
      <Text variant="label" color="graphite">
        Por tipo
      </Text>
      {tiposConPreguntas.map(([code, t]) => (
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
  shrink: { flexShrink: 1 },
  cuentas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: tokens.spacing.m,
  },
  cuenta: { gap: tokens.spacing.xs },
});
