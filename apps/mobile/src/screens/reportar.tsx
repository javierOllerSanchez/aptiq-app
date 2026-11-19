import type { Item } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Button, Text, withAlpha } from '@aptiq/ui';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/provider';
import { useStore } from '@/data/provider';
import { type Motivo, MOTIVOS, nuevoReporte, reportar, uuid } from '@/reports/reports';

/**
 * Hoja «Reportar un error» (SOP-01, prototipo reportar aprobado). Un motivo obligatorio y un
 * comentario opcional. Se guarda en el móvil y se envía cuando hay red.
 */
export function Reportar({
  item,
  answer,
  visible,
  onClose,
  onSent,
}: {
  item: Item;
  answer: number | null;
  visible: boolean;
  onClose: () => void;
  onSent: () => void;
}) {
  const store = useStore();
  const { reportes } = useAuth();
  const insets = useSafeAreaInsets();
  const [motivo, setMotivo] = useState<Motivo | null>(null);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    if (!motivo) return;
    setEnviando(true);
    const r = nuevoReporte(
      {
        tipo: item.type,
        nivel: item.level,
        semilla: item.seed,
        version: item.meta.generatorVersion,
        opciones: item.options.length,
        respuesta: answer,
        motivo,
        comentario,
      },
      uuid,
    );
    // Sin Supabase configurado (desarrollo) queda guardado como pendiente.
    await reportar(store, reportes ?? { enviar: () => Promise.reject(new Error('sin servidor')) }, r);
    setEnviando(false);
    onSent();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.velo} onPress={onClose} accessible={false} />
      <ScrollView
        style={styles.hojaScroll}
        contentContainerStyle={[styles.hoja, { paddingBottom: Math.max(insets.bottom, tokens.spacing.xxl) }]}
        accessibilityViewIsModal
        onAccessibilityEscape={onClose}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="screenTitle" accessibilityRole="header">
          Reportar un error
        </Text>
        <Text color="graphite">
          Lo revisamos con los datos de esta pregunta (tipo, nivel y semilla). No se envía tu correo ni ningún
          dato personal.
        </Text>
        <View accessibilityRole="radiogroup" accessibilityLabel="Motivo">
          {(Object.keys(MOTIVOS) as Motivo[]).map((m) => (
            <Pressable
              key={m}
              accessibilityRole="radio"
              accessibilityState={{ checked: motivo === m }}
              accessibilityLabel={MOTIVOS[m]}
              onPress={() => setMotivo(m)}
              style={styles.motivo}
            >
              <View style={[styles.radio, motivo === m && styles.radioOn]} />
              <Text style={styles.flex}>{MOTIVOS[m]}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          value={comentario}
          onChangeText={setComentario}
          placeholder="Cuéntanos qué has visto (opcional)"
          placeholderTextColor={tokens.color.graphite}
          accessibilityLabel="Comentario (opcional)"
          maxLength={500}
          multiline
          style={styles.comentario}
        />
        <Button
          label={enviando ? 'Enviando…' : 'Enviar'}
          variant="primary"
          onPress={enviar}
          disabled={motivo === null || enviando}
        />
        <Button label="Cancelar" variant="text" onPress={onClose} disabled={enviando} />
      </ScrollView>
    </Modal>
  );
}

// Mismo tamaño que las burbujas de nivel (22, prototipo reportar).
const radio = tokens.size.levelBubble;
const styles = StyleSheet.create({
  velo: { flex: 1, backgroundColor: withAlpha(tokens.color.ink, tokens.opacity.scrim) },
  hojaScroll: {
    flexGrow: 0,
    maxHeight: '90%',
    backgroundColor: tokens.color.paperCard,
    borderTopLeftRadius: tokens.radius.cardLarge,
    borderTopRightRadius: tokens.radius.cardLarge,
  },
  hoja: { gap: tokens.spacing.m, padding: tokens.spacing.xl },
  motivo: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.m, minHeight: tokens.size.touchMin },
  radio: {
    width: radio,
    height: radio,
    borderRadius: radio / 2,
    borderWidth: tokens.border.selected,
    borderColor: tokens.color.ink,
  },
  radioOn: { borderWidth: radio / 3 },
  flex: { flex: 1 },
  comentario: {
    minHeight: tokens.size.touchMin * 2,
    borderWidth: tokens.border.hairline,
    borderColor: tokens.color.line,
    borderRadius: tokens.radius.option,
    backgroundColor: tokens.color.white,
    padding: tokens.spacing.m,
    color: tokens.color.ink,
    textAlignVertical: 'top',
  },
});
