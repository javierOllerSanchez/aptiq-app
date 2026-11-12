import { createExam, estimateLevels, type ExamState, type Item, type Level } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import {
  Button,
  OptionBubble,
  PaperBackground,
  ProgressTicks,
  SourceNote,
  Text,
  textStyle,
  Timer,
} from '@aptiq/ui';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { useStore } from '@/data/provider';
import type { Store } from '@/data/store';
import { useExamClock } from '@/hooks/use-exam-clock';
import { FUENTE, startRun } from '@/practice/run';

const LETTERS = ['A', 'B', 'C', 'D'] as const;
const TEST_QUESTIONS = 12; // 2 por tipo (ONB-02)
const TEST_MINUTES = 10;
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

type Step = 'oposicion' | 'fecha' | 'test';

/** Elegir oposición y fecha, y hacer el test de nivel de 10 minutos (ONB-01, ONB-02). */
export function Onboarding() {
  const store = useStore();
  const [step, setStep] = useState<Step>('oposicion');
  const [fecha, setFecha] = useState('');
  const [test, setTest] = useState<{ items: Item[]; exam: ExamState } | null>(null);
  const fechaValida = fecha.trim() === '' || FECHA.test(fecha.trim());

  async function empezarTest() {
    await store.setSetting('oposicion', 'guardia-civil-2026');
    if (fecha.trim()) await store.setSetting('fecha', fecha.trim());
    const now = Date.now();
    const items = await startRun(store, {
      count: TEST_QUESTIONS,
      reparto: 'equitativo',
      sessionSeed: `test-${now}`,
      levelFor: () => 2 as Level,
    });
    setTest({ items, exam: createExam(items.length, now, TEST_MINUTES * 60_000) });
    setStep('test');
  }

  if (step === 'oposicion') {
    return (
      <PaperBackground scroll style={styles.content}>
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
        <SourceNote organismo={FUENTE} />
        <Text variant="caption" color="graphite">
          Aptiq es independiente de la Administración.
        </Text>
      </PaperBackground>
    );
  }

  if (step === 'fecha' || !test) {
    return (
      <PaperBackground scroll style={styles.content}>
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
          placeholderTextColor={tokens.color.graphite}
          accessibilityLabel="Fecha prevista del examen, formato año, mes y día"
          style={[textStyle('body'), styles.input]}
        />
        {!fechaValida && (
          <Text color="sealText" accessibilityLiveRegion="polite">
            Escribe la fecha como 2027-06-15, o déjala vacía.
          </Text>
        )}
        <Button
          label="Hacer el test de nivel"
          onPress={empezarTest}
          disabled={!fechaValida}
          variant="primary"
        />
        <Text variant="caption" color="graphite">
          {TEST_QUESTIONS} preguntas en {TEST_MINUTES} minutos.
        </Text>
      </PaperBackground>
    );
  }

  return <TestDeNivel store={store} items={test.items} exam={test.exam} />;
}

function TestDeNivel({ store, items, exam }: { store: Store; items: Item[]; exam: ExamState }) {
  const remaining = useExamClock(exam);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const done = useRef(false);

  async function terminar(finales: (number | null)[]) {
    if (done.current) return;
    done.current = true;
    const porTipo = items.map((item, i) => ({
      type: item.type,
      correct: finales[i] === item.answerIndex,
      blank: finales[i] === null || finales[i] === undefined,
    }));
    await store.saveSession({
      id: `test-${exam.startedAt}`,
      creada: exam.startedAt,
      questions: items.map((item, i) => ({
        type: item.type,
        level: item.level,
        seed: item.seed,
        answer: finales[i] ?? null,
        marked: false,
      })),
    });
    await store.setSetting('niveles', JSON.stringify(estimateLevels(porTipo)));
    router.replace('/inicio');
  }

  // Al agotarse los 10 minutos, lo no contestado cuenta como en blanco.
  useEffect(() => {
    if (remaining === 0) terminar(answers);
  });

  function siguiente(respuesta: number | null) {
    const nuevas = [...answers, respuesta];
    if (index + 1 < items.length) {
      setAnswers(nuevas);
      setIndex(index + 1);
      setSelected(null);
    } else {
      terminar(nuevas);
    }
  }

  const item = items[index];
  if (!item) return null;
  const ultima = index + 1 === items.length;
  return (
    <PaperBackground scroll style={styles.content}>
      <View style={styles.header}>
        <Text variant="label" color="graphite" style={styles.shrink}>
          Test de nivel · {index + 1} de {items.length}
        </Text>
        <Timer remainingMs={remaining} />
      </View>
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
            state={selected === i ? 'marked' : 'empty'}
            onPress={() => setSelected(i)}
          />
        ))}
      </View>
      <Button
        label={ultima ? 'Ver mi nivel' : 'Siguiente'}
        onPress={() => siguiente(selected)}
        disabled={selected === null}
        variant="primary"
      />
      <Button label="No lo sé" onPress={() => siguiente(null)} variant="secondary" />
      <Text variant="caption" color="graphite">
        Estimación orientativa: con {items.length} preguntas el nivel es aproximado.
      </Text>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.m },
  header: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: tokens.spacing.s },
  shrink: { flexShrink: 1, flexGrow: 1 },
  options: { gap: tokens.spacing.s },
  input: {
    minHeight: tokens.size.buttonHeight,
    borderWidth: tokens.border.default,
    borderColor: tokens.color.ink,
    borderRadius: tokens.radius.button,
    paddingHorizontal: tokens.spacing.l,
    color: tokens.color.ink,
  },
});
