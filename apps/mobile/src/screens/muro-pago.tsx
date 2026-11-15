import { tokens } from '@aptiq/tokens';
import { Button, Icon, PaperBackground, Text, withAlpha } from '@aptiq/ui';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Oferta, Periodo, Resultado } from '@/purchases/api';
import { usePlan } from '@/purchases/provider';
import { Loading } from '@/screens/loading';

const NOMBRES: Record<Periodo, string> = {
  anual: 'Anual',
  mensual: 'Mensual',
  'tres-meses': 'Pase 3 meses',
  'seis-meses': 'Pase 6 meses',
};
const ORDEN: Periodo[] = ['anual', 'mensual', 'tres-meses', 'seis-meses'];
const esPase = (o: Oferta) => o.periodo === 'tres-meses' || o.periodo === 'seis-meses';

const MENSAJES: Record<Exclude<Resultado, 'ok'>, string | null> = {
  cancelada: null, // La persona lo ha decidido: no hay nada que explicar.
  pendiente: 'El pago está pendiente de confirmar en la tienda. Premium se activará cuando se apruebe.',
  'sin-red': 'No hay conexión. Comprueba tu red y vuelve a intentarlo.',
  error: 'No se ha podido completar la compra. No se te ha cobrado nada; vuelve a intentarlo.',
};

const VENTAJAS = [
  'Sesión de hoy y simulacros oficiales ilimitados',
  'Los 6 tipos de pregunta y todos los niveles',
  'Nivel por aptitud, historial completo y repaso espaciado',
];

/** Muro de pago (PAY-01, PAY-02, PAY-03): se cierra siempre y no bloquea nada de lo ya hecho. */
export function MuroPago() {
  const { api } = usePlan();
  const [ofertas, setOfertas] = useState<Oferta[] | null | 'error'>(null);
  const [elegida, setElegida] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    api
      .ofertas()
      .then((os) => {
        const ordenadas = [...os].sort((a, b) => ORDEN.indexOf(a.periodo) - ORDEN.indexOf(b.periodo));
        setOfertas(ordenadas);
        setElegida(ordenadas[0]?.id ?? null);
      })
      .catch(() => setOfertas('error'));
  }, [api]);

  const cerrar = () => (router.canGoBack() ? router.back() : router.replace('/inicio'));

  const comprar = async () => {
    if (!elegida) return;
    setOcupado(true);
    setAviso(null);
    const { resultado, plan } = await api.comprar(elegida);
    setOcupado(false);
    if (resultado === 'ok' && plan.premium) return cerrar();
    setAviso(resultado === 'ok' ? MENSAJES.error : MENSAJES[resultado]);
  };

  const restaurar = async () => {
    setOcupado(true);
    setAviso(null);
    try {
      const plan = await api.restaurar();
      if (plan.premium) return cerrar();
      setAviso('No hay compras que restaurar con esta cuenta de la tienda.');
    } catch {
      setAviso(MENSAJES['sin-red']);
    } finally {
      setOcupado(false);
    }
  };

  if (ofertas === null) return <Loading />;
  const actual = ofertas === 'error' ? undefined : ofertas.find((o) => o.id === elegida);

  return (
    <PaperBackground scroll style={styles.content}>
      <View style={styles.cabecera}>
        <Text variant="label" color="graphite">
          Aptiq Premium
        </Text>
        <Pressable
          onPress={cerrar}
          accessibilityRole="button"
          accessibilityLabel="Cerrar, seguir con el plan gratuito"
          hitSlop={tokens.spacing.s}
          style={styles.cerrar}
        >
          <Icon name="cross" />
        </Pressable>
      </View>
      <Text variant="screenTitle" accessibilityRole="header">
        Entrena sin límites hasta el examen
      </Text>
      <View style={styles.ventajas}>
        {VENTAJAS.map((v) => (
          <View key={v} style={styles.ventaja}>
            <Icon name="check" size={tokens.size.chevron} />
            <Text style={styles.flex}>{v}</Text>
          </View>
        ))}
      </View>

      {ofertas === 'error' || ofertas.length === 0 ? (
        <Text color="graphiteStrong">
          No se pueden cargar los planes ahora mismo. Comprueba tu conexión y vuelve a abrir esta pantalla.
        </Text>
      ) : (
        <View accessibilityRole="radiogroup" accessibilityLabel="Plan" style={styles.opciones}>
          {ofertas.map((o) => {
            const on = o.id === elegida;
            const detalle = esPase(o) ? 'Pago único, no se renueva' : o.periodo === 'anual' ? o.porMes && `${o.porMes} al mes` : null;
            return (
              <Pressable
                key={o.id}
                onPress={() => setElegida(o.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                accessibilityLabel={[NOMBRES[o.periodo], o.prueba && '7 días gratis', detalle, o.precio].filter(Boolean).join(', ')}
                style={[styles.opcion, on && styles.opcionOn]}
              >
                <View style={[styles.radio, on && styles.radioOn]} />
                <View style={styles.flex}>
                  <View style={styles.fila}>
                    <Text variant="bodyStrong">{NOMBRES[o.periodo]}</Text>
                    {o.prueba && (
                      <View style={styles.etiqueta}>
                        <Text variant="label" color="paperCard">
                          7 días gratis
                        </Text>
                      </View>
                    )}
                  </View>
                  {detalle ? (
                    <Text variant="caption" color="graphiteStrong">
                      {detalle}
                    </Text>
                  ) : null}
                </View>
                <Text variant="timer">{o.precio}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {aviso && (
        <Text color="sealText" accessibilityLiveRegion="polite" accessibilityRole="alert">
          {aviso}
        </Text>
      )}
      <Button
        label={actual?.prueba ? 'Probar 7 días gratis' : 'Continuar'}
        onPress={comprar}
        disabled={!actual || ocupado}
      />
      {actual && (
        <Text variant="caption" color="graphite">
          {esPase(actual)
            ? `Pago único de ${actual.precio}. No se renueva: al acabar vuelves al plan gratuito sin perder nada.`
            : `${actual.prueba ? 'Después, ' : ''}${actual.precio} ${actual.periodo === 'anual' ? 'al año' : 'al mes'}. Se renueva solo hasta que lo canceles en la tienda, como mínimo 24 horas antes de la renovación. Lo que ya has hecho sigue siendo tuyo.`}
        </Text>
      )}
      <Button label="Restaurar compras" variant="text" onPress={restaurar} disabled={ocupado} />
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.l, paddingBottom: tokens.spacing.xxl },
  cabecera: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: tokens.size.touchMin },
  cerrar: {
    width: tokens.size.touchMin,
    height: tokens.size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -tokens.spacing.m,
  },
  ventajas: { gap: tokens.spacing.m },
  ventaja: { flexDirection: 'row', gap: tokens.spacing.m, alignItems: 'flex-start' },
  flex: { flex: 1 },
  opciones: { gap: tokens.spacing.s },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.m,
    minHeight: tokens.size.optionHeight,
    paddingHorizontal: tokens.spacing.l,
    paddingVertical: tokens.spacing.m,
    borderRadius: tokens.radius.option,
    borderWidth: tokens.border.default,
    borderColor: withAlpha(tokens.color.ink, tokens.opacity.emptyBubbleBorder),
  },
  opcionOn: { borderWidth: tokens.border.selected, borderColor: tokens.color.ink, backgroundColor: tokens.color.white },
  radio: {
    width: tokens.size.levelBubble,
    height: tokens.size.levelBubble,
    borderRadius: tokens.radius.pill,
    borderWidth: tokens.border.selected,
    borderColor: tokens.color.ink,
  },
  radioOn: { borderWidth: tokens.size.levelBubble / 3 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.s, flexWrap: 'wrap' },
  etiqueta: {
    backgroundColor: tokens.color.ink,
    borderRadius: tokens.radius.pill,
    paddingHorizontal: tokens.spacing.s,
    paddingVertical: tokens.spacing.xs / 2,
  },
});
