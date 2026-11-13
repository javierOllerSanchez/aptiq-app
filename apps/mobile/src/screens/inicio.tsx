import {
  type Breakdown,
  guardiaCivil2026,
  type Level,
  type Tally,
  taxonomy,
  type TypeCode,
} from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import {
  Button,
  GlassCard,
  LevelBubbles,
  ListRow,
  PaperBackground,
  SourceNote,
  Text,
} from '@aptiq/ui';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import { APTITUDE_LABELS, AVISO_MEZCLA, CITA, historyBreakdown } from '@/practice/run';

const { preguntas, minutos, opciones } = guardiaCivil2026.format;
const dato = (n: number | null, texto: string) =>
  n === null ? `${texto} pendiente de confirmar` : `${n} ${texto}`;
/** «81 %», o «—» si aún no hay respuestas de esa aptitud (no se inventa un dato). */
const acierto = (t?: Tally) =>
  t && t.total ? `${Math.round((t.correct / t.total) * 100)} %` : '—';
const media = (xs: number[]) => Math.round(xs.reduce((a, b) => a + b, 0) / xs.length);

interface Niveles {
  global: number | null;
  porAptitud: [string, number][];
}

/** Inicio: nivel estimado, simulacro, sesión de hoy y práctica por aptitud (ENT-01, ENT-02, SIM-01, ONB-02). */
export function Inicio() {
  const store = useStore();
  const [niveles, setNiveles] = useState<Niveles | 'sin-test'>('sin-test');
  const [abierto, setAbierto] = useState(false);
  const [historial, setHistorial] = useState<Breakdown | null>(null);

  // Al volver a Inicio se relee: el test o un simulacro pueden haber cambiado los datos.
  useFocusEffect(
    useCallback(() => {
      store.getSetting('niveles').then((raw) => {
        if (!raw) return setNiveles('sin-test');
        const porTipo = JSON.parse(raw) as Record<TypeCode, Level | null>;
        const grupos: Record<string, number[]> = {};
        for (const [code, nivel] of Object.entries(porTipo) as [TypeCode, Level | null][]) {
          if (nivel !== null) (grupos[taxonomy[code].aptitud] ??= []).push(nivel);
        }
        const todos = Object.values(grupos).flat();
        setNiveles({
          global: todos.length ? media(todos) : null,
          porAptitud: Object.entries(grupos).map(([apt, xs]) => [apt, media(xs)]),
        });
      });
      store.attempts().then((list) => setAbierto(list.some((a) => a.finishedAt === null)));
      historyBreakdown(store).then(setHistorial);
    }, [store]),
  );

  return (
    <PaperBackground scroll style={styles.content}>
      <Text variant="label" color="graphite">
        Guardia Civil
      </Text>
      <Text variant="screenTitle" accessibilityRole="header">
        Sesión de hoy
      </Text>
      <Text color="graphite">
        Simulacro con formato oficial: {dato(preguntas, 'preguntas')} en {dato(minutos, 'minutos')},{' '}
        {dato(opciones, 'opciones')}
        {opciones !== null ? `; ${opciones - 1} fallos restan 1 acierto.` : '.'}
      </Text>
      {niveles !== 'sin-test' && (
        <GlassCard>
          <Text variant="label" color="graphite">
            Nivel estimado · orientativo
          </Text>
          {niveles.global === null ? (
            <>
              <Text>Sin datos suficientes para estimar tu nivel.</Text>
              <Button
                label="Repetir el test de nivel"
                onPress={() => router.push('/onboarding')}
                variant="secondary"
              />
            </>
          ) : (
            <>
              <View
                style={styles.nivel}
                accessible
                accessibilityLabel={`Nivel ${niveles.global} de 5`}
              >
                <Text variant="bigNumber">{niveles.global}</Text>
                <Text variant="label" color="graphite">
                  de 5
                </Text>
              </View>
              <LevelBubbles level={niveles.global} max={5} />
              {niveles.porAptitud.map(([apt, n]) => (
                <Text key={apt} color="graphite">
                  {APTITUDE_LABELS[apt] ?? apt}: nivel {n}
                </Text>
              ))}
            </>
          )}
        </GlassCard>
      )}
      <Button
        label={abierto ? 'Continuar simulacro' : 'Empezar simulacro'}
        onPress={() => router.push('/simulacro')}
        variant="primary"
      />
      {AVISO_MEZCLA && (
        <Text variant="caption" color="graphite">
          {AVISO_MEZCLA}
        </Text>
      )}
      <SourceNote cita={CITA} />
      <View style={styles.cabeceraLista}>
        <Text variant="label" color="graphite" accessibilityRole="header">
          Práctica por aptitud
        </Text>
        <Text variant="label" color="graphite">
          Acierto
        </Text>
      </View>
      <View>
        <ListRow
          label="Todas las aptitudes"
          value={historial ? acierto(sumar(historial)) : undefined}
          valueLabel={historial ? `${acierto(sumar(historial))} de acierto` : undefined}
          onPress={() => router.push('/practica')}
        />
        {Object.entries(APTITUDE_LABELS).map(([id, label]) => {
          const t = historial?.byAptitude[id];
          return (
            <ListRow
              key={id}
              label={label}
              value={historial ? acierto(t) : undefined}
              valueLabel={historial ? `${acierto(t)} de acierto` : undefined}
              weak={historial?.weakest === id}
              onPress={() => router.push({ pathname: '/practica', params: { aptitud: id } })}
            />
          );
        })}
      </View>
      <View style={styles.aviso}>
        <Text variant="caption" color="graphite">
          Las preguntas están en revisión: la dificultad y las explicaciones se validan con
          opositores en la beta. Aptiq es independiente de la Administración.
        </Text>
      </View>
    </PaperBackground>
  );
}

/** Acierto global del historial, para la fila de práctica mixta. */
const sumar = (h: Breakdown): Tally => {
  const { aciertos, fallos, enBlanco } = h.total;
  return { correct: aciertos, wrong: fallos, blank: enBlanco, total: aciertos + fallos + enBlanco };
};

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.m },
  nivel: { flexDirection: 'row', alignItems: 'baseline', gap: tokens.spacing.s },
  aviso: { paddingTop: tokens.spacing.s },
  cabeceraLista: { flexDirection: 'row', justifyContent: 'space-between' },
});
