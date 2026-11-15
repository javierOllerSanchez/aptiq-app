import { tokens } from '@aptiq/tokens';
import { GlassCard, ListRow, PaperBackground, Text } from '@aptiq/ui';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import { fechaCorta, type HistoryRow, historyRows } from '@/history/rows';
import { APTITUDE_LABELS } from '@/practice/run';
import { aptitudFloja, loadProgress, type Progress } from '@/progress/data';
import { LevelChart, nivelTexto } from '@/screens/level-chart';
import { Loading } from '@/screens/loading';
import { TabSpacer } from '@/screens/tab-spacer';

/**
 * Historial: «Tu nivel» con su evolución (PRO-01) y simulacros y prácticas (PRO-02).
 * Prototipos: docs/prototipos/historial-nivel.html e historial.html.
 */
export function Historial() {
  const store = useStore();
  const [rows, setRows] = useState<ReturnType<typeof historyRows> | null>(null);
  const [progreso, setProgreso] = useState<Progress | null>(null);

  // Se relee al volver: puede haber llegado algo de otro dispositivo o un simulacro nuevo.
  useFocusEffect(
    useCallback(() => {
      Promise.all([store.sessions(), store.attempts()]).then(([s, a]) => setRows(historyRows(s, a)));
      loadProgress(store).then(setProgreso);
    }, [store]),
  );

  if (!rows || !progreso) return <Loading />;
  const vacio = rows.simulacros.length === 0 && rows.practica.length === 0;

  return (
    <PaperBackground scroll style={styles.content}>
      <Text variant="screenTitle" accessibilityRole="header">
        Historial
      </Text>
      <Text color="graphite">
        {vacio
          ? 'Aquí aparecerán tus simulacros y sesiones de práctica cuando termines el primero.'
          : 'Tu nivel por aptitud y todo lo que has practicado. Toca un simulacro o una sesión para repasar tus fallos.'}
      </Text>
      <TuNivel progreso={progreso} />
      {rows.simulacros.length > 0 && (
        <Seccion titulo="Simulacros" columna="Nota">
          {rows.simulacros.map((r) => (
            <Fila
              key={r.id}
              row={r}
              onPress={() => router.push({ pathname: '/resultado', params: { id: r.id } })}
            />
          ))}
        </Seccion>
      )}
      {rows.practica.length > 0 && (
        <Seccion titulo="Práctica" columna="Aciertos">
          {rows.practica.map((r) => (
            <Fila
              key={r.id}
              row={r}
              onPress={() => router.push({ pathname: '/repasar', params: { sesion: r.id } })}
            />
          ))}
        </Seccion>
      )}
      <TabSpacer />
    </PaperBackground>
  );
}

function TuNivel({ progreso }: { progreso: Progress }) {
  const { semanas } = progreso;
  const actual = semanas[semanas.length - 1];
  const primera = semanas[0];
  if (!actual || !primera) return null;
  const delta = actual.global - primera.global;
  const aptitudes = Object.entries(APTITUDE_LABELS).filter(([id]) => actual.porAptitud[id] !== undefined);
  const flojo = aptitudFloja(actual.porAptitud);
  return (
    <Seccion titulo="Tu nivel" columna="De 5">
      <GlassCard accessible={false}>
        <View style={styles.cabecera}>
          <View
            accessible
            accessibilityLabel={`Nivel global ${nivelTexto(actual.global)} de 5`}
            style={styles.global}
          >
            <Text variant="label" color="graphiteStrong">
              Global · últimas {semanas.length} semanas
            </Text>
            <Text variant="bigNumber">{nivelTexto(actual.global)}</Text>
          </View>
          {delta !== 0 && (
            <Text variant="formula" color="graphiteStrong">
              {delta > 0 ? '+' : '−'}
              {nivelTexto(Math.abs(delta))} desde el {fechaCorta(new Date(`${primera.semana}T12:00:00`).getTime())}
            </Text>
          )}
        </View>
        <LevelChart semanas={semanas} />
      </GlassCard>
      <View>
        {aptitudes.map(([id, label]) => (
          <ListRow
            key={id}
            label={label}
            value={nivelTexto(actual.porAptitud[id]!)}
            valueLabel={`nivel ${nivelTexto(actual.porAptitud[id]!)} de 5`}
            weak={id === flojo}
            onPress={() => router.push({ pathname: '/practica', params: { aptitud: id } })}
          />
        ))}
      </View>
    </Seccion>
  );
}

function Seccion({ titulo, columna, children }: { titulo: string; columna: string; children: React.ReactNode }) {
  return (
    <View style={styles.seccion}>
      <View style={styles.cabecera}>
        <Text variant="label" color="graphite" accessibilityRole="header">
          {titulo}
        </Text>
        <Text variant="label" color="graphite">
          {columna}
        </Text>
      </View>
      <View>{children}</View>
    </View>
  );
}

function Fila({ row, onPress }: { row: HistoryRow; onPress: () => void }) {
  return (
    <ListRow
      label={row.label}
      detail={row.detail}
      value={row.value}
      valueLabel={row.valueLabel}
      weak={row.weak}
      weakLabel="no llega al mínimo"
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  global: { gap: tokens.spacing.xs },
  content: { gap: tokens.spacing.m },
  seccion: { marginTop: tokens.spacing.m, gap: tokens.spacing.xs },
  cabecera: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    columnGap: tokens.spacing.m,
  },
});
