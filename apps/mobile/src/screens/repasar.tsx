import { registry, reviewOf } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Button, PaperBackground, Text } from '@aptiq/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import { OPTION_COUNT } from '@/practice/run';

const LETTERS = ['A', 'B', 'C', 'D'] as const;

interface Fallo {
  key: string;
  stem: string;
  options: string[];
  answer: number | null;
  correct: number;
  wrongReason: string | null;
  rule: string;
  tip: string;
}

/** Repasar fallos y en blanco con su explicación (RES-03, EXP-02). */
export function Repasar() {
  const store = useStore();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [fallos, setFallos] = useState<Fallo[] | null>(null);

  useEffect(() => {
    store.attempts().then((list) => {
      const attempt = list.find((a) => a.id === id);
      if (!attempt) return setFallos([]);
      const out: Fallo[] = [];
      attempt.questions.forEach((q, i) => {
        const item = registry[q.type].generator.generate(q.seed, q.level, OPTION_COUNT);
        const review = reviewOf(item, q.answer);
        if (review.correct) return;
        out.push({
          key: `${i}`,
          stem: item.stem.text,
          options: item.options,
          answer: q.answer,
          correct: item.answerIndex,
          wrongReason: review.wrongReason,
          rule: item.explanation.rule,
          tip: review.tip,
        });
      });
      setFallos(out);
    });
  }, [store, id]);

  if (!fallos) return null;
  return (
    <PaperBackground scroll>
      <View style={styles.content}>
        <Text variant="screenTitle" accessibilityRole="header">
          Repasar fallos
        </Text>
        {fallos.length === 0 && <Text color="graphite">No hay fallos ni preguntas en blanco.</Text>}
        {fallos.map((f, n) => (
          <View key={f.key} style={styles.card}>
            <Text variant="label" color="graphite">
              Pregunta {n + 1}
            </Text>
            <Text variant="questionTitle">{f.stem}</Text>
            <Text>
              Respuesta correcta: {LETTERS[f.correct]} · {f.options[f.correct]}
            </Text>
            <Text>
              {f.answer === null
                ? 'En blanco'
                : `Tu respuesta: ${LETTERS[f.answer]} · ${f.options[f.answer]}`}
            </Text>
            {f.wrongReason && <Text color="sealText">{f.wrongReason}</Text>}
            <Text>{f.rule}</Text>
            <Text variant="bodyStrong">Truco: {f.tip}</Text>
          </View>
        ))}
        <Button label="Volver al resultado" onPress={() => router.back()} variant="secondary" />
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
  card: { gap: tokens.spacing.s },
});
