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
import { APTITUDE_LABELS, LETTERS, startRun, toSaved } from '@/practice/run';
import { expoReminderApi } from '@/notifications/expo-api';
import { syncReminders } from '@/notifications/reminder';
import { AJUSTE_HOY, diaLocal, loadProgress, permiso, startToday } from '@/progress/data';
import { usePlan } from '@/purchases/provider';
import { tiposDe } from '@/purchases/muro';
import { Explicacion } from '@/screens/explicacion';
import { Loading } from '@/screens/loading';
import { Pregunta } from '@/screens/pregunta';

const SESSION_QUESTIONS = 10;

/** Práctica: una aptitud concreta, o la sesión de hoy sin aptitud (ENT-01, ENT-02, EXP-01–03). */
export function Practica() {
  const store = useStore();
  const { aptitud } = useLocalSearchParams<{ aptitud?: string }>();
  const { plan, api } = usePlan();
  const [items, setItems] = useState<Item[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    (async () => {
      // Sin aptitud: la Sesión de hoy (ENT-02). Con aptitud: práctica de esa aptitud al nivel adaptativo (ENT-03).
      const progreso = await loadProgress(store);
      // Se pregunta ahora: el plan del contexto puede no haber llegado aún al abrir la app.
      const premium = await api.plan().then((p) => p.premium, () => plan.premium);
      const a = permiso(progreso, premium);
      // Lo que no incluye el plan gratuito lleva al muro de pago (tabla «Monetización»).
      if (aptitud ? tiposDe(aptitud, a.tipos).length === 0 : !a.sesionHoy) return router.replace('/muro-pago');
      if (!aptitud) return setItems(await startToday(store, Date.now(), premium));
      const { levels } = progreso;
      setItems(
        await startRun(store, {
          count: SESSION_QUESTIONS,
          reparto: 'equitativo',
          aptitude: aptitud,
          types: a.tipos,
          sessionSeed: `p-${Date.now()}`,
          levelFor: (t) => levels[t],
        }),
      );
    })();
    // El plan se lee al empezar: comprar a mitad de sesión no la reinicia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const ahora = Date.now();
    await store.saveSession({
      id: `p-${ahora}`,
      creada: ahora,
      questions: toSaved(items!, nuevas),
    });
    if (!aptitud) {
      await store.setSetting(AJUSTE_HOY, diaLocal(ahora));
      syncReminders(store, expoReminderApi).catch(() => {});
    }
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
      <Pregunta texto={item.stem.text} />
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
      {revealed && <Explicacion item={item} answer={selected} anunciar />}
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
