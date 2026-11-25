import {
  createExam,
  estimateLevels,
  type ExamState,
  isBankType,
  type Item,
  type Level,
  typeCodes,
} from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import {
  Button,
  entrada,
  Logo,
  MonthPicker,
  PaperBackground,
  PressScale,
  ProgressTicks,
  SourceNote,
  Text,
  Timer,
} from '@aptiq/ui';
import { router } from 'expo-router';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { permisoAnalitica } from '@/analytics/analytics';
import { useStore } from '@/data/provider';
import type { Store } from '@/data/store';
import { useExamClock } from '@/hooks/use-exam-clock';
import { cita, startRun, toSaved } from '@/practice/run';
import { diaLocal } from '@/progress/data';
import { Opciones } from '@/screens/opciones';
import { Pregunta } from '@/screens/pregunta';

/** Tipos del test de nivel: los generados por código (las verbales del banco dependen de lo aprobado). */
const TIPOS_TEST = typeCodes.filter((t) => !isBankType(t));
const TEST_QUESTIONS = 2 * TIPOS_TEST.length; // 2 por tipo (ONB-02; 18 desde la fase 8)
const TEST_MINUTES = 10;

/**
 * «AAAA-MM» → último día de ese mes («2027-02» → «2027-02-28»). Las convocatorias se anuncian por
 * mes: así la cuenta atrás no desaparece hasta que termina el mes del examen.
 */
export function finDeMes(mes: string): string {
  const [y, m] = [Number(mes.slice(0, 4)), Number(mes.slice(5, 7))];
  const ultimo = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${mes}-${String(ultimo).padStart(2, '0')}`;
}

type Step = 'bienvenida' | 'oposicion' | 'fecha' | 'test';

/** Bienvenida, oposición, mes del examen y test de nivel de 10 minutos (ONB-01, ONB-02). */
export function Onboarding() {
  const store = useStore();
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>('bienvenida');
  const [mes, setMes] = useState<string | null>(null);
  // Mes en curso al abrir: los meses anteriores no se pueden elegir.
  const [hoy] = useState(() => diaLocal(Date.now()).slice(0, 7));
  const [test, setTest] = useState<{ items: Item[]; exam: ExamState } | null>(null);

  async function empezarTest() {
    await store.setSetting('oposicion', 'guardia-civil-2026');
    if (mes) await store.setSetting('fecha', finDeMes(mes));
    const now = Date.now();
    const items = await startRun(store, {
      count: TEST_QUESTIONS,
      reparto: 'equitativo',
      types: TIPOS_TEST,
      sessionSeed: `test-${now}`,
      levelFor: () => 2 as Level,
    });
    setTest({ items, exam: createExam(items.length, now, TEST_MINUTES * 60_000) });
    setStep('test');
  }

  if (step === 'bienvenida') {
    return (
      <Paso
        key={step}
        accion={<Button label="Empezar" onPress={() => setStep('oposicion')} variant="primary" />}
        pie="Aptiq es independiente de la Administración."
      >
        <View style={styles.bienvenida}>
          <Animated.View entering={entrada(0, reduce)}>
            <Logo width={tokens.size.logo * 2} />
          </Animated.View>
          <Animated.View entering={entrada(2, reduce)} style={styles.bloque}>
            <Text variant="screenTitle" accessibilityRole="header">
              Saca tu apto.
            </Text>
            <Text color="graphiteStrong">
              Simulacros con el formato oficial y la explicación de cada pregunta.
            </Text>
          </Animated.View>
        </View>
      </Paso>
    );
  }

  if (step === 'oposicion') {
    return (
      <Paso
        key={step}
        paso="Paso 1 de 3"
        titulo="¿Qué oposición preparas?"
        accion={<Button label="Continuar" onPress={() => setStep('fecha')} variant="primary" />}
      >
        <Animated.View entering={entrada(1, reduce)} style={styles.bloque}>
          <PressScale
            onPress={() => setStep('fecha')}
            accessibilityRole="radio"
            accessibilityLabel="Guardia Civil · Escala de Cabos y Guardias"
            accessibilityState={{ checked: true }}
            style={styles.opcion}
          >
            <View style={styles.burbuja}>
              <View style={styles.burbujaLlena} />
            </View>
            <View style={styles.flex}>
              <Text variant="bodyStrong">Guardia Civil</Text>
              <Text variant="caption" color="graphite">
                Escala de Cabos y Guardias
              </Text>
            </View>
          </PressScale>
          <SourceNote cita={cita()} />
        </Animated.View>
      </Paso>
    );
  }

  if (step === 'fecha' || !test) {
    return (
      <Paso
        key="fecha"
        paso="Paso 2 de 3"
        titulo="¿Cuándo es tu examen?"
        accion={<Button label="Hacer el test de nivel" onPress={empezarTest} variant="primary" />}
        pie={`${TEST_QUESTIONS} preguntas en ${TEST_MINUTES} minutos.`}
      >
        <Animated.View entering={entrada(1, reduce)} style={styles.bloque}>
          <Text color="graphite">Opcional. Basta con el mes aproximado.</Text>
          <MonthPicker value={mes} onChange={setMes} hoy={hoy} />
        </Animated.View>
      </Paso>
    );
  }

  return <TestDeNivel store={store} items={test.items} exam={test.exam} />;
}

/** Paso del onboarding: contenido arriba y la acción fija abajo (guía §7 bis). */
function Paso({
  paso,
  titulo,
  children,
  accion,
  pie,
}: {
  paso?: string;
  titulo?: string;
  children: ReactNode;
  accion: ReactNode;
  pie?: string;
}) {
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  return (
    <PaperBackground style={styles.pantalla}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.contenido}>
        {paso !== undefined && (
          <Animated.View entering={entrada(0, reduce)} style={styles.bloque}>
            <Text variant="label" color="graphite">
              {paso}
            </Text>
            <Text variant="screenTitle" accessibilityRole="header">
              {titulo}
            </Text>
          </Animated.View>
        )}
        {children}
      </ScrollView>
      <View style={[styles.barra, { paddingBottom: Math.max(insets.bottom, tokens.spacing.l) }]}>
        {accion}
        {pie !== undefined && (
          <Text variant="caption" color="graphite" style={styles.centro}>
            {pie}
          </Text>
        )}
      </View>
    </PaperBackground>
  );
}

function TestDeNivel({ store, items, exam }: { store: Store; items: Item[]; exam: ExamState }) {
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
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
      level: item.level,
      correct: finales[i] === item.answerIndex,
      blank: finales[i] === null || finales[i] === undefined,
    }));
    await store.saveSession({
      id: `test-${exam.startedAt}`,
      creada: exam.startedAt,
      questions: toSaved(items, finales),
    });
    await store.setSetting('niveles', JSON.stringify(estimateLevels(porTipo)));
    // Último paso: datos de uso (fase 9), solo si aún no ha contestado en este móvil.
    router.replace((await permisoAnalitica(store)) === null ? '/datos-de-uso' : '/inicio');
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
    <PaperBackground style={styles.pantalla}>
      <View style={styles.header}>
        <Text
          variant="label"
          color="graphite"
          style={styles.flex}
          accessibilityLabel={`Test de nivel, pregunta ${index + 1} de ${items.length}`}
        >
          Test de nivel · {index + 1} / {items.length}
        </Text>
        <Timer remainingMs={remaining} />
      </View>
      <ProgressTicks
        total={items.length}
        current={index}
        answered={items.map((_, i) => i < answers.length)}
      />
      <ScrollView style={styles.flex} contentContainerStyle={styles.contenido}>
        <Animated.View key={index} entering={entrada(0, reduce)} style={styles.bloque}>
          <Pregunta item={item} />
          <Opciones
            item={item}
            stateOf={(i) => (selected === i ? 'marked' : 'empty')}
            onPress={setSelected}
          />
          {index === 0 && (
            <Text variant="caption" color="graphite">
              Estimación orientativa: con {items.length} preguntas el nivel es aproximado.
            </Text>
          )}
        </Animated.View>
      </ScrollView>
      <View
        style={[
          styles.barra,
          styles.fila,
          { paddingBottom: Math.max(insets.bottom, tokens.spacing.l) },
        ]}
      >
        <View style={styles.flex}>
          <Button label="No lo sé" onPress={() => siguiente(null)} variant="secondary" />
        </View>
        <View style={styles.flex}>
          <Button
            label={ultima ? 'Ver mi nivel' : 'Siguiente'}
            onPress={() => siguiente(selected)}
            disabled={selected === null}
            variant="primary"
          />
        </View>
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  // Sin margen inferior propio: la barra de acciones ya suma el área segura.
  pantalla: { gap: tokens.spacing.m, paddingBottom: 0 },
  flex: { flex: 1 },
  contenido: { gap: tokens.spacing.xl, paddingBottom: tokens.spacing.xxl, flexGrow: 1 },
  bloque: { gap: tokens.spacing.m },
  bienvenida: { flex: 1, justifyContent: 'center', gap: tokens.spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.s },
  barra: { gap: tokens.spacing.s, paddingTop: tokens.spacing.s },
  fila: { flexDirection: 'row' },
  centro: { textAlign: 'center' },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.m,
    minHeight: tokens.size.optionHeight,
    padding: tokens.spacing.l,
    borderRadius: tokens.radius.option,
    borderWidth: tokens.border.selected,
    borderColor: tokens.color.ink,
    backgroundColor: tokens.color.white,
  },
  burbuja: {
    width: tokens.size.bubble,
    height: tokens.size.bubble,
    borderRadius: tokens.radius.pill,
    borderWidth: tokens.border.selected,
    borderColor: tokens.color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burbujaLlena: {
    width: tokens.size.bubble / 2,
    height: tokens.size.bubble / 2,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.color.ink,
  },
});
