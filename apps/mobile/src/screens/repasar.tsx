import type { Item } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Button, IconButton, PaperBackground, Text } from '@aptiq/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { type ComponentRef, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStore } from '@/data/provider';
import { isCorrect, regenerar } from '@/practice/run';
import { Explicacion } from '@/screens/explicacion';
import { Loading } from '@/screens/loading';
import { Opciones } from '@/screens/opciones';
import { Pregunta } from '@/screens/pregunta';

/** Desplazamiento lateral que cambia de pregunta (px). */
const DESLIZA = tokens.size.touchMin + tokens.spacing.l;

interface Fallo {
  n: number;
  item: Item;
  answer: number | null;
}

/** Repasar fallos y preguntas en blanco con su explicación (RES-03, EXP-01–03). De un simulacro (`id`) o de una sesión de práctica del Historial (`sesion`, PRO-02). */
export function Repasar() {
  const store = useStore();
  const { id, sesion } = useLocalSearchParams<{ id?: string; sesion?: string }>();
  const [fallos, setFallos] = useState<Fallo[] | null>(null);
  const [retiradas, setRetiradas] = useState(0);
  const [i, setI] = useState(0);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const insets = useSafeAreaInsets();
  // Cada pregunta nueva empieza arriba.
  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [i]);

  useEffect(() => {
    const cargar = sesion
      ? store.sessions().then((list) => list.find((s) => s.id === sesion)?.questions)
      : store.attempts().then((list) => list.find((a) => a.id === id)?.questions);
    cargar.then((questions) => {
      const out: Fallo[] = [];
      let fuera = 0;
      questions?.forEach((q, i) => {
        if (isCorrect(q)) return;
        const item = regenerar(q);
        if (item) out.push({ n: i + 1, item, answer: q.answer });
        else fuera++;
      });
      setFallos(out);
      setRetiradas(fuera);
    });
  }, [store, id, sesion]);

  if (!fallos) return <Loading />;
  const f = fallos[i];
  const volver = sesion ? 'Volver al historial' : 'Volver al resultado';
  const ir = (n: number) => {
    if (n < 0 || n >= fallos.length) return;
    setI(n);
  };
  // Deslizar a izquierda o derecha cambia de pregunta, como en el simulacro.
  const deslizar = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-tokens.spacing.xl, tokens.spacing.xl])
    .failOffsetY([-tokens.spacing.l, tokens.spacing.l])
    .onEnd((e) => {
      if (e.translationX < -DESLIZA) ir(i + 1);
      else if (e.translationX > DESLIZA) ir(i - 1);
    });

  return (
    <PaperBackground style={styles.pantalla}>
      <View style={styles.cabecera}>
        <IconButton icon="cross" label={volver} onPress={() => router.back()} />
        <Text
          variant="label"
          color="graphite"
          style={styles.titulo}
          accessibilityRole="header"
          accessibilityLabel={
            fallos.length
              ? `Fallos y en blanco, ${i + 1} de ${fallos.length}`
              : 'Fallos y en blanco: ninguno'
          }
        >
          Fallos y en blanco{fallos.length ? ` · ${i + 1} / ${fallos.length}` : ''}
        </Text>
      </View>
      <ScrollView
        ref={scroll}
        style={styles.scroll}
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        {fallos.length === 0 && retiradas === 0 && (
          <Text color="graphite">No hay fallos ni preguntas en blanco.</Text>
        )}
        {retiradas > 0 && i === 0 && (
          <Text variant="caption" color="graphite">
            {retiradas === 1
              ? 'Una pregunta ya no está disponible: se retiró del banco tras revisarla.'
              : `${retiradas} preguntas ya no están disponibles: se retiraron del banco tras revisarlas.`}
          </Text>
        )}
        {f && (
          <GestureDetector gesture={deslizar}>
            <Animated.View
              key={f.n}
              entering={FadeIn.duration(tokens.motion.durationBase)}
              style={styles.card}
            >
              <Text variant="label" color="graphite">
                Pregunta {f.n} · {f.answer === null ? 'en blanco' : 'fallo'}
              </Text>
              <Pregunta item={f.item} />
              <Opciones
                item={f.item}
                stateOf={(o) =>
                  o === f.item.answerIndex ? 'correct' : o === f.answer ? 'wrong' : 'empty'
                }
              />
              <Explicacion item={f.item} answer={f.answer} abierta />
            </Animated.View>
          </GestureDetector>
        )}
      </ScrollView>
      <View style={[styles.barra, { paddingBottom: Math.max(insets.bottom, tokens.spacing.l) }]}>
        {fallos.length > 1 && (
          <IconButton icon="back" label="Anterior" onPress={() => ir(i - 1)} disabled={i === 0} />
        )}
        <View style={styles.celda}>
          {i + 1 < fallos.length ? (
            <Button label="Siguiente" onPress={() => ir(i + 1)} variant="secondary" />
          ) : (
            <Button label={volver} onPress={() => router.back()} variant="secondary" />
          )}
        </View>
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  // Sin margen inferior propio: la barra de acciones ya suma el área segura.
  pantalla: { gap: tokens.spacing.m, paddingBottom: 0 },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.s },
  titulo: { flex: 1 },
  scroll: { flex: 1, marginHorizontal: -tokens.spacing.screenX },
  contenido: {
    paddingHorizontal: tokens.spacing.screenX,
    paddingBottom: tokens.spacing.xxl,
    gap: tokens.spacing.m,
  },
  // La pregunta ya trae su tarjeta: sin otra alrededor (las figuras no caben en dos).
  card: { gap: tokens.spacing.m },
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.s,
    paddingTop: tokens.spacing.s,
  },
  celda: { flex: 1 },
});
