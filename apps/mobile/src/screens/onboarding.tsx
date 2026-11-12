import { type Item, type Level, estimateLevels } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Button, OptionBubble, PaperBackground, SourceNote, Text } from '@aptiq/ui';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { useStore } from '@/data/provider';
import { startRun } from '@/practice/run';

const LETTERS = ['A', 'B', 'C', 'D'] as const;
const TEST_QUESTIONS = 12; // 2 por tipo: 12 preguntas en 10 minutos (ONB-02)

type Step = 'oposicion' | 'fecha' | 'test';

/** Elegir oposición y fecha, y hacer el test de nivel (ONB-01, ONB-02). */
export function Onboarding() {
  const store = useStore();
  const [step, setStep] = useState<Step>('oposicion');
  const [fecha, setFecha] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  async function empezarTest() {
    await store.setSetting('oposicion', 'guardia-civil-2026');
    if (fecha.trim()) await store.setSetting('fecha', fecha.trim());
    const preguntas = await startRun(store, {
      count: TEST_QUESTIONS,
      reparto: 'equitativo',
      sessionSeed: `test-${Date.now()}`,
      levelFor: () => 2 as Level,
    });
    setItems(preguntas);
    setStep('test');
  }

  async function siguiente() {
    const nuevas = [...answers, selected];
    if (index + 1 < items.length) {
      setAnswers(nuevas);
      setIndex(index + 1);
      setSelected(null);
      return;
    }
    const porTipo = items.map((item, i) => ({
      type: item.type,
      correct: nuevas[i] === item.answerIndex,
      blank: nuevas[i] === null || nuevas[i] === undefined,
    }));
    const niveles = estimateLevels(porTipo);
    await store.saveSession({
      id: `test-${Date.now()}`,
      creada: Date.now(),
      questions: items.map((item, i) => ({
        type: item.type,
        level: item.level,
        seed: item.seed,
        answer: nuevas[i] ?? null,
        marked: false,
      })),
    });
    await store.setSetting('niveles', JSON.stringify(niveles));
    router.replace('/inicio');
  }

  if (step === 'oposicion') {
    return (
      <PaperBackground>
        <View style={styles.content}>
          <Text variant="label" color="graphite">
            Paso 1 de 3
          </Text>
          <Text variant="screenTitle" accessibilityRole="header">
            ¿Qué oposición preparas?
          </Text>
          <Button
            label="Guardia Civil · Escala de Cabos y Guardias"
            onPress={() => setStep('fecha')}
            variant="primary"
          />
          <SourceNote organismo="BOE · Resolución 160/38243/2026" />
          <Text variant="caption" color="graphite">
            Aptiq es independiente de la Administración.
          </Text>
        </View>
      </PaperBackground>
    );
  }

  if (step === 'fecha') {
    return (
      <PaperBackground>
        <View style={styles.content}>
          <Text variant="label" color="graphite">
            Paso 2 de 3
          </Text>
          <Text variant="screenTitle" accessibilityRole="header">
            ¿Cuándo es tu examen?
          </Text>
          <Text color="graphite">Opcional. Sirve para calcular cuánto te queda.</Text>
          <TextInput
            value={fecha}
            onChangeText={setFecha}
            placeholder="AAAA-MM-DD"
            accessibilityLabel="Fecha prevista del examen"
            style={styles.input}
            keyboardType="numbers-and-punctuation"
          />
          <Button label="Hacer el test de nivel" onPress={empezarTest} variant="primary" />
        </View>
      </PaperBackground>
    );
  }

  const item = items[index];
  if (!item) return null;
  return (
    <PaperBackground scroll>
      <View style={styles.content}>
        <Text variant="label" color="graphite">
          Test de nivel · {index + 1} de {items.length}
        </Text>
        <Text variant="questionTitle">{item.stem.text}</Text>
        {item.options.map((value, i) => (
          <OptionBubble
            key={i}
            letter={LETTERS[i] ?? ''}
            value={value}
            state={selected === i ? 'marked' : 'empty'}
            onPress={() => setSelected(i)}
          />
        ))}
        <Button
          label={index + 1 < items.length ? 'Siguiente' : 'Ver mi nivel'}
          onPress={siguiente}
          disabled={selected === null}
          variant="primary"
        />
        <Text variant="caption" color="graphite">
          Estimación orientativa: con {TEST_QUESTIONS} preguntas el nivel es aproximado.
        </Text>
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
  input: {
    minHeight: tokens.size.buttonHeight,
    borderWidth: tokens.border.default,
    borderColor: tokens.color.ink,
    borderRadius: tokens.radius.button,
    paddingHorizontal: tokens.spacing.l,
    color: tokens.color.ink,
    ...tokens.type.body,
  },
});
