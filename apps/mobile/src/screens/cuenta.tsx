import { tokens } from '@aptiq/tokens';
import {
  Button,
  entrada,
  GlassCard,
  Icon,
  IconTile,
  ListRow,
  PaperBackground,
  SettingsGroup,
  Sheet,
  Text,
  textStyle,
  withAlpha,
} from '@aptiq/ui';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo, Platform, Share, StyleSheet, TextInput, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { AUTH_MESSAGES, estadoSync, haceCuanto } from '@/auth/messages';
import { useAuth } from '@/auth/provider';
import { useStore } from '@/data/provider';
import { fechaCorta } from '@/history/rows';
import { usePlan } from '@/purchases/provider';
import { AyudaLegal, PieLegal } from '@/screens/ayuda-legal';
import { FechaExamen } from '@/screens/fecha-examen';
import { Recordatorio } from '@/screens/recordatorio';
import { Sonidos } from '@/screens/sonidos';
import { TabSpacer } from '@/screens/tab-spacer';
import { TuPlan } from '@/screens/tu-plan';

/**
 * Cuenta v2 (prototipo `cuenta-v2.html`, aprobado el 2026-11-25): ficha arriba, Premium como
 * tarjeta de tinta, «Guarda tu progreso» en una hoja y ajustes agrupados con iconos (ONB-03,
 * PAY-03, NOT-01, NFR-05, NFR-08).
 */
export function Cuenta() {
  const { auth, session } = useAuth();
  const { plan } = usePlan();
  const reduce = useReducedMotion();
  const conSesion = !!auth && !!session;
  let orden = 0;
  const entra = () => entrada(orden++, reduce);

  return (
    <PaperBackground scroll style={styles.content}>
      <Animated.View entering={entra()}>
        <Text variant="screenTitle" accessibilityRole="header">
          Cuenta
        </Text>
      </Animated.View>
      <Animated.View entering={entra()}>
        <Perfil email={conSesion ? (session?.user.email ?? '') : null} premium={plan.premium} />
      </Animated.View>
      {!plan.premium && (
        <Animated.View entering={entra()}>
          <TarjetaPremium />
        </Animated.View>
      )}
      {auth && !session && (
        <Animated.View entering={entra()}>
          <GuardarProgreso />
        </Animated.View>
      )}
      {!auth && (
        <Text variant="caption" color="graphite">
          Las cuentas no están disponibles en esta versión. Tu progreso sigue guardado en el móvil.
        </Text>
      )}

      <Animated.View entering={entra()} style={styles.seccion}>
        <Etiqueta>Preferencias</Etiqueta>
        <SettingsGroup>
          <Recordatorio />
          <Sonidos />
          <FechaExamen />
        </SettingsGroup>
      </Animated.View>

      <Animated.View entering={entra()} style={styles.seccion}>
        <Etiqueta>{conSesion ? 'Tu cuenta' : 'Tu plan'}</Etiqueta>
        {conSesion ? (
          <TuCuenta />
        ) : (
          <SettingsGroup>
            <TuPlan />
          </SettingsGroup>
        )}
      </Animated.View>

      <Animated.View entering={entra()} style={styles.seccion}>
        <Etiqueta>Ayuda y privacidad</Etiqueta>
        <SettingsGroup>
          <AyudaLegal />
        </SettingsGroup>
      </Animated.View>
      <PieLegal />
      <TabSpacer />
    </PaperBackground>
  );
}

function Etiqueta({ children }: { children: string }) {
  return (
    <Text variant="label" color="graphite" accessibilityRole="header">
      {children}
    </Text>
  );
}

/** Ficha del opositor: inicial, correo o «Aún sin cuenta», desde cuándo practica y su plan. */
function Perfil({ email, premium }: { email: string | null; premium: boolean }) {
  const store = useStore();
  const [desde, setDesde] = useState<number | null>(null);
  useFocusEffect(
    useCallback(() => {
      Promise.all([store.sessions(), store.attempts()]).then(([s, a]) => {
        const fechas = [...s.map((x) => x.creada), ...a.map((x) => x.empezado)];
        setDesde(fechas.length ? Math.min(...fechas) : null);
      });
    }, [store]),
  );
  const inicial = email ? email.trim().charAt(0).toUpperCase() : '?';
  const detalle = !email
    ? 'Tu progreso se guarda solo en este móvil'
    : desde
      ? `Practicando desde el ${fechaCorta(desde)}`
      : 'Cuenta creada';
  return (
    <GlassCard style={styles.perfil}>
      <View style={styles.avatar} accessibilityElementsHidden importantForAccessibility="no">
        <Text variant="questionTitle" color="highlighter" maxFontSizeMultiplier={1}>
          {inicial}
        </Text>
        <View style={styles.avatarPunto} />
      </View>
      <View style={styles.flex}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {email ?? 'Aún sin cuenta'}
        </Text>
        <Text variant="caption" color="graphiteStrong">
          {detalle}
        </Text>
        <View style={styles.chips}>
          <Chip>Guardia Civil</Chip>
          <Chip destacado={premium}>{premium ? 'Premium' : 'Plan gratuito'}</Chip>
        </View>
      </View>
    </GlassCard>
  );
}

function Chip({ children, destacado = false }: { children: string; destacado?: boolean }) {
  return (
    <View style={[styles.chip, destacado && styles.chipDestacado]}>
      <Text variant="label" maxFontSizeMultiplier={1.2}>
        {children}
      </Text>
    </View>
  );
}

/** Premium como tarjeta de tinta (solo con el plan gratuito): el único amarillo grande de Cuenta. */
function TarjetaPremium() {
  const { api } = usePlan();
  const [prueba, setPrueba] = useState(false);
  // «Probar 7 días gratis» solo si la tienda ofrece la prueba a esta persona; si no, «Ver Premium».
  useEffect(() => {
    api.ofertas().then(
      (o) => setPrueba(o.some((x) => x.prueba)),
      () => setPrueba(false),
    );
  }, [api]);
  return (
    <View style={styles.premium}>
      <View style={styles.circulo} pointerEvents="none" />
      <View style={[styles.circulo, styles.circuloPequeno]} pointerEvents="none" />
      <Text variant="label" color="highlighter">
        Aptiq Premium
      </Text>
      <Text variant="questionTitle" color="paperCard" accessibilityRole="header">
        Entrena sin límites hasta el examen
      </Text>
      <View style={styles.ventajas}>
        {[
          'Sesión de hoy y simulacros ilimitados',
          'Las cinco aptitudes y todos los niveles',
          'Nivel por aptitud e historial completo',
        ].map((v) => (
          <View key={v} style={styles.ventaja}>
            <View style={styles.punto} />
            <Text color="paperCard" style={styles.flex}>
              {v}
            </Text>
          </View>
        ))}
      </View>
      <Button
        label={prueba ? 'Probar 7 días gratis' : 'Ver Premium'}
        onPress={() => router.push('/muro-pago')}
        variant="primary"
      />
    </View>
  );
}

/** Muestra el error y lo lee también VoiceOver (las regiones vivas solo funcionan en Android). */
const anunciar = (set: (t: string) => void, texto: string) => {
  set(texto);
  if (Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(texto);
};

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/** «Guarda tu progreso»: una fila que abre la hoja con el correo (sin contraseñas). */
function GuardarProgreso() {
  const { auth } = useAuth();
  const store = useStore();
  const [abierta, setAbierta] = useState(false);
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
    setAbierta(false);
    router.push({ pathname: '/codigo', params: { email: email.trim().toLowerCase() } });
  };

  return (
    <>
      <SettingsGroup>
        <ListRow
          icon="cloud"
          label="Guarda tu progreso"
          detail="Con tu correo, por si cambias de móvil"
          onPress={() => setAbierta(true)}
        />
      </SettingsGroup>
      <Sheet visible={abierta} onClose={() => setAbierta(false)} title="Guarda tu progreso">
        <View style={styles.hoja}>
          <Text color="graphiteStrong">
            Te enviamos un código de 6 cifras. Sin contraseñas.{' '}
            {guardado && guardado.simulacros + guardado.sesiones > 0
              ? `Se suben ${plural(guardado.simulacros, 'simulacro', 'simulacros')} y ${plural(guardado.sesiones, 'sesión', 'sesiones')} de este móvil.`
              : 'Lo que hagas a partir de ahora se guarda también en tu cuenta.'}
          </Text>
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
          <Text variant="caption" color="graphite">
            Solo respuestas, fechas y ajustes; nunca el texto de las preguntas.
          </Text>
        </View>
      </Sheet>
    </>
  );
}

/** Con sesión: sincronización, plan, exportar, cerrar sesión y borrar cuenta. */
function TuCuenta() {
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
      <SettingsGroup>
        <View style={styles.fila} accessible accessibilityLiveRegion="polite">
          <IconTile name="cloud" />
          <View style={styles.flex}>
            <Text variant="bodyStrong">Sincronización</Text>
            <Text variant="caption" color="graphite">
              {estadoSync(status.pending, status.lastSync)}
            </Text>
          </View>
          {status.lastSync !== null && (
            <Text variant="formula" color="graphiteStrong">
              {haceCuanto(status.lastSync, Math.max(ahora, status.lastSync))}
            </Text>
          )}
        </View>
        <TuPlan />
        <ListRow
          icon="document"
          label="Exportar mis datos"
          detail="Archivo JSON con todo lo guardado"
          onPress={exportar}
        />
        <ListRow
          icon="logout"
          label="Cerrar sesión"
          detail="Lo pendiente se sube antes de salir"
          plain
          onPress={cerrar}
        />
        <ListRow
          icon="trash"
          label="Borrar cuenta"
          detail="Elimina la cuenta y todos sus datos"
          danger
          plain
          onPress={() => setConfirmar(true)}
        />
      </SettingsGroup>
      {aviso && (
        <Text color="sealText" accessibilityLiveRegion="polite" accessibilityRole="alert">
          {aviso}
        </Text>
      )}
      <View style={styles.nota}>
        <Icon name="document" color="graphite" size={tokens.size.chevron} />
        <Text variant="caption" color="graphiteStrong" style={styles.flex}>
          Datos en servidores de la Unión Europea. Se guardan respuestas, fechas y ajustes; nunca el
          texto de las preguntas.
        </Text>
      </View>
      <Sheet
        visible={confirmar}
        onClose={() => !borrando && setConfirmar(false)}
        title="¿Borrar tu cuenta?"
      >
        <View style={styles.hoja}>
          <Text color="graphiteStrong">
            Se eliminan de nuestros servidores tu cuenta, tus simulacros, tus sesiones y tus
            ajustes, y también lo guardado en este móvil. No se puede deshacer.
          </Text>
          <Text color="graphiteStrong">
            Si quieres conservar una copia, exporta tus datos antes.
          </Text>
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
        </View>
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.l },
  flex: { flex: 1 },
  seccion: { gap: tokens.spacing.s },
  perfil: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.l },
  avatar: {
    width: tokens.size.avatar,
    height: tokens.size.avatar,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPunto: {
    position: 'absolute',
    right: -tokens.border.selected,
    bottom: -tokens.border.selected,
    width: tokens.size.streakBubble,
    height: tokens.size.streakBubble,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.color.highlighter,
    borderWidth: tokens.border.selected,
    borderColor: tokens.color.ink,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.xs,
    marginTop: tokens.spacing.s,
  },
  chip: {
    paddingHorizontal: tokens.spacing.s,
    paddingVertical: tokens.spacing.xs / 2,
    borderRadius: tokens.radius.pill,
    borderWidth: tokens.border.default,
    borderColor: tokens.color.ink,
  },
  chipDestacado: { backgroundColor: tokens.color.highlighter },
  premium: {
    gap: tokens.spacing.m,
    padding: tokens.spacing.xl,
    borderRadius: tokens.radius.cardLarge,
    backgroundColor: tokens.color.ink,
    overflow: 'hidden',
  },
  // Burbujas de la hoja de respuestas como adorno, en trazo fino (sin brillos ni degradados).
  circulo: {
    position: 'absolute',
    right: -tokens.spacing.xxl,
    top: -tokens.spacing.xxl,
    width: tokens.size.ring + tokens.spacing.xxl,
    height: tokens.size.ring + tokens.spacing.xxl,
    borderRadius: tokens.radius.pill,
    borderWidth: tokens.border.selected,
    borderColor: withAlpha(tokens.color.highlighter, tokens.opacity.scrim),
  },
  circuloPequeno: {
    right: tokens.spacing.xxl,
    top: tokens.spacing.xxl * 1.5,
    width: tokens.size.touchMin,
    height: tokens.size.touchMin,
  },
  ventajas: { gap: tokens.spacing.s },
  ventaja: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.s },
  punto: {
    width: tokens.size.chevron - tokens.spacing.xs,
    height: tokens.size.chevron - tokens.spacing.xs,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.color.highlighter,
  },
  hoja: { gap: tokens.spacing.m },
  campo: { gap: tokens.spacing.s },
  input: {
    minHeight: tokens.size.buttonHeight,
    borderWidth: tokens.border.default,
    borderColor: tokens.color.ink,
    borderRadius: tokens.radius.button,
    paddingHorizontal: tokens.spacing.l,
    backgroundColor: tokens.color.white,
    color: tokens.color.ink,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.m,
    minHeight: tokens.size.listRow,
    paddingVertical: tokens.spacing.s,
    borderBottomWidth: tokens.border.hairline,
    borderBottomColor: withAlpha(tokens.color.ink, tokens.opacity.divider),
  },
  nota: { flexDirection: 'row', alignItems: 'flex-start', gap: tokens.spacing.s },
});
