import { type Item, reviewOf } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { ListRow, Text } from '@aptiq/ui';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import { nombreOpcion } from '@/practice/run';
import { yaReportada } from '@/reports/reports';
import { Reportar } from '@/screens/reportar';

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
  const correcta = nombreOpcion(item, item.answerIndex);
  const store = useStore();
  const [hoja, setHoja] = useState(false);
  const [reportada, setReportada] = useState(false);
  useEffect(() => {
    void yaReportada(store, item.type, item.seed).then(setReportada);
  }, [store, item.type, item.seed]);
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
              {nombreOpcion(item, d.optionIndex)}: {d.error}
            </Text>
          );
        })}
      </View>
      <Paso titulo="Truco" texto={r.tip} />
      {/* Prototipo reportar (aprobado): ficha de método y reporte al final de la explicación. */}
      <View>
        <ListRow
          label="Cómo se resuelve este tipo"
          onPress={() => router.push({ pathname: '/metodo', params: { tipo: item.type } })}
        />
        {reportada ? (
          <Text color="graphite" style={styles.gracias}>
            Error reportado. Gracias.
          </Text>
        ) : (
          <ListRow label="Reportar un error" onPress={() => setHoja(true)} />
        )}
      </View>
      <Reportar
        item={item}
        answer={answer}
        visible={hoja}
        onClose={() => setHoja(false)}
        onSent={() => {
          setHoja(false);
          setReportada(true);
          AccessibilityInfo.announceForAccessibility('Error reportado. Gracias.');
        }}
      />
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
  gracias: { minHeight: tokens.size.listRow, textAlignVertical: 'center', paddingVertical: tokens.spacing.m },
});
