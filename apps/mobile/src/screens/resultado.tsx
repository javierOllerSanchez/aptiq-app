import {
  breakdown,
  guardiaCivil2026,
  registry,
  type Breakdown,
  type ScoreResult,
  score,
} from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Button, GlassCard, PaperBackground, Stamp, Text } from '@aptiq/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import { APTITUDE_LABELS, OPTION_COUNT } from '@/practice/run';

interface Resumen {
  nota: ScoreResult;
  desglose: Breakdown;
}

/** Resultado del simulacro: nota neta con su fórmula y desglose por aptitud (RES-01, RES-02, RES-04). */
export function Resultado() {
  const store = useStore();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [resumen, setResumen] = useState<Resumen | null>(null);

  useEffect(() => {
    store.attempts().then((list) => {
      const attempt = list.find((a) => a.id === id);
      if (!attempt) return;
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

  if (!resumen) return null;
  const { nota, desglose } = resumen;
  const puntos = nota.puntos.toFixed(2).replace('.', ',');

  return (
    <PaperBackground scroll>
      <View style={styles.content}>
        <Text variant="label" color="graphite">
          Resultado · simulacro
        </Text>
        <GlassCard>
          <Text variant="scoreNumber" accessibilityLabel={`Nota ${puntos} sobre ${nota.maxima}`}>
            {puntos}
          </Text>
          <Text color="graphite">
            sobre {nota.maxima} · mínimo {nota.minima}
          </Text>
          <Text variant="caption" color="graphite">
            {nota.formula}
          </Text>
          {nota.puntos < 0 && (
            <Text variant="caption" color="sealText">
              Pendiente de confirmar: las bases no dicen si una nota negativa se recorta a 0.
            </Text>
          )}
        </GlassCard>
        {nota.supera && <Stamp label="Apto" />}
        <Text variant="bodyStrong">
          {nota.supera ? 'Llegas a la nota mínima.' : 'No llegas a la nota mínima.'}
        </Text>
        <Text variant="label" color="graphite">
          Por aptitud
        </Text>
        {Object.entries(desglose.byAptitude).map(([apt, t]) => (
          <Text key={apt}>
            {APTITUDE_LABELS[apt] ?? apt}: {t.correct} de {t.total - t.blank}
          </Text>
        ))}
        {desglose.weakest && (
          <Text variant="bodyStrong">
            A reforzar: {APTITUDE_LABELS[desglose.weakest] ?? desglose.weakest}
          </Text>
        )}
        <Button
          label="Repasar fallos y en blanco"
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

const styles = StyleSheet.create({
  content: {
    padding: tokens.spacing.screenX,
    gap: tokens.spacing.m,
    paddingTop: tokens.spacing.screenTop,
  },
});
