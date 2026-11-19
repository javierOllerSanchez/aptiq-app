import { methods, taxonomy, type TypeCode } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Button, Icon, PaperBackground, Text } from '@aptiq/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { APTITUDE_LABELS } from '@/practice/run';
import { cardStyle } from '@/screens/pregunta';

/** Ficha de método de un tipo (EXP-04, prototipo ficha-metodo aprobado). Abierta en el plan gratuito. */
export function Metodo() {
  const { tipo } = useLocalSearchParams<{ tipo: string }>();
  if (!tipo || !(tipo in methods))
    return (
      <PaperBackground style={styles.content}>
        <Text>No hay ficha para este tipo de ejercicio.</Text>
        <Button label="Volver" variant="secondary" onPress={() => router.back()} />
      </PaperBackground>
    );
  const code = tipo as TypeCode;
  const m = methods[code];
  const t = taxonomy[code];
  // «Juntar dos caras opuestas · confundir…»: sin punto final y en minúscula tras el primero.
  const errores = m.errores
    .map((e) => e.replace(/\.$/, ''))
    .map((e, i) => (i === 0 ? e : e[0]!.toLowerCase() + e.slice(1)))
    .join(' · ');
  return (
    <PaperBackground scroll style={styles.content}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        style={styles.volver}
      >
        <Icon name="back" />
      </Pressable>
      <View>
        <Text variant="label" color="graphite">
          Cómo se resuelve · {APTITUDE_LABELS[t.aptitud] ?? t.aptitud}
        </Text>
        <Text variant="screenTitle" accessibilityRole="header">
          {t.nombre}
        </Text>
      </View>
      <View style={styles.pasos}>
        {m.pasos.map((p, i) => (
          <View key={i} style={styles.paso} accessible accessibilityLabel={`Paso ${i + 1}: ${p}`}>
            <View style={styles.numero}>
              <Text variant="timer" maxFontSizeMultiplier={1}>
                {i + 1}
              </Text>
            </View>
            <Text style={styles.flex}>{p}</Text>
          </View>
        ))}
      </View>
      <View style={styles.card} accessible>
        <Text variant="label" color="graphite">
          Errores típicos
        </Text>
        <Text>{errores}.</Text>
      </View>
      <Text accessible>
        <Text variant="label" color="graphite">
          Truco ·{' '}
        </Text>
        {m.truco}
      </Text>
      {/* Único amarillo de la pantalla. Lo que no incluye el plan gratuito lleva al muro (en Práctica). */}
      <Button
        label="Practicar este tipo"
        variant="primary"
        onPress={() => router.push({ pathname: '/practica', params: { tipo: code } })}
      />
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.l },
  volver: {
    width: tokens.size.touchMin,
    height: tokens.size.touchMin,
    borderRadius: tokens.size.touchMin / 2,
    borderWidth: tokens.border.default,
    borderColor: tokens.color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pasos: { gap: tokens.spacing.m },
  paso: { flexDirection: 'row', gap: tokens.spacing.m, alignItems: 'flex-start' },
  numero: {
    width: tokens.size.bubble,
    height: tokens.size.bubble,
    borderRadius: tokens.size.bubble / 2,
    borderWidth: tokens.border.selected,
    borderColor: tokens.color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  card: { ...cardStyle, gap: tokens.spacing.s },
});
