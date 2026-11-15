import { tokens } from '@aptiq/tokens';
import { Button, Icon, PaperBackground, Text, textStyle } from '@aptiq/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AUTH_MESSAGES } from '@/auth/messages';
import { useAuth } from '@/auth/provider';

const CIFRAS = 6;
const ESPERA_S = 60;

/**
 * Código de 6 cifras enviado por correo (ONB-03). Prototipo aprobado por el propietario el
 * 2026-11-15 (docs/prototipos/cuenta-codigo.html).
 */
export function Codigo() {
  const { auth } = useAuth();
  const { email = '' } = useLocalSearchParams<{ email: string }>();
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [comprobando, setComprobando] = useState(false);
  const [espera, setEspera] = useState(ESPERA_S);
  const input = useRef<React.ComponentRef<typeof TextInput>>(null);

  useEffect(() => {
    if (espera <= 0) return;
    const t = setTimeout(() => setEspera((s) => s - 1), 1_000);
    return () => clearTimeout(t);
  }, [espera]);

  const entrar = async (valor = codigo) => {
    if (!auth || comprobando || valor.length !== CIFRAS) return;
    setComprobando(true);
    setError(null);
    const r = await auth.verifyCode(email, valor);
    setComprobando(false);
    if (!r.ok) return setError(AUTH_MESSAGES[r.error]);
    router.dismissTo('/cuenta');
  };

  const reenviar = async () => {
    if (!auth || espera > 0) return;
    setError(null);
    const r = await auth.sendCode(email);
    if (!r.ok) return setError(AUTH_MESSAGES[r.error]);
    setCodigo('');
    setEspera(ESPERA_S);
  };

  const cambiar = (t: string) => {
    const limpio = t.replace(/\D/g, '').slice(0, CIFRAS);
    setCodigo(limpio);
    if (limpio.length === CIFRAS) void entrar(limpio);
  };

  return (
    <PaperBackground scroll style={styles.content}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        hitSlop={tokens.spacing.s}
        style={styles.volver}
      >
        <Icon name="back" />
      </Pressable>
      <Text variant="screenTitle" accessibilityRole="header">
        Escribe el código
      </Text>
      <Text color="graphite">
        Lo hemos enviado a <Text variant="bodyStrong">{email}</Text>.
      </Text>

      <Pressable onPress={() => input.current?.focus()} accessible={false} style={styles.cajas}>
        {Array.from({ length: CIFRAS }, (_, i) => (
          <View
            key={i}
            style={[styles.caja, i >= codigo.length && styles.vacia, i === codigo.length && styles.actual]}
            importantForAccessibility="no-hide-descendants"
          >
            <Text variant="questionTitle">{codigo[i] ?? ''}</Text>
          </View>
        ))}
        {/* Un solo campo invisible encima: teclado numérico y autocompletado del código del sistema. */}
        <TextInput
          ref={input}
          value={codigo}
          onChangeText={cambiar}
          autoFocus
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          maxLength={CIFRAS}
          accessibilityLabel={`Código de ${CIFRAS} cifras`}
          style={[textStyle('body'), styles.oculto]}
          caretHidden
        />
      </Pressable>

      {error && (
        <Text color="sealText" accessibilityLiveRegion="polite" accessibilityRole="alert">
          {error}
        </Text>
      )}
      <Button
        label="Entrar"
        onPress={() => void entrar()}
        disabled={comprobando || codigo.length !== CIFRAS}
      />
      <Button
        label={espera > 0 ? `Reenviar código · 0:${String(espera).padStart(2, '0')}` : 'Reenviar código'}
        variant="secondary"
        onPress={reenviar}
        disabled={espera > 0}
      />
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.l },
  volver: {
    width: tokens.size.touchMin,
    height: tokens.size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -tokens.spacing.s,
  },
  cajas: { flexDirection: 'row', gap: tokens.spacing.s, marginTop: tokens.spacing.s },
  caja: {
    flex: 1,
    minHeight: tokens.size.optionHeight,
    borderWidth: tokens.border.default,
    borderColor: tokens.color.ink,
    borderRadius: tokens.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vacia: { borderColor: tokens.color.line },
  actual: { borderColor: tokens.color.ink, borderBottomWidth: tokens.border.stampOuter },
  oculto: { ...StyleSheet.absoluteFill, opacity: 0 },
});
