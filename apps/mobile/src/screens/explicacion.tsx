import { type Item, reviewOf } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Text } from '@aptiq/ui';
import { StyleSheet, View } from 'react-native';

const LETTERS = ['A', 'B', 'C', 'D'] as const;

/** Explicación paso a paso, error de la opción elegida y truco (EXP-01, EXP-02, EXP-03). Práctica y Repasar. */
export function Explicacion({ item, answer }: { item: Item; answer: number | null }) {
  const r = reviewOf(item, answer);
  const correcta = `${LETTERS[item.answerIndex]} · ${item.options[item.answerIndex]}`;
  const veredicto = r.correct
    ? 'Correcta.'
    : r.blank
      ? `En blanco. La correcta es la ${correcta}.`
      : `Incorrecta. La correcta es la ${correcta}.`;
  return (
    <View style={styles.box}>
      <Text variant="bodyStrong">{veredicto}</Text>
      {r.wrongReason && <Text color="sealText">{r.wrongReason}</Text>}
      <Paso titulo="Observa" texto={item.explanation.observe} />
      <Paso titulo="Regla" texto={item.explanation.rule} />
      <Paso titulo="Aplica" texto={item.explanation.apply} />
      <Paso titulo="Truco" texto={r.tip} />
    </View>
  );
}

function Paso({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <View style={styles.paso} accessible>
      <Text variant="label" color="graphite">
        {titulo}
      </Text>
      <Text>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: tokens.spacing.m },
  paso: { gap: tokens.spacing.xs },
});
