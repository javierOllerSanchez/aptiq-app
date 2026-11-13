import { type Item, reviewOf } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Text } from '@aptiq/ui';
import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';

import { LETTERS } from '@/practice/run';

/** Explicación paso a paso, error de cada opción incorrecta y truco (EXP-01, EXP-02, EXP-03). */
export function Explicacion({
  item,
  answer,
  anunciar = false,
}: {
  item: Item;
  answer: number | null;
  /** En Práctica, el veredicto se anuncia al lector de pantalla al confirmar. */
  anunciar?: boolean;
}) {
  const r = reviewOf(item, answer);
  const correcta = `${LETTERS[item.answerIndex]} · ${item.options[item.answerIndex]}`;
  const veredicto = r.correct
    ? 'Correcta.'
    : r.blank
      ? `En blanco. La correcta es la ${correcta}.`
      : `Incorrecta. La correcta es la ${correcta}.`;

  useEffect(() => {
    if (anunciar) AccessibilityInfo.announceForAccessibility(veredicto);
  }, [anunciar, veredicto]);

  return (
    <View style={styles.box}>
      <Text variant="bodyStrong">{veredicto}</Text>
      <Paso titulo="Observa" texto={item.explanation.observe} />
      <Paso titulo="Regla" texto={item.explanation.rule} />
      <Paso titulo="Aplica" texto={item.explanation.apply} />
      <View style={styles.paso}>
        <Text variant="label" color="graphite">
          Por qué fallan las demás
        </Text>
        {item.explanation.distractors.map((d) => {
          const tuya = d.optionIndex === answer;
          return (
            <Text key={d.optionIndex} color={tuya ? 'sealText' : 'ink'}>
              {tuya ? 'Tu respuesta, ' : ''}
              {LETTERS[d.optionIndex]} · {item.options[d.optionIndex]}: {d.error}
            </Text>
          );
        })}
      </View>
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
