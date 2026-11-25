import { tokens } from '@aptiq/tokens';
import { ListRow, Text, withAlpha } from '@aptiq/ui';
import { router } from 'expo-router';
import { useState } from 'react';
import { AccessibilityInfo, Linking, Platform, StyleSheet, View } from 'react-native';

import { fechaCorta } from '@/history/rows';
import type { Plan } from '@/purchases/api';
import { usePlan } from '@/purchases/provider';

/** Páginas de suscripciones de cada tienda, por si RevenueCat no da la del usuario. */
const GESTION = Platform.select({
  ios: 'https://apps.apple.com/account/subscriptions',
  default: 'https://play.google.com/store/account/subscriptions',
});

const fecha = (ms: number) => `${fechaCorta(ms)} ${new Date(ms).getFullYear()}`;

export function detallePlan(plan: Plan): string {
  if (!plan.premium) return '1 Sesión de hoy al día y 1 simulacro a la semana';
  if (plan.hasta === null) return 'Activo';
  return plan.renueva
    ? `Se renueva el ${fecha(plan.hasta)}`
    : `Activo hasta el ${fecha(plan.hasta)}, no se renueva`;
}

/** «Tu plan» en Cuenta (PAY-03): estado, gestionar la suscripción en la tienda y restaurar compras. */
export function TuPlan() {
  const { plan, api } = usePlan();
  const [aviso, setAvisoState] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const setAviso = (texto: string | null) => {
    setAvisoState(texto);
    if (texto && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(texto);
  };

  const restaurar = async () => {
    if (ocupado) return;
    setOcupado(true);
    setAviso(null);
    try {
      const p = await api.restaurar();
      setAviso(
        p.premium
          ? 'Compras restauradas: ya tienes Premium.'
          : 'No hay compras que restaurar con esta cuenta de la tienda.',
      );
    } catch {
      setAviso('No hay conexión. Comprueba tu red y vuelve a intentarlo.');
    } finally {
      setOcupado(false);
    }
  };

  return (
    <View>
      <Text variant="label" color="graphite" accessibilityRole="header" style={styles.titulo}>
        Tu plan
      </Text>
      {plan.premium ? (
        <>
          <View style={styles.estado} accessible>
            <Text variant="bodyStrong">Premium</Text>
            <Text variant="caption" color="graphite">
              {detallePlan(plan)}
            </Text>
          </View>
          {plan.renueva && (
            <ListRow
              label="Gestionar suscripción"
              detail="Cambiar o cancelar en la tienda"
              onPress={() =>
                Linking.openURL(plan.gestionUrl ?? GESTION).catch(() =>
                  setAviso(
                    'No se ha podido abrir la tienda. Inténtalo desde los ajustes de tu cuenta de la tienda.',
                  ),
                )
              }
            />
          )}
        </>
      ) : (
        <ListRow
          label="Plan gratuito"
          detail={detallePlan(plan)}
          value="Ver Premium"
          onPress={() => router.push('/muro-pago')}
        />
      )}
      <ListRow label="Restaurar compras" onPress={restaurar} />
      {aviso && (
        <Text
          color="graphiteStrong"
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          style={styles.aviso}
        >
          {aviso}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: { marginTop: tokens.spacing.xxl, marginBottom: tokens.spacing.xs },
  estado: {
    minHeight: tokens.size.listRow,
    justifyContent: 'center',
    paddingVertical: tokens.spacing.s,
    borderBottomWidth: tokens.border.hairline,
    borderBottomColor: withAlpha(tokens.color.ink, tokens.opacity.divider),
  },
  aviso: { marginTop: tokens.spacing.s },
});
