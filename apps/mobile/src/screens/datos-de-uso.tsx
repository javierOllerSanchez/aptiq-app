import { tokens } from '@aptiq/tokens';
import { Button, GlassCard, Icon, PaperBackground, Text } from '@aptiq/ui';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { setPermisoAnalitica, track } from '@/analytics/analytics';
import { useStore } from '@/data/provider';
import { abrir, urlDe } from '@/legal';

/**
 * Último paso del Onboarding, tras el test de nivel (NFR-05). Prototipo aprobado: docs/prototipos/consentimiento.html.
 * «Aceptar» y «No, gracias» al mismo nivel; si cierra la app sin contestar, cuenta como «no».
 */
export function DatosDeUso() {
  const store = useStore();
  const [ocupado, setOcupado] = useState(false);
  const privacidad = urlDe('privacidad');

  const contestar = async (si: boolean) => {
    if (ocupado) return;
    setOcupado(true);
    await setPermisoAnalitica(store, si);
    if (si) await track(store, 'onboarding_terminado');
    router.replace('/inicio');
  };

  return (
    <PaperBackground scroll style={styles.content}>
      <Text variant="label" color="graphite">
        Último paso
      </Text>
      <Text variant="screenTitle" accessibilityRole="header">
        ¿Compartes datos de uso?
      </Text>
      <Text color="graphiteStrong">
        Nos dicen qué partes de Aptiq usas y dónde se atasca la app, para mejorarla durante la preparación.
      </Text>
      <GlassCard>
        <Text variant="label" color="graphiteStrong">
          Qué se envía
        </Text>
        <Text>Pasos como «simulacro entregado» o «test de nivel terminado», con la versión de la app.</Text>
        <Text variant="label" color="graphiteStrong">
          Qué no
        </Text>
        <Text>Tu correo, tu nombre ni tus respuestas una a una.</Text>
        <View style={styles.nota}>
          <Icon name="document" color="graphite" size={tokens.size.chevron} />
          <Text variant="caption" color="graphiteStrong" style={styles.flex}>
            Servidores en la Unión Europea. Puedes cambiarlo cuando quieras en Cuenta.
          </Text>
        </View>
        {privacidad && (
          <Button label="Política de privacidad" variant="text" onPress={() => abrir(privacidad)} />
        )}
      </GlassCard>
      <View style={styles.botones}>
        <Button label="Aceptar" variant="secondary" onPress={() => contestar(true)} disabled={ocupado} />
        <Button label="No, gracias" variant="secondary" onPress={() => contestar(false)} disabled={ocupado} />
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.m },
  nota: { flexDirection: 'row', gap: tokens.spacing.s, alignItems: 'flex-start' },
  flex: { flex: 1 },
  botones: { gap: tokens.spacing.s, marginTop: tokens.spacing.l },
});
