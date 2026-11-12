import type { Item } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import {
  Button,
  OptionBubble,
  type OptionState,
  PaperBackground,
  ProgressTicks,
  Text,
} from '@aptiq/ui';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import { APTITUDE_LABELS, startRun } from '@/practice/run';
import { Explicacion } from '@/screens/explicacion';
import { Loading } from '@/screens/loading';

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

  if (!items) return <Loading text="Preparando la sesión…" />;
  const item = items[index];
  if (!item) return null;
  const titulo = aptitud ? (APTITUDE_LABELS[aptitud] ?? aptitud) : 'Sesión de hoy';

  function stateOf(i: number): OptionState {
    if (!revealed) return i === selected ? 'marked' : 'empty';
    if (i === item!.answerIndex) return 'correct';
    return i === selected ? 'wrong' : 'empty';
  }

  function confirmar() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setRevealed(true);
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
    <PaperBackground scroll style={styles.content}>
      <Text variant="label" color="graphite">
        {titulo} · pregunta {index + 1} de {items.length}
      </Text>
      <ProgressTicks
        total={items.length}
        current={index}
        answered={items.map((_, i) => i < answers.length)}
      />
      <Text variant="questionTitle">{item.stem.text}</Text>
      <View accessibilityRole="radiogroup" style={styles.options}>
        {item.options.map((value, i) => (
          <OptionBubble
            key={i}
            letter={LETTERS[i] ?? ''}
            value={value}
            state={stateOf(i)}
            {...(revealed ? {} : { onPress: () => setSelected(i) })}
          />
        ))}
      </View>
      {revealed && <Explicacion item={item} answer={selected} />}
      {revealed ? (
        // Tras corregir, el amarillo es la opción correcta: el botón pasa a secundario (un solo protagonista).
        <Button
          label={index + 1 < items.length ? 'Siguiente' : 'Terminar sesión'}
          onPress={siguiente}
          variant="secondary"
        />
      ) : (
        <Button
          label="Confirmar"
          onPress={confirmar}
          disabled={selected === null}
          variant="primary"
        />
      )}
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.m },
  options: { gap: tokens.spacing.s },
});
