import { type Item, reviewOf } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Button, OptionBubble, PaperBackground, ProgressTicks, Text } from '@aptiq/ui';
import type { OptionState } from '@aptiq/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import { startRun } from '@/practice/run';

const LETTERS = ['A', 'B', 'C', 'D'] as const;
const SESSION_QUESTIONS = 10;

/** Práctica: una aptitud concreta, o la sesión de hoy sin aptitud (ENT-01, ENT-02, EXP-01–03). */
export function Practica() {
  const store = useStore();
  const { aptitud } = useLocalSearchParams<{ aptitud?: string }>();
  const [items, setItems] = useState<Item[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    startRun(store, {
      count: SESSION_QUESTIONS,
      reparto: aptitud ? 'equitativo' : 'prioritario',
      ...(aptitud ? { aptitude: aptitud } : {}),
      sessionSeed: `p-${Date.now()}`,
      levelFor: () => 2,
    }).then(setItems);
  }, [store, aptitud]);

  if (!items) return null;
  const item = items[index];
  if (!item) return null;
  const review = reviewOf(item, selected);

  function stateOf(i: number): OptionState {
    if (revealed) {
      if (i === item!.answerIndex) return 'correct';
      if (i === selected) return 'wrong';
      return 'empty';
    }
    return i === selected ? 'marked' : 'empty';
  }

  async function siguiente() {
    const nuevas = [...answers, selected];
    if (index + 1 < items!.length) {
      setAnswers(nuevas);
      setIndex(index + 1);
      setSelected(null);
      setRevealed(false);
      return;
    }
    await store.saveSession({
      id: `p-${Date.now()}`,
      creada: Date.now(),
      questions: items!.map((it, i) => ({
        type: it.type,
        level: it.level,
        seed: it.seed,
        answer: nuevas[i] ?? null,
        marked: false,
      })),
    });
    router.replace('/inicio');
  }

  return (
    <PaperBackground scroll>
      <View style={styles.content}>
        <ProgressTicks
          total={items.length}
          current={index}
          answered={items.map((_, i) => i < answers.length)}
        />
        <Text variant="label" color="graphite">
          Pregunta {index + 1} de {items.length}
        </Text>
        <Text variant="questionTitle">{item.stem.text}</Text>
        {item.options.map((value, i) => (
          <OptionBubble
            key={i}
            letter={LETTERS[i] ?? ''}
            value={value}
            state={stateOf(i)}
            onPress={() => {
              if (!revealed) setSelected(i);
            }}
          />
        ))}
        {revealed && (
          <View style={styles.explanation}>
            <Text variant="bodyStrong">{review.correct ? 'Correcta.' : 'No es esta.'}</Text>
            <Text>{item.explanation.observe}</Text>
            <Text>{item.explanation.rule}</Text>
            <Text>{item.explanation.apply}</Text>
            {review.wrongReason && <Text color="sealText">{review.wrongReason}</Text>}
            <Text variant="bodyStrong">Truco: {review.tip}</Text>
          </View>
        )}
        {revealed ? (
          <Button
            label={index + 1 < items.length ? 'Siguiente' : 'Terminar sesión'}
            onPress={siguiente}
            variant="primary"
          />
        ) : (
          <Button
            label="Confirmar"
            onPress={() => setRevealed(true)}
            disabled={selected === null}
            variant="primary"
          />
        )}
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
  explanation: { gap: tokens.spacing.s },
});
