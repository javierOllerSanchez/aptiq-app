import { tokens } from '@aptiq/tokens';
import { Button, GlassCard, Icon, ListRow, PaperBackground, Text, textStyle, withAlpha } from '@aptiq/ui';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Modal, Pressable, Share, StyleSheet, TextInput, View } from 'react-native';

import { AUTH_MESSAGES, estadoSync, haceCuanto } from '@/auth/messages';
import { useAuth } from '@/auth/provider';
import { useStore } from '@/data/provider';
import { TabSpacer } from '@/screens/tab-spacer';

/**
 * Cuenta (ONB-03). Prototipo aprobado por el propietario el 2026-11-15 (docs/prototipos/cuenta*.html).
 * Sin sesión: invitación opcional con aviso de subida (decisión 4). Con sesión: sincronización y acciones.
 */
export function Cuenta() {
  const { auth, session } = useAuth();
  return (
    <PaperBackground scroll style={styles.content}>
      {!auth ? <SinConfigurar /> : session ? <ConSesion email={session.user.email ?? ''} /> : <Invitacion />}
      <TabSpacer />
    </PaperBackground>
  );
}

function SinConfigurar() {
  return (
    <>
      <Text variant="screenTitle" accessibilityRole="header">
        Cuenta
      </Text>
      <Text color="graphite">
        Las cuentas no están disponibles en esta versión. Tu progreso sigue guardado en el móvil.
      </Text>
    </>
  );
}

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

function Invitacion() {
  const { auth } = useAuth();
  const store = useStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [guardado, setGuardado] = useState<{ simulacros: number; sesiones: number } | null>(null);

  useFocusEffect(
    useCallback(() => {
      Promise.all([store.attempts(), store.sessions()]).then(([a, s]) =>
        setGuardado({ simulacros: a.filter((x) => x.finishedAt !== null).length, sesiones: s.length }),
      );
    }, [store]),
  );

  const enviar = async () => {
    if (!auth || enviando) return;
    setEnviando(true);
    setError(null);
    const r = await auth.sendCode(email);
    setEnviando(false);
    if (!r.ok) return setError(AUTH_MESSAGES[r.error]);
    router.push({ pathname: '/codigo', params: { email: email.trim().toLowerCase() } });
  };

  return (
    <>
      <Text variant="screenTitle" accessibilityRole="header">
        Guarda tu progreso
      </Text>
      <Text color="graphite">
        Con una cuenta, tus simulacros y tu nivel se conservan si cambias de móvil o lo pierdes. Es
        opcional: puedes seguir sin ella.
      </Text>
      <GlassCard>
        <View style={styles.campo}>
          <Text variant="label" color="graphite" nativeID="etiqueta-correo">
            Correo electrónico
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            onSubmitEditing={enviar}
            placeholder="nombre@correo.es"
            placeholderTextColor={tokens.color.graphite}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="send"
            accessibilityLabel="Correo electrónico"
            accessibilityLabelledBy="etiqueta-correo"
            style={[textStyle('body'), styles.input]}
          />
          {error && (
            <Text color="sealText" accessibilityLiveRegion="polite" accessibilityRole="alert">
              {error}
            </Text>
          )}
        </View>
        <Button label="Enviar código" onPress={enviar} disabled={enviando || !email.trim()} />
        <View style={styles.nota}>
          <Icon name="document" color="graphite" size={tokens.size.chevron} />
          <Text variant="caption" color="graphite" style={styles.flex}>
            Te enviamos un código de 6 cifras. Sin contraseñas.
          </Text>
        </View>
      </GlassCard>
      <Text variant="label" color="graphite" accessibilityRole="header" style={styles.seccion}>
        Al crear la cuenta
      </Text>
      <Text color="graphite">
        {guardado && guardado.simulacros + guardado.sesiones > 0
          ? `Lo que ya tienes guardado en este móvil (${plural(guardado.simulacros, 'simulacro', 'simulacros')} y ${plural(guardado.sesiones, 'sesión', 'sesiones')}) se sube a tu cuenta.`
          : 'Lo que guardes a partir de ahora se guarda también en tu cuenta.'}{' '}
        Solo guardamos tus respuestas, fechas y ajustes; nunca el texto de las preguntas.
      </Text>
      <Button label="Ahora no" variant="secondary" onPress={() => router.navigate('/inicio')} />
    </>
  );
}

function ConSesion({ email }: { email: string }) {
  const { auth, status, syncNow } = useAuth();
  const [saliendo, setSaliendo] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [ahora, setAhora] = useState(() => Date.now());

  // Al entrar en Cuenta se sincroniza y se refresca el «hace X min».
  useFocusEffect(
    useCallback(() => {
      syncNow();
      const t = setInterval(() => setAhora(Date.now()), 30_000);
      return () => clearInterval(t);
    }, [syncNow]),
  );

  const cerrar = async () => {
    if (!auth || saliendo) return;
    setSaliendo(true);
    await auth.signOut();
    setSaliendo(false);
  };

  const exportar = async () => {
    if (!auth) return;
    setAviso(null);
    const r = await auth.exportData();
    if (!r.ok) return setAviso(AUTH_MESSAGES[r.error]);
    await Share.share({ title: 'Mis datos de Aptiq', message: r.json });
  };

  const borrar = async () => {
    if (!auth || borrando) return;
    setBorrando(true);
    const r = await auth.deleteAccount();
    setBorrando(false);
    setConfirmar(false);
    if (!r.ok) return setAviso(AUTH_MESSAGES[r.error]);
    router.replace('/onboarding');
  };

  return (
    <>
      <Text variant="screenTitle" accessibilityRole="header">
        Cuenta
      </Text>
      <Text color="graphite">{email}</Text>
      <GlassCard>
        <View style={styles.cabecera}>
          <Text variant="label" color="graphite">
            Sincronización
          </Text>
          {status.lastSync !== null && (
            <Text variant="label" color="graphite">
              {haceCuanto(status.lastSync, Math.max(ahora, status.lastSync))}
            </Text>
          )}
        </View>
        <View style={styles.estado} accessible accessibilityLiveRegion="polite">
          <View style={styles.punto} />
          <Text variant="bodyStrong">{estadoSync(status.pending, status.lastSync)}</Text>
        </View>
        <View style={styles.nota}>
          <Icon name="document" color="graphite" size={tokens.size.chevron} />
          <Text variant="caption" color="graphite" style={styles.flex}>
            Datos en servidores de la Unión Europea. Se guardan respuestas, fechas y ajustes; nunca el
            texto de las preguntas.
          </Text>
        </View>
      </GlassCard>
      <Text variant="label" color="graphite" accessibilityRole="header" style={styles.seccion}>
        Tus datos
      </Text>
      {aviso && (
        <Text color="sealText" accessibilityLiveRegion="polite" accessibilityRole="alert">
          {aviso}
        </Text>
      )}
      <View>
        <ListRow label="Exportar mis datos" detail="Archivo JSON con todo lo guardado" onPress={exportar} />
        <ListRow label="Cerrar sesión" detail="Lo pendiente se sube antes de salir" onPress={cerrar} />
        <ListRow label="Borrar cuenta" detail="Elimina la cuenta y todos sus datos" onPress={() => setConfirmar(true)} />
      </View>
      <Modal visible={confirmar} transparent animationType="slide" onRequestClose={() => setConfirmar(false)}>
        <Pressable style={styles.velo} onPress={() => setConfirmar(false)} accessible={false} />
        <View style={styles.hoja} accessibilityViewIsModal>
          <Text variant="questionTitle" accessibilityRole="header">
            ¿Borrar tu cuenta?
          </Text>
          <Text color="graphite">
            Se eliminan de nuestros servidores tu cuenta, tus simulacros, tus sesiones y tus ajustes, y
            también lo guardado en este móvil. No se puede deshacer.
          </Text>
          <Text color="graphite">Si quieres conservar una copia, exporta tus datos antes.</Text>
          <Button label="Borrar cuenta" variant="secondary" onPress={borrar} disabled={borrando} />
          <Button label="Cancelar" variant="secondary" onPress={() => setConfirmar(false)} />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.m },
  campo: { gap: tokens.spacing.s },
  input: {
    minHeight: tokens.size.buttonHeight,
    borderWidth: tokens.border.default,
    borderColor: tokens.color.ink,
    borderRadius: tokens.radius.button,
    paddingHorizontal: tokens.spacing.l,
    color: tokens.color.ink,
  },
  nota: { flexDirection: 'row', alignItems: 'flex-start', gap: tokens.spacing.s },
  flex: { flex: 1 },
  seccion: { marginTop: tokens.spacing.m },
  cabecera: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  estado: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.s },
  velo: { flex: 1, backgroundColor: withAlpha(tokens.color.ink, tokens.opacity.scrim) },
  hoja: {
    gap: tokens.spacing.m,
    padding: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xxl * 2,
    backgroundColor: tokens.color.paperCard,
    borderTopLeftRadius: tokens.radius.cardLarge,
    borderTopRightRadius: tokens.radius.cardLarge,
  },
  punto: {
    width: tokens.spacing.s,
    height: tokens.spacing.s,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.color.ink,
  },
});
