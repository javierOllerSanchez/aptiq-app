import {
  type ExamState,
  answer,
  createExam,
  finish,
  goTo,
  guardiaCivil2026,
  type Item,
  mark,
} from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Button, OptionBubble, PaperBackground, ProgressTicks, Text } from '@aptiq/ui';
import type { OptionState } from '@aptiq/ui';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useExamClock } from '@/hooks/use-exam-clock';
import { useStore } from '@/data/provider';
import type { Store } from '@/data/store';
import { startRun } from '@/practice/run';

const LETTERS = ['A', 'B', 'C', 'D'] as const;

/** Simulacro con el formato oficial del perfil: número de preguntas, tiempo y opciones (SIM-01). */
export function Simulacro() {
  const store = useStore();
  const [start] = useState(() => Date.now());
  const [ready, setReady] = useState<{ items: Item[]; exam: ExamState } | null>(null);

  useEffect(() => {
    const { preguntas, minutos } = guardiaCivil2026.format;
    if (preguntas === null || minutos === null)
      throw new Error('El perfil no tiene el formato completo');
    startRun(store, {
      count: preguntas,
      reparto: 'equitativo',
      sessionSeed: `s-${start}`,
      levelFor: () => 3,
    }).then((items) =>
      setReady({ items, exam: createExam(items.length, start, minutos * 60_000) }),
    );
  }, [store, start]);

  if (!ready) return null;
  return <SimulacroEnCurso store={store} items={ready.items} exam={ready.exam} />;
}

function SimulacroEnCurso({
  store,
  items,
  exam: initial,
}: {
  store: Store;
  items: Item[];
  exam: ExamState;
}) {
  const [exam, setExam] = useState(initial);
  const remaining = useExamClock(exam);
  const item = items[exam.current];
  const saved = useRef(false);

  // Cierre por tiempo agotado o por entrega: se calcula sin escribir estado dentro de un efecto.
  const closedAt = exam.finishedAt ?? (remaining === 0 ? exam.startedAt + exam.durationMs : null);

  useEffect(() => {
    if (closedAt === null || saved.current) return;
    saved.current = true;
    const id = `i-${exam.startedAt}`;
    store
      .saveAttempt({
        id,
        empezado: exam.startedAt,
        durationMs: exam.durationMs,
        finishedAt: closedAt,
        questions: items.map((it, i) => ({
          type: it.type,
          level: it.level,
          seed: it.seed,
          answer: exam.answers[i] ?? null,
          marked: exam.marked[i] ?? false,
        })),
      })
      .then(() => router.replace({ pathname: '/resultado', params: { id } }));
  }, [closedAt, exam, items, store]);

  if (!item) return null;
  const seconds = Math.ceil(remaining / 1000);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  function stateOf(i: number): OptionState {
    return exam.answers[exam.current] === i ? 'marked' : 'empty';
  }

  return (
    <PaperBackground scroll>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="label" color="graphite">
            Pregunta {exam.current + 1} de {exam.total}
          </Text>
          <Text variant="timer" accessibilityLabel={`Tiempo restante ${mm}:${ss}`}>
            {mm}:{ss}
          </Text>
        </View>
        <ProgressTicks
          total={exam.total}
          current={exam.current}
          answered={exam.answers.map((a) => a !== null)}
        />
        <Text variant="questionTitle">{item.stem.text}</Text>
        {item.options.map((value, i) => (
          <OptionBubble
            key={i}
            letter={LETTERS[i] ?? ''}
            value={value}
            state={stateOf(i)}
            onPress={() => setExam((e) => answer(e, e.current, i, Date.now()))}
          />
        ))}
        <View style={styles.row}>
          <Button
            label={exam.marked[exam.current] ? 'Quitar marca' : 'Marcar para revisar'}
            onPress={() => setExam((e) => mark(e, e.current))}
            variant="secondary"
          />
          <Button
            label="Anterior"
            onPress={() => setExam((e) => goTo(e, Math.max(0, e.current - 1)))}
            disabled={exam.current === 0}
            variant="secondary"
          />
          <Button
            label="Siguiente"
            onPress={() => setExam((e) => goTo(e, Math.min(e.total - 1, e.current + 1)))}
            disabled={exam.current === exam.total - 1}
            variant="secondary"
          />
        </View>
        <Button
          label="Entregar simulacro"
          onPress={() => setExam((e) => finish(e, Date.now()))}
          variant="primary"
        />
        <Text variant="caption" color="graphite">
          Sin explicaciones hasta el final del simulacro.
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.s },
});
