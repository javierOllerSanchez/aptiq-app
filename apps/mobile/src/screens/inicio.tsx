import { tokens } from '@aptiq/tokens';
import { Button, PaperBackground, SourceNote, Text } from '@aptiq/ui';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { APTITUDE_LABELS } from '@/practice/run';

/** Inicio: sesión de hoy, simulacro y práctica por aptitud (ENT-01, ENT-02, SIM-01). */
export function Inicio() {
  return (
    <PaperBackground scroll>
      <View style={styles.content}>
        <Text variant="label" color="graphite">
          Guardia Civil
        </Text>
        <Text variant="screenTitle" accessibilityRole="header">
          Sesión de hoy
        </Text>
        <Text color="graphite">
          Simulacro con formato oficial: 4 opciones; 3 fallos restan 1 acierto.
        </Text>
        <Button
          label="Empezar sesión de hoy"
          onPress={() => router.push('/practica')}
          variant="primary"
        />
        <Button
          label="Empezar simulacro"
          onPress={() => router.push('/simulacro')}
          variant="secondary"
        />
        <Text variant="label" color="graphite">
          Práctica por aptitud
        </Text>
        {Object.entries(APTITUDE_LABELS).map(([id, label]) => (
          <Button
            key={id}
            label={label}
            onPress={() => router.push({ pathname: '/practica', params: { aptitud: id } })}
            variant="secondary"
          />
        ))}
        <SourceNote organismo="BOE · Resolución 160/38243/2026" />
        <Text variant="caption" color="graphite">
          Las preguntas están en revisión: la dificultad y las explicaciones se validan con
          opositores en la beta.
        </Text>
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: tokens.spacing.screenX,
    gap: tokens.spacing.m,
    paddingTop: tokens.spacing.screenTop,
  },
});
