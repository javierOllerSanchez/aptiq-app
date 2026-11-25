import { tokens } from '@aptiq/tokens';
import {
  Button,
  GlassCard,
  Icon,
  ListRow,
  PaperBackground,
  Text,
  textStyle,
  withAlpha,
} from '@aptiq/ui';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  AccessibilityInfo,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AUTH_MESSAGES, estadoSync, haceCuanto } from '@/auth/messages';
import { useAuth } from '@/auth/provider';
import { useStore } from '@/data/provider';
import { AyudaLegal } from '@/screens/ayuda-legal';
import { Sonidos } from '@/screens/sonidos';
import { Recordatorio } from '@/screens/recordatorio';
import { TuPlan } from '@/screens/tu-plan';
import { TabSpacer } from '@/screens/tab-spacer';

/**
 * Cuenta (ONB-03). Prototipo aprobado por el propietario el 2026-11-15 (docs/prototipos/cuenta*.html).
 * Sin sesión: invitación opcional con aviso de subida (decisión 4). Con sesión: sincronización y acciones.
 */
export function Cuenta() {
  const { auth, session } = useAuth();
  return (
    <PaperBackground scroll style={styles.content}>
      {/* Con sesión, el plan y el recordatorio van dentro de ConSesion, antes de «Tus datos». */}
      {auth && session ? (
        <ConSesion email={session.user.email ?? ''} />
      ) : (
        <>
          <Text variant="screenTitle" accessibilityRole="header">
            Cuenta
          </Text>
          <TuPlan />
          <Recordatorio />
          <Sonidos />
          {auth ? <Invitacion /> : <SinConfigurar />}
        </>
      )}
      <AyudaLegal />
      <TabSpacer />
    </PaperBackground>
  );
}

function SinConfigurar() {
  return (
    <Text color="graphite">
      Las cuentas no están disponibles en esta versión. Tu progreso sigue guardado en el móvil.
    </Text>
  );
}

/** Muestra el error y lo lee también VoiceOver (las regiones vivas solo funcionan en Android). */
const anunciar = (set: (t: string) => void, texto: string) => {
  set(texto);
  if (Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(texto);
};

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
        setGuardado({
          simulacros: a.filter((x) => x.finishedAt !== null).length,
          sesiones: s.length,
        }),
      );
    }, [store]),
  );

  const enviar = async () => {
    if (!auth || enviando) return;
    setEnviando(true);
    setError(null);
    const r = await auth.sendCode(email);
    setEnviando(false);
    if (!r.ok) return anunciar(setError, AUTH_MESSAGES[r.error]);
    router.push({ pathname: '/codigo', params: { email: email.trim().toLowerCase() } });
  };

  return (
    <>
      <GlassCard accessible={false} style={styles.seccion}>
        <Text variant="questionTitle" accessibilityRole="header">
          Guarda tu progreso
        </Text>
        <Text color="graphiteStrong">Opcional: conserva tu nivel si cambias de móvil.</Text>
        <View style={styles.campo}>
          <Text
            variant="label"
            color="graphiteStrong"
            nativeID="etiqueta-correo"
            accessibilityElementsHidden
          >
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
          <Text variant="caption" color="graphiteStrong" style={styles.flex}>
            Te enviamos un código de 6 cifras. Sin contraseñas.
          </Text>
        </View>
      </GlassCard>
      <Text variant="caption" color="graphite">
        {guardado && guardado.simulacros + guardado.sesiones > 0
          ? `Se suben ${plural(guardado.simulacros, 'simulacro', 'simulacros')} y ${plural(guardado.sesiones, 'sesión', 'sesiones')} de este móvil.`
          : 'Lo que hagas a partir de ahora se guarda también en tu cuenta.'}{' '}
        Solo respuestas, fechas y ajustes; nunca el texto de las preguntas.
      </Text>
    </>
  );
}

function ConSesion({ email }: { email: string }) {
  const { auth, status, syncNow } = useAuth();
  const [saliendo, setSaliendo] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
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

  const cerrarHoja = () => {
    if (!borrando) setConfirmar(false);
  };

  const exportar = async () => {
    if (!auth) return;
    setAviso(null);
    const r = await auth.exportData();
    if (!r.ok) return anunciar(setAviso, AUTH_MESSAGES[r.error]);
    try {
      await Share.share({ title: 'Mis datos de Aptiq', message: r.json });
    } catch {
      anunciar(setAviso, AUTH_MESSAGES.desconocido);
    }
  };

  const borrar = async () => {
    if (!auth || borrando) return;
    setBorrando(true);
    const r = await auth.deleteAccount();
    setBorrando(false);
    setConfirmar(false);
    if (!r.ok) return anunciar(setAviso, AUTH_MESSAGES[r.error]);
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
          <Text variant="label" color="graphiteStrong" accessibilityRole="header">
            Sincronización
          </Text>
          {status.lastSync !== null && (
            <Text variant="formula" color="graphiteStrong">
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
          <Text variant="caption" color="graphiteStrong" style={styles.flex}>
            Datos en servidores de la Unión Europea. Se guardan respuestas, fechas y ajustes; nunca
            el texto de las preguntas.
          </Text>
        </View>
      </GlassCard>
      <TuPlan />
      <Recordatorio />
      <Sonidos />
      <Text variant="label" color="graphite" accessibilityRole="header" style={styles.seccion}>
        Tus datos
      </Text>
      {aviso && (
        <Text color="sealText" accessibilityLiveRegion="polite" accessibilityRole="alert">
          {aviso}
        </Text>
      )}
      <View>
        <ListRow
          label="Exportar mis datos"
          detail="Archivo JSON con todo lo guardado"
          onPress={exportar}
        />
        <ListRow
          label="Cerrar sesión"
          detail="Lo pendiente se sube antes de salir"
          onPress={cerrar}
        />
        <ListRow
          label="Borrar cuenta"
          detail="Elimina la cuenta y todos sus datos"
          onPress={() => setConfirmar(true)}
        />
      </View>
      <Modal
        visible={confirmar}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={cerrarHoja}
      >
        <Pressable style={styles.velo} onPress={cerrarHoja} accessible={false} />
        <ScrollView
          style={styles.hojaScroll}
          contentContainerStyle={[
            styles.hoja,
            { paddingBottom: Math.max(insets.bottom, tokens.spacing.xxl) },
          ]}
          accessibilityViewIsModal
          onAccessibilityEscape={cerrarHoja}
        >
          <Text variant="questionTitle" accessibilityRole="header">
            ¿Borrar tu cuenta?
          </Text>
          <Text color="graphite">
            Se eliminan de nuestros servidores tu cuenta, tus simulacros, tus sesiones y tus
            ajustes, y también lo guardado en este móvil. No se puede deshacer.
          </Text>
          <Text color="graphite">Si quieres conservar una copia, exporta tus datos antes.</Text>
          <Button
            label={borrando ? 'Borrando…' : 'Borrar cuenta'}
            variant="secondary"
            onPress={borrar}
            disabled={borrando}
          />
          <Button
            label="Cancelar"
            variant="text"
            onPress={() => setConfirmar(false)}
            disabled={borrando}
          />
        </ScrollView>
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
  hojaScroll: {
    flexGrow: 0,
    maxHeight: '90%',
    backgroundColor: tokens.color.paperCard,
    borderTopLeftRadius: tokens.radius.cardLarge,
    borderTopRightRadius: tokens.radius.cardLarge,
  },
  hoja: { gap: tokens.spacing.m, padding: tokens.spacing.xl },
  punto: {
    width: tokens.spacing.s,
    height: tokens.spacing.s,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.color.ink,
  },
});
