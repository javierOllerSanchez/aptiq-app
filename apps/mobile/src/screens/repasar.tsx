import { type Item, registry, reviewOf } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Button, OptionBubble, PaperBackground, Text } from '@aptiq/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import { OPTION_COUNT } from '@/practice/run';
import { Explicacion } from '@/screens/explicacion';
import { Loading } from '@/screens/loading';

const LETTERS = ['A', 'B', 'C', 'D'] as const;

interface Fallo {
  n: number;
  item: Item;
  answer: number | null;
}

/** Repasar fallos y preguntas en blanco con su explicación (RES-03, EXP-01–03). */
export function Repasar() {
  const store = useStore();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [fallos, setFallos] = useState<Fallo[] | null>(null);

  useEffect(() => {
    store.attempts().then((list) => {
      const attempt = list.find((a) => a.id === id);
      const out: Fallo[] = [];
      attempt?.questions.forEach((q, i) => {
        const item = registry[q.type].generator.generate(q.seed, q.level, OPTION_COUNT);
        if (!reviewOf(item, q.answer).correct) out.push({ n: i + 1, item, answer: q.answer });
      });
      setFallos(out);
    });
  }, [store, id]);

  if (!fallos) return <Loading />;
  return (
    <PaperBackground scroll style={styles.content}>
      <Text variant="screenTitle" accessibilityRole="header">
        Fallos y en blanco ({fallos.length})
      </Text>
      {fallos.length === 0 && <Text color="graphite">No hay fallos ni preguntas en blanco.</Text>}
      {fallos.map(({ n, item, answer }) => (
        <View key={n} style={styles.card}>
          <Text variant="label" color="graphite">
            Pregunta {n} · {answer === null ? 'en blanco' : 'fallo'}
          </Text>
          <Text variant="questionTitle">{item.stem.text}</Text>
          {item.options.map((value, i) => (
            <OptionBubble
              key={i}
              letter={LETTERS[i] ?? ''}
              value={value}
              state={i === item.answerIndex ? 'correct' : i === answer ? 'wrong' : 'empty'}
            />
          ))}
          <Explicacion item={item} answer={answer} />
        </View>
      ))}
      <Button label="Volver al resultado" onPress={() => router.back()} variant="secondary" />
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.m },
  card: {
    gap: tokens.spacing.s,
    padding: tokens.spacing.l,
    backgroundColor: tokens.color.paperCard,
    borderRadius: tokens.radius.card,
    borderWidth: tokens.border.hairline,
    borderColor: tokens.color.line,
  },
});
