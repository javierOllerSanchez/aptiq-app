import {
  answer,
  clear,
  createExam,
  type ExamState,
  finish,
  goTo,
  type Item,
  mark,
  taxonomy,
} from '@aptiq/engine';
import { track } from '@/analytics/analytics';
import { instantanea, perfilDe, type PerfilUsado } from '@/content/content';
import { tokens } from '@aptiq/tokens';
import {
  Button,
  Icon,
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

import { loadProgress, permiso } from '@/progress/data';
import { usePlan } from '@/purchases/provider';
import { useStore } from '@/data/provider';
import type { Store } from '@/data/store';
import { useExamClock } from '@/hooks/use-exam-clock';
import {
  APTITUDE_LABELS,
  avisoMezcla,
  cita,
  fromSaved,
  startRun,
  toSaved,
} from '@/practice/run';
import { Loading } from '@/screens/loading';
import { Opciones } from '@/screens/opciones';
import { Pregunta } from '@/screens/pregunta';

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

interface Listo {
  id: string;
  items: Item[];
  exam: ExamState;
  /** Perfil con que empezó: se guarda con el intento (ADM-03). */
  usado: PerfilUsado;
}

/**
 * Simulacro con el formato oficial del perfil (SIM-01). Si hay uno abierto (la app se cerró a mitad),
 * se retoma con su hora de inicio: el tiempo sigue contando como en el examen real (NFR-03).
 */
export function Simulacro() {
  const store = useStore();
  const { plan, api } = usePlan();
  const [listo, setListo] = useState<Listo | null>(null);

  useEffect(() => {
    (async () => {
      const abierto = (await store.attempts()).find((a) => a.finishedAt === null);
      if (abierto) {
        const items = fromSaved(abierto.questions);
        const base = createExam(items.length, abierto.empezado, abierto.durationMs);
        setListo({
          id: abierto.id,
          usado: perfilDe(abierto),
          items,
          exam: {
            ...base,
            answers: abierto.questions.map((q) => q.answer),
            marked: abierto.questions.map((q) => q.marked),
          },
        });
        return;
      }
      const premium = await api.plan().then((p) => p.premium, () => plan.premium);
      if (!permiso(await loadProgress(store), premium).simulacro) return router.replace('/muro-pago');
      const usado = instantanea();
      const { preguntas, minutos } = usado.format;
      if (preguntas === null || minutos === null)
        throw new Error('El perfil no tiene el formato completo');
      const items = await startRun(store, {
        count: preguntas,
        reparto: 'equitativo',
        sessionSeed: `s-${Date.now()}`,
        levelFor: () => 3,
      });
      // El reloj empieza cuando las preguntas ya están listas: preparar no gasta tiempo del examen.
      const empezado = Date.now();
      void track(store, 'simulacro_empezado');
      setListo({
        id: `i-${empezado}`,
        usado,
        items,
        exam: createExam(items.length, empezado, minutos * 60_000),
      });
    })();
    // El plan se lee al entrar: un simulacro empezado no se corta si cambia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  if (!listo) return <Loading text="Preparando el simulacro…" />;
  return <SimulacroEnCurso store={store} {...listo} />;
}

function SimulacroEnCurso({ store, id, items, usado, exam: initial }: Listo & { store: Store }) {
  const [exam, setExam] = useState(initial);
  const remaining = useExamClock(exam);
  const item = items[exam.current];
  const cerrado = useRef(false);
  // Tiempo en cada pregunta (métricas ADM-02): se suma cada vez que se sale de ella.
  const tiempos = useRef<number[]>([]);
  const vista = useRef<{ i: number; desde: number } | null>(null);
  const actual = exam.current;
  useEffect(() => {
    const v = vista.current;
    if (v) tiempos.current[v.i] = (tiempos.current[v.i] ?? 0) + Date.now() - v.desde;
    vista.current = { i: actual, desde: Date.now() };
  }, [actual]);

  function confirmarSalida() {
    Alert.alert('¿Salir del simulacro?', 'El intento se descarta y no cuenta en tu historial.', [
      { text: 'Seguir', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: () => {
          cerrado.current = true;
          store.deleteAttempt(id).then(() => router.back());
        },
      },
    ]);
  }

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      confirmarSalida();
      return true;
    });
    return () => sub.remove();
  });

  // Cierre por tiempo agotado o por entrega: se calcula sin escribir estado dentro de un efecto.
  const closedAt = exam.finishedAt ?? (remaining === 0 ? exam.startedAt + exam.durationMs : null);

  // Se guarda tras cada cambio: si el sistema cierra la app, el simulacro se retoma (NFR-03).
  useEffect(() => {
    if (cerrado.current) return;
    if (closedAt !== null) {
      cerrado.current = true;
      const v = vista.current;
      if (v) tiempos.current[v.i] = (tiempos.current[v.i] ?? 0) + Date.now() - v.desde;
    }
    store
      .saveAttempt({
        id,
        empezado: exam.startedAt,
        durationMs: exam.durationMs,
        finishedAt: closedAt,
        questions: toSaved(items, exam.answers, exam.marked, tiempos.current),
        perfil: usado,
      })
      .then(() => {
        if (closedAt === null) return;
        void track(store, 'simulacro_entregado');
        router.replace({ pathname: '/resultado', params: { id } });
      });
  }, [closedAt, exam, id, items, store, usado]);

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
      `Te quedan ${plural(enBlanco, 'pregunta en blanco', 'preguntas en blanco')} y ${plural(marcadas, 'marcada', 'marcadas')} para revisar. Después no podrás cambiar respuestas.`,
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
        {usado.format.opciones !== null && (
          <Text variant="label" color="graphite">
            {usado.format.opciones - 1} fallos restan 1 acierto
          </Text>
        )}
      </View>
      <Pregunta item={item} />
      <Opciones item={item} stateOf={stateOf} onPress={(i) => setExam((e) => answer(e, e.current, i, Date.now()))} />
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
      {avisoMezcla() && (
        <Text variant="caption" color="graphite">
          {avisoMezcla()}
        </Text>
      )}
      <SourceNote cita={cita()} />
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.m },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.spacing.s,
  },
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
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.s },
});
