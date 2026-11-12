import {
  answer,
  clear,
  createExam,
  type ExamState,
  finish,
  goTo,
  guardiaCivil2026,
  type Item,
  mark,
  taxonomy,
} from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import {
  Button,
  Icon,
  OptionBubble,
  type OptionState,
  PaperBackground,
  ProgressTicks,
  SourceNote,
  Text,
  Timer,
} from '@aptiq/ui';
import { router, Stack } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Pressable, StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import type { Store } from '@/data/store';
import { useExamClock } from '@/hooks/use-exam-clock';
import { APTITUDE_LABELS, FUENTE, startRun } from '@/practice/run';
import { Loading } from '@/screens/loading';

const LETTERS = ['A', 'B', 'C', 'D'] as const;
const { opciones } = guardiaCivil2026.format;

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

  if (!ready) return <Loading text="Preparando el simulacro…" />;
  return <SimulacroEnCurso store={store} items={ready.items} exam={ready.exam} />;
}

/** Salir sin entregar pierde el intento: siempre se pregunta antes (botón cerrar y Atrás de Android). */
function confirmarSalida() {
  Alert.alert('¿Salir del simulacro?', 'El intento no se guarda.', [
    { text: 'Seguir', style: 'cancel' },
    { text: 'Salir', style: 'destructive', onPress: () => router.back() },
  ]);
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

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      confirmarSalida();
      return true;
    });
    return () => sub.remove();
  }, []);

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
  const tipo = taxonomy[item.type];
  const enBlanco = exam.answers.filter((a) => a === null).length;
  const marcadas = exam.marked.filter(Boolean).length;
  const siguienteMarcada = [...exam.marked.keys()]
    .map((k) => (exam.current + 1 + k) % exam.total)
    .find((i) => exam.marked[i] && i !== exam.current);

  function entregar() {
    Alert.alert(
      '¿Entregar el simulacro?',
      `Quedan ${enBlanco} en blanco y ${marcadas} marcadas para revisar. Después no podrás cambiar respuestas.`,
      [
        { text: 'Seguir', style: 'cancel' },
        { text: 'Entregar ahora', onPress: () => setExam((e) => finish(e, Date.now())) },
      ],
    );
  }

  const stateOf = (i: number): OptionState =>
    exam.answers[exam.current] === i ? 'marked' : 'empty';

  return (
    <PaperBackground scroll style={styles.content}>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <View style={styles.header}>
        <Pressable
          onPress={confirmarSalida}
          accessibilityRole="button"
          accessibilityLabel="Cerrar simulacro"
          style={styles.close}
        >
          <Icon name="cross" />
        </Pressable>
        <Text variant="label" color="graphite" style={styles.shrink}>
          Pregunta {exam.current + 1} de {exam.total}
        </Text>
        <Timer remainingMs={remaining} />
      </View>
      <ProgressTicks
        total={exam.total}
        current={exam.current}
        answered={exam.answers.map((a) => a !== null)}
      />
      <View style={styles.header}>
        <Text variant="label" color="graphite" style={styles.tipo}>
          {APTITUDE_LABELS[tipo.aptitud] ?? tipo.aptitud} · {tipo.nombre}
        </Text>
        {opciones !== null && (
          <Text variant="label" color="graphite">
            {opciones - 1} fallos = −1
          </Text>
        )}
      </View>
      <Text variant="questionTitle">{item.stem.text}</Text>
      <View accessibilityRole="radiogroup" style={styles.options}>
        {item.options.map((value, i) => (
          <OptionBubble
            key={i}
            letter={LETTERS[i] ?? ''}
            value={value}
            state={stateOf(i)}
            onPress={() => setExam((e) => answer(e, e.current, i, Date.now()))}
          />
        ))}
      </View>
      <View style={styles.row}>
        <Button
          label="Dejar en blanco"
          onPress={() => setExam((e) => clear(e, e.current, Date.now()))}
          disabled={exam.answers[exam.current] === null}
          variant="secondary"
        />
        <Button
          label={exam.marked[exam.current] ? 'Quitar marca' : 'Marcar para revisar'}
          onPress={() => setExam((e) => mark(e, e.current))}
          variant="secondary"
        />
      </View>
      <View style={styles.row}>
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
        <Button
          label="Siguiente marcada"
          onPress={() =>
            siguienteMarcada !== undefined && setExam((e) => goTo(e, siguienteMarcada))
          }
          disabled={siguienteMarcada === undefined}
          variant="secondary"
        />
      </View>
      <Button label="Entregar simulacro" onPress={entregar} variant="primary" />
      <Text variant="caption" color="graphite">
        Sin explicaciones hasta el final del simulacro.
      </Text>
      <SourceNote organismo={FUENTE} />
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.m },
  header: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: tokens.spacing.s },
  shrink: { flexShrink: 1, flexGrow: 1 },
  // Con texto grande, la penalización baja de línea antes que partir el nombre del tipo.
  tipo: { flexShrink: 1, flexGrow: 1, minWidth: '60%' },
  close: {
    width: tokens.size.touchMin,
    height: tokens.size.touchMin,
    borderRadius: tokens.radius.pill,
    borderWidth: tokens.border.default,
    borderColor: tokens.color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  options: { gap: tokens.spacing.s },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.s },
});
