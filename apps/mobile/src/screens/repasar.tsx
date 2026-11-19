import { type Item, registry, reviewOf } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Button, PaperBackground, Text } from '@aptiq/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import { OPTION_COUNT } from '@/practice/run';
import { Explicacion } from '@/screens/explicacion';
import { Loading } from '@/screens/loading';
import { Opciones } from '@/screens/opciones';
import { Pregunta } from '@/screens/pregunta';

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

  useEffect(() => {
    const cargar = sesion
      ? store.sessions().then((list) => list.find((s) => s.id === sesion)?.questions)
      : store.attempts().then((list) => list.find((a) => a.id === id)?.questions);
    cargar.then((questions) => {
      const out: Fallo[] = [];
      questions?.forEach((q, i) => {
        const item = registry[q.type].generator.generate(q.seed, q.level, OPTION_COUNT);
        if (!reviewOf(item, q.answer).correct) out.push({ n: i + 1, item, answer: q.answer });
      });
      setFallos(out);
    });
  }, [store, id, sesion]);

  if (!fallos) return <Loading />;
  return (
    <PaperBackground scroll style={styles.content}>
      <Text variant="screenTitle" accessibilityRole="header">
        Fallos y en blanco ({fallos.length})
      </Text>
      {fallos.length === 0 && <Text color="graphite">No hay fallos ni preguntas en blanco.</Text>}
      {fallos.map(({ n, item, answer }) => (
        <View key={n} style={styles.card}>
          <Text variant="label" color="graphite">
            Pregunta {n} · {answer === null ? 'en blanco' : 'fallo'}
          </Text>
          <Pregunta item={item} />
          <Opciones item={item} stateOf={(i) => (i === item.answerIndex ? 'correct' : i === answer ? 'wrong' : 'empty')} />
          <Explicacion item={item} answer={answer} />
        </View>
      ))}
      <Button label={sesion ? 'Volver al historial' : 'Volver al resultado'} onPress={() => router.back()} variant="secondary" />
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.m },
  // La pregunta ya trae su tarjeta: sin otra alrededor (las figuras no caben en dos).
  card: { gap: tokens.spacing.s },
});
