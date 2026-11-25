import { tokens } from '@aptiq/tokens';
import { InfoButton, SourceNote, Text } from '@aptiq/ui';
import { StyleSheet, View } from 'react-native';

import { perfil } from '@/content/content';
import { avisoMezcla, cita } from '@/practice/run';

const dato = (n: number | null, texto: string) =>
  n === null ? `${texto} pendiente de confirmar` : `${n} ${texto}`;

/** Formato en una línea, en mono: «80 PREGUNTAS · 55 MIN · 3 FALLOS RESTAN 1». */
export function formatoCorto() {
  const f = perfil().format;
  return [
    dato(f.preguntas, 'preguntas'),
    f.minutos === null ? 'tiempo pendiente' : `${f.minutos} min`,
    f.opciones === null ? null : `${f.opciones - 1} fallos restan 1`,
  ]
    .filter(Boolean)
    .join(' · ');
}

/**
 * Hoja «i» con todo lo que antes se repetía en cada pantalla (guía §7 bis): formato completo,
 * fuente oficial, aviso de la mezcla de tipos, revisión del contenido e independencia (NFR-08).
 */
export function InfoFormato() {
  const f = perfil().format;
  const mezcla = avisoMezcla();
  return (
    <InfoButton title="Sobre el simulacro">
      <View style={styles.body}>
        <Text>
          Formato oficial: {dato(f.preguntas, 'preguntas')} en {dato(f.minutos, 'minutos')},{' '}
          {dato(f.opciones, 'opciones')}
          {f.opciones !== null ? `; ${f.opciones - 1} fallos restan 1 acierto.` : '.'}
        </Text>
        <SourceNote cita={cita()} />
        {mezcla && <Text color="graphiteStrong">{mezcla}</Text>}
        <Text color="graphiteStrong">
          Las preguntas están en revisión: la dificultad y las explicaciones se validan con
          opositores en la beta.
        </Text>
        <Text variant="bodyStrong">Aptiq es independiente de la Administración.</Text>
      </View>
    </InfoButton>
  );
}

const styles = StyleSheet.create({
  body: { gap: tokens.spacing.m },
});
