import { type Item, reviewOf } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Icon, ListRow, PressScale, Text } from '@aptiq/ui';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useStore } from '@/data/provider';
import { nombreOpcion } from '@/practice/run';
import { yaReportada } from '@/reports/reports';
import { Reportar } from '@/screens/reportar';

/** Une el operador con su número («+ 24») para que no se parta entre líneas. */
export const pegar = (t: string) => t.replace(/([+\-−×÷=]) (?=\d)/g, '$1 ');

/** Explicación paso a paso, error de cada opción incorrecta y truco (EXP-01, EXP-02, EXP-03). */
export function Explicacion({
  item,
  answer,
  anunciar = false,
  abierta = false,
}: {
  item: Item;
  answer: number | null;
  /** En Práctica, el veredicto se anuncia al lector de pantalla al confirmar. */
  anunciar?: boolean;
  /** Paso a paso desplegado de entrada (repaso); en Práctica empieza plegado (guía §7 bis). */
  abierta?: boolean;
}) {
  const [paso, setPaso] = useState(abierta);
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
      <Paso titulo="Regla" texto={item.explanation.rule} />
      <PressScale
        onPress={() => setPaso((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel="Paso a paso"
        accessibilityState={{ expanded: paso }}
        style={styles.plegable}
      >
        <Text variant="label">{paso ? 'Ocultar paso a paso' : 'Ver paso a paso'}</Text>
        <View style={paso && styles.girado}>
          <Icon name="chevron" size={tokens.size.chevron} />
        </View>
      </PressScale>
      {paso && (
        // Solo fundido: también con «reducir movimiento».
        <Animated.View entering={FadeIn.duration(tokens.motion.durationBase)} style={styles.box}>
          <Paso titulo="Observa" texto={item.explanation.observe} />
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
                  {nombreOpcion(item, d.optionIndex)}: {pegar(d.error)}
                </Text>
              );
            })}
          </View>
          <Paso titulo="Truco" texto={r.tip} />
        </Animated.View>
      )}
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
      <Text>{pegar(texto)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: tokens.spacing.m },
  paso: { gap: tokens.spacing.xs },
  plegable: {
    minHeight: tokens.size.touchMin,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.s,
    alignSelf: 'flex-start',
  },
  girado: { transform: [{ rotate: '90deg' }] },
  gracias: {
    minHeight: tokens.size.listRow,
    textAlignVertical: 'center',
    paddingVertical: tokens.spacing.m,
  },
});
