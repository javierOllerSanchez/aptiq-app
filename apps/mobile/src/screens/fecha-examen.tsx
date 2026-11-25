import { tokens } from '@aptiq/tokens';
import { Button, ListRow, MESES_CORTOS, MonthPicker, Sheet } from '@aptiq/ui';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import { diaLocal } from '@/progress/data';
import { finDeMes } from '@/screens/onboarding';

/** «2027-03-31» → «mar 2027»; sin fecha válida, null. */
export function mesCorto(fecha: string | null): string | null {
  if (!fecha || !/^\d{4}-\d{2}/.test(fecha)) return null;
  return `${MESES_CORTOS[Number(fecha.slice(5, 7)) - 1]} ${fecha.slice(0, 4)}`;
}

/**
 * «Fecha del examen» en Preferencias de Cuenta (aprobado el 2026-11-25): se cambia después del
 * onboarding con el mismo selector de mes y año. Se guarda el último día del mes; «Aún no lo sé»
 * la quita.
 */
export function FechaExamen() {
  const store = useStore();
  const [fecha, setFecha] = useState<string | null>(null);
  const [abierta, setAbierta] = useState(false);
  const [mes, setMes] = useState<string | null>(null);
  const [hoy] = useState(() => diaLocal(Date.now()).slice(0, 7));

  useFocusEffect(
    useCallback(() => {
      store.getSetting('fecha').then((f) => setFecha(f || null));
    }, [store]),
  );

  const abrir = () => {
    setMes(fecha ? fecha.slice(0, 7) : null);
    setAbierta(true);
  };
  const guardar = async () => {
    // Sin fecha se guarda vacío: Inicio deja de mostrar el mes del examen.
    const nueva = mes ? finDeMes(mes) : '';
    await store.setSetting('fecha', nueva);
    setFecha(nueva || null);
    setAbierta(false);
  };

  return (
    <>
      <ListRow
        icon="calendar"
        label="Fecha del examen"
        detail="Para la cuenta atrás de Inicio"
        value={mesCorto(fecha) ?? 'Sin fecha'}
        onPress={abrir}
      />
      <Sheet visible={abierta} onClose={() => setAbierta(false)} title="Fecha del examen">
        <View style={styles.cuerpo}>
          <MonthPicker value={mes} onChange={setMes} hoy={hoy} />
          <Button label="Guardar" onPress={guardar} variant="primary" />
        </View>
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  cuerpo: { gap: tokens.spacing.l },
});
