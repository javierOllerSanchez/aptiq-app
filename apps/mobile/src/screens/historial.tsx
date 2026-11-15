import { tokens } from '@aptiq/tokens';
import { ListRow, PaperBackground, Text } from '@aptiq/ui';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import { type HistoryRow, historyRows } from '@/history/rows';
import { Loading } from '@/screens/loading';
import { TabSpacer } from '@/screens/tab-spacer';

/** Historial de simulacros y prácticas (PRO-02). Prototipo: docs/prototipos/historial.html. */
export function Historial() {
  const store = useStore();
  const [rows, setRows] = useState<ReturnType<typeof historyRows> | null>(null);

  // Se relee al volver: puede haber llegado algo de otro dispositivo o un simulacro nuevo.
  useFocusEffect(
    useCallback(() => {
      Promise.all([store.sessions(), store.attempts()]).then(([s, a]) => setRows(historyRows(s, a)));
    }, [store]),
  );

  if (!rows) return <Loading />;
  const vacio = rows.simulacros.length === 0 && rows.practica.length === 0;

  return (
    <PaperBackground scroll style={styles.content}>
      <Text variant="screenTitle" accessibilityRole="header">
        Historial
      </Text>
      <Text color="graphite">
        {vacio
          ? 'Aquí aparecerán tus simulacros y sesiones de práctica cuando termines el primero.'
          : 'Toca un simulacro o una sesión para revisar cada pregunta con su explicación.'}
      </Text>
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
