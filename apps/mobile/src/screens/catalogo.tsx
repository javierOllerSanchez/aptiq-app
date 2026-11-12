import { tokens } from '@aptiq/tokens';
import {
  Button,
  GlassCard,
  LevelBubbles,
  Logo,
  OptionBubble,
  PaperBackground,
  ProgressTicks,
  SourceNote,
  Stamp,
  TabBar,
  Text,
  type OptionState,
  type Tab,
  type TextVariant,
} from '@aptiq/ui';
import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { CITA } from '@/practice/run';

const { color, spacing, radius } = tokens;
const answered = Array.from({ length: 40 }, (_, i) => i < 11);

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="label" color="graphite" accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

/** Catálogo de componentes (solo en desarrollo). Referencia: docs/prototipos/sistema.html. */
export function Catalogo() {
  const [marked, setMarked] = useState<string | null>('B');
  const [tab, setTab] = useState<Tab>('home');
  const [stampKey, setStampKey] = useState(0);
  const options: [string, string, OptionState][] = [
    ['A', '47', marked === 'A' ? 'marked' : 'empty'],
    ['B', '63', marked === 'B' ? 'marked' : 'empty'],
    ['C', '63', 'correct'],
    ['D', '55', 'wrong'],
  ];

  return (
    <PaperBackground scroll style={styles.scroll}>
      <Text variant="label" color="graphite">
        Sistema visual
      </Text>
      <Text variant="screenTitle" accessibilityRole="header">
        Catálogo
      </Text>

      <Section title="Tipografía">
        {(Object.keys(tokens.type) as TextVariant[]).map((v) => (
          <Text key={v} variant={v} {...(v === 'seal' && { color: 'seal' as const })}>
            {v === 'seal' ? 'Apto' : `${v} · Saca tu apto`}
          </Text>
        ))}
      </Section>

      <Section title="Logotipo">
        <Logo />
        <View style={styles.logoRow}>
          <View style={[styles.swatch, { backgroundColor: color.ink }]}>
            <Logo on="ink" width={tokens.size.logoMin} />
          </View>
          <View style={[styles.swatch, { backgroundColor: color.highlighter }]}>
            <Logo on="highlighter" width={tokens.size.logoMin} />
          </View>
        </View>
      </Section>

      <Section title="Botones">
        <Button label="Empezar simulacro" onPress={() => {}} />
        <Button label="Repasar fallos" variant="secondary" onPress={() => {}} />
        <Button label="En blanco" variant="glass" onPress={() => {}} />
        <Button label="Confirmar" onPress={() => {}} disabled />
      </Section>

      <Section title="Opciones · vacía, marcada, correcta, fallo">
        {options.map(([letter, value, state]) => (
          <OptionBubble
            key={letter}
            letter={letter}
            value={value}
            state={state}
            {...(state === 'empty' || state === 'marked'
              ? { onPress: () => setMarked(letter) }
              : {})}
          />
        ))}
      </Section>

      <Section title="Progreso del test · 12/40">
        <ProgressTicks total={40} current={11} answered={answered} />
      </Section>

      <Section title="Nivel · 7/10">
        <LevelBubbles level={7} />
      </Section>

      <Section title="Cristal">
        <View style={styles.cards}>
          <GlassCard style={styles.card}>
            <Text variant="label" color="graphiteStrong">
              Racha
            </Text>
            <Text variant="screenTitle">6 días</Text>
          </GlassCard>
          <GlassCard style={styles.card}>
            <Text variant="label" color="graphiteStrong">
              Por pregunta
            </Text>
            <Text variant="screenTitle">38 s</Text>
          </GlassCard>
        </View>
      </Section>

      <Section title="Sello">
        <Stamp key={stampKey} />
        <Button
          label="Repetir aparición"
          variant="secondary"
          onPress={() => setStampKey((k) => k + 1)}
        />
      </Section>

      <Section title="Fuente">
        <SourceNote cita={CITA} />
      </Section>

      <Section title="Navegación">
        <TabBar active={tab} onSelect={setTab} />
      </Section>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { gap: spacing.xxl },
  section: { gap: spacing.m },
  logoRow: { flexDirection: 'row', gap: spacing.m },
  swatch: { padding: spacing.l, borderRadius: radius.button },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.m },
  card: { flexGrow: 1, flexBasis: tokens.size.logo * 2 },
});
