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
  easeOut,
  IconButton,
  type OptionState,
  PaperBackground,
  ProgressTicks,
  QuestionGrid,
  Sheet,
  SourceNote,
  Text,
  Timer,
} from '@aptiq/ui';
import * as Haptics from 'expo-haptics';
import { router, Stack } from 'expo-router';
import { type ComponentRef, useEffect, useRef, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  useReducedMotion,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { loadProgress, permiso } from '@/progress/data';
import { usePlan } from '@/purchases/provider';
import { useStore } from '@/data/provider';
import type { Store } from '@/data/store';
import { useExamClock } from '@/hooks/use-exam-clock';
import { APTITUDE_LABELS, cita, fromSaved, startRun, toSaved } from '@/practice/run';
import { Loading } from '@/screens/loading';
import { Opciones } from '@/screens/opciones';
import { Pregunta } from '@/screens/pregunta';

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;
/** Desplazamiento lateral que cambia de pregunta (px). */
const DESLIZA = tokens.size.touchMin + tokens.spacing.l;

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
      const premium = await api.plan().then(
        (p) => p.premium,
        () => plan.premium,
      );
      if (!permiso(await loadProgress(store), premium).simulacro)
        return router.replace('/muro-pago');
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

  if (!listo) return <Loading text="Preparando el simulacro" />;
  return <SimulacroEnCurso store={store} {...listo} />;
}

type Hoja = null | 'salir' | 'entregar' | 'preguntas';
const TITULOS = {
  preguntas: 'Preguntas',
  entregar: '¿Entregar el simulacro?',
  salir: '¿Salir del simulacro?',
} as const;

function SimulacroEnCurso({ store, id, items, usado, exam: initial }: Listo & { store: Store }) {
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const [exam, setExam] = useState(initial);
  const [hoja, setHoja] = useState<Hoja>(null);
  // Último contenido abierto: se sigue viendo mientras la hoja baja al cerrarse.
  const [abierta, setAbierta] = useState<Exclude<Hoja, null>>('preguntas');
  if (hoja && hoja !== abierta) setAbierta(hoja);
  // Sentido del último cambio de pregunta: la tarjeta entra desde ese lado.
  const [sentido, setSentido] = useState<1 | -1>(1);
  const remaining = useExamClock(exam);
  const item = items[exam.current];
  const cerrado = useRef(false);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  // Tiempo en cada pregunta (métricas ADM-02): se suma cada vez que se sale de ella.
  const tiempos = useRef<number[]>([]);
  const vista = useRef<{ i: number; desde: number } | null>(null);
  const actual = exam.current;
  useEffect(() => {
    const v = vista.current;
    if (v) tiempos.current[v.i] = (tiempos.current[v.i] ?? 0) + Date.now() - v.desde;
    vista.current = { i: actual, desde: Date.now() };
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [actual]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setHoja((h) => (h ? null : 'salir'));
      return true;
    });
    return () => sub.remove();
  }, []);

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
  const ultima = exam.current === exam.total - 1;
  const marcada = exam.marked[exam.current] ?? false;

  const ir = (i: number) => {
    if (i < 0 || i >= exam.total || i === exam.current) return;
    setSentido(i > exam.current ? 1 : -1);
    setExam((e) => goTo(e, i));
  };
  const salir = () => {
    cerrado.current = true;
    setHoja(null);
    store.deleteAttempt(id).then(() => router.back());
  };
  const entregar = () => {
    setHoja(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setExam((e) => finish(e, Date.now()));
  };

  // Deslizar a izquierda o derecha cambia de pregunta (sin interferir con el desplazamiento vertical).
  const deslizar = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-tokens.spacing.xl, tokens.spacing.xl])
    .failOffsetY([-tokens.spacing.l, tokens.spacing.l])
    .onEnd((e) => {
      if (e.translationX < -DESLIZA) ir(exam.current + 1);
      else if (e.translationX > DESLIZA) ir(exam.current - 1);
    });

  const stateOf = (i: number): OptionState =>
    exam.answers[exam.current] === i ? 'marked' : 'empty';

  // Entrada de la pregunta nueva: fundido y unos 24 px desde el lado hacia el que se avanza.
  const entra = reduce
    ? FadeIn.duration(tokens.motion.durationBase)
    : (sentido === 1 ? FadeInRight : FadeInLeft)
        .duration(tokens.motion.durationBase)
        .easing(easeOut);

  return (
    <PaperBackground style={styles.pantalla}>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <View style={styles.cabecera}>
        <IconButton icon="cross" label="Cerrar simulacro" onPress={() => setHoja('salir')} />
        <Text
          variant="label"
          color="graphite"
          style={styles.contador}
          accessibilityLabel={`Pregunta ${exam.current + 1} de ${exam.total}`}
        >
          {exam.current + 1} / {exam.total}
        </Text>
        <IconButton
          icon="flag"
          label={marcada ? 'Quitar marca' : 'Marcar para revisar'}
          active={marcada}
          onPress={() => setExam((e) => mark(e, e.current))}
        />
        <IconButton
          icon="grid"
          label="Ver todas las preguntas"
          onPress={() => setHoja('preguntas')}
        />
        <Timer remainingMs={remaining} />
      </View>
      <ProgressTicks
        total={exam.total}
        current={exam.current}
        answered={exam.answers.map((a) => a !== null)}
      />
      <ScrollView
        ref={scroll}
        style={styles.scroll}
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        <GestureDetector gesture={deslizar}>
          <Animated.View key={exam.current} entering={entra} style={styles.pregunta}>
            <Text variant="label" color="graphite">
              {APTITUDE_LABELS[tipo.aptitud] ?? tipo.aptitud} · {tipo.nombre}
            </Text>
            <Pregunta item={item} />
            <Opciones
              item={item}
              stateOf={stateOf}
              onPress={(i) => setExam((e) => answer(e, e.current, i, Date.now()))}
            />
          </Animated.View>
        </GestureDetector>
        {exam.current === 0 && (
          <View style={styles.inicio}>
            <SourceNote cita={cita()} />
            <Text variant="caption" color="graphite">
              Sin explicaciones hasta el final. Desliza para cambiar de pregunta.
            </Text>
          </View>
        )}
      </ScrollView>
      <View style={[styles.barra, { paddingBottom: Math.max(insets.bottom, tokens.spacing.l) }]}>
        <IconButton
          icon="back"
          label="Anterior"
          onPress={() => ir(exam.current - 1)}
          disabled={exam.current === 0}
        />
        <View style={styles.celdaAncha}>
          <Button
            label="Dejar en blanco"
            onPress={() => setExam((e) => clear(e, e.current, Date.now()))}
            disabled={exam.answers[exam.current] === null}
            variant="secondary"
          />
        </View>
        <View style={styles.celda}>
          <Button
            label={ultima ? 'Entregar' : 'Siguiente'}
            onPress={() => (ultima ? setHoja('entregar') : ir(exam.current + 1))}
            variant="primary"
          />
        </View>
      </View>

      {/* Una sola hoja que cambia de contenido: en iOS dos Modal seguidos pueden no presentarse. */}
      <Sheet visible={hoja !== null} onClose={() => setHoja(null)} title={TITULOS[abierta]}>
        {abierta === 'preguntas' && (
          <>
            <Text variant="formula" color="graphiteStrong">
              {plural(exam.total - enBlanco, 'respondida', 'respondidas')} · {enBlanco} en blanco ·{' '}
              {plural(marcadas, 'marcada', 'marcadas')}
            </Text>
            <ScrollView style={styles.cuadricula}>
              <QuestionGrid
                answered={exam.answers.map((a) => a !== null)}
                marked={exam.marked}
                current={exam.current}
                onSelect={(i) => {
                  setHoja(null);
                  ir(i);
                }}
              />
            </ScrollView>
            <Button
              label="Entregar simulacro"
              onPress={() => setHoja('entregar')}
              variant="primary"
            />
          </>
        )}
        {abierta === 'entregar' && (
          <>
            <Text color="graphiteStrong">
              Te quedan {plural(enBlanco, 'pregunta en blanco', 'preguntas en blanco')} y{' '}
              {plural(marcadas, 'marcada', 'marcadas')} para revisar. Después no podrás cambiar
              respuestas.
            </Text>
            <View style={styles.acciones}>
              <Button label="Entregar ahora" onPress={entregar} variant="primary" />
              <Button label="Seguir" onPress={() => setHoja(null)} variant="secondary" />
            </View>
          </>
        )}
        {abierta === 'salir' && (
          <>
            <Text color="graphiteStrong">El intento se descarta y no cuenta en tu historial.</Text>
            <View style={styles.acciones}>
              <Button
                label="Seguir con el simulacro"
                onPress={() => setHoja(null)}
                variant="primary"
              />
              <Button label="Salir y descartar" onPress={salir} variant="secondary" />
            </View>
          </>
        )}
      </Sheet>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  // Sin margen inferior propio: la barra de acciones ya suma el área segura.
  pantalla: { gap: tokens.spacing.m, paddingBottom: 0 },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.xs },
  contador: { flex: 1, paddingLeft: tokens.spacing.xs },
  scroll: { flex: 1, marginHorizontal: -tokens.spacing.screenX },
  contenido: {
    paddingHorizontal: tokens.spacing.screenX,
    paddingBottom: tokens.spacing.xxl,
    gap: tokens.spacing.l,
  },
  pregunta: { gap: tokens.spacing.m },
  inicio: { gap: tokens.spacing.s },
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.s,
    paddingTop: tokens.spacing.s,
  },
  celda: { flex: 1 },
  // «Dejar en blanco» es más largo que «Siguiente»: así cabe en una línea.
  celdaAncha: { flex: 1.3 },
  cuadricula: { flexGrow: 0 },
  acciones: { gap: tokens.spacing.s },
});
