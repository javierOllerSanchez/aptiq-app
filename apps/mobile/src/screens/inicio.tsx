import { guardiaCivil2026, type Level, type TypeCode } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Button, GlassCard, LevelBubbles, PaperBackground, SourceNote, Text } from '@aptiq/ui';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import { APTITUDE_LABELS, FUENTE } from '@/practice/run';

const { preguntas, minutos, opciones } = guardiaCivil2026.format;

/** Inicio: nivel estimado, simulacro, sesión de hoy y práctica por aptitud (ENT-01, ENT-02, SIM-01, PRO-01). */
export function Inicio() {
  const store = useStore();
  const [nivel, setNivel] = useState<number | null>(null);

  useEffect(() => {
    store.getSetting('niveles').then((raw) => {
      if (!raw) return;
      const valores = Object.values(JSON.parse(raw) as Record<TypeCode, Level | null>).filter(
        (v): v is Level => v !== null,
      );
      if (valores.length) setNivel(Math.round(valores.reduce((a, b) => a + b, 0) / valores.length));
    });
  }, [store]);

  return (
    <PaperBackground scroll style={styles.content}>
      <Text variant="label" color="graphite">
        Guardia Civil
      </Text>
      <Text variant="screenTitle" accessibilityRole="header">
        Sesión de hoy
      </Text>
      <Text color="graphite">
        Simulacro con formato oficial: {preguntas} preguntas en {minutos} minutos, {opciones}{' '}
        opciones;
        {opciones !== null ? ` ${opciones - 1} fallos restan 1 acierto.` : ''}
      </Text>
      {nivel !== null && (
        <GlassCard>
          <Text variant="label" color="graphite">
            Nivel estimado · orientativo
          </Text>
          <Text variant="bodyStrong">Nivel {nivel} de 5</Text>
          <LevelBubbles level={nivel} max={5} />
        </GlassCard>
      )}
      <Button
        label="Empezar simulacro"
        onPress={() => router.push('/simulacro')}
        variant="primary"
      />
      <Button label="Sesión de hoy" onPress={() => router.push('/practica')} variant="secondary" />
      <SourceNote organismo={FUENTE} />
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
      <View style={styles.aviso}>
        <Text variant="caption" color="graphite">
          Las preguntas están en revisión: la dificultad y las explicaciones se validan con
          opositores en la beta. Aptiq es independiente de la Administración.
        </Text>
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.m },
  aviso: { paddingTop: tokens.spacing.s },
});
