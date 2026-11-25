import { addDays, type Breakdown, HOY_PREGUNTAS, mondayOf, type Tally } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import {
  AptitudeTile,
  Burst,
  Button,
  CountUp,
  entrada,
  GlassCard,
  Logo,
  PaperBackground,
  ProgressRing,
  RewardToast,
  StreakChip,
  Text,
  WeekStrip,
  withAlpha,
} from '@aptiq/ui';
import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { useStore } from '@/data/provider';
import { APTITUDE_LABELS, aReforzar, historyBreakdown } from '@/practice/run';
import { loadProgress, permiso, type Progress } from '@/progress/data';
import { tiposDe } from '@/purchases/muro';
import { usePlan } from '@/purchases/provider';
import { formatoCorto, InfoFormato } from '@/screens/info-formato';
import { nivelTexto } from '@/screens/level-chart';
import { Loading } from '@/screens/loading';
import { TabSpacer } from '@/screens/tab-spacer';
import { sonar } from '@/sound/sound';

/** Día en que ya se celebró el objetivo de hoy: la recompensa sale una vez al día. */
export const AJUSTE_CELEBRADO = 'objetivo_celebrado';

/** «81 %», o null si aún no hay respuestas de esa aptitud (no se inventa un dato). */
const acierto = (t?: Tally) =>
  t && t.total ? `${Math.round((t.correct / t.total) * 100)} %` : null;

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];
const DIAS = [
  ['L', 'lunes'],
  ['M', 'martes'],
  ['X', 'miércoles'],
  ['J', 'jueves'],
  ['V', 'viernes'],
  ['S', 'sábado'],
  ['D', 'domingo'],
] as const;
/** «2026-11-23» → «23 de noviembre». */
const diaYMes = (dia: string) =>
  `${Number(dia.slice(8, 10))} de ${MESES[Number(dia.slice(5, 7)) - 1]}`;
const alMuro = () => router.push('/muro-pago');
const dias = (n: number) => `${n} ${n === 1 ? 'día' : 'días'}`;

const pares = <T,>(xs: T[]) =>
  Array.from({ length: Math.ceil(xs.length / 2) }, (_, i) => xs.slice(i * 2, i * 2 + 2));

/** Semana de lunes a domingo con los días practicados y el de hoy marcados. */
export function semanaDe(hoy: string, practicados: readonly string[]) {
  const lunes = mondayOf(hoy);
  const hechos = new Set(practicados);
  return DIAS.map(([letra, nombre], i) => {
    const dia = addDays(lunes, i);
    return { letra, nombre, hecho: hechos.has(dia), hoy: dia === hoy };
  });
}

/** Avance hacia el nivel entero siguiente: 2,8 → { siguiente: 3, falta: 0,2, fraccion: 0,8 }. */
export function haciaSiguiente(nivel: number) {
  if (nivel >= 5) return null;
  const siguiente = Math.floor(nivel) + 1;
  return { siguiente, falta: siguiente - nivel, fraccion: nivel - Math.floor(nivel) };
}

/**
 * Inicio v2 (prototipo `inicio-v2.html`, aprobado el 2026-11-25): objetivo de hoy con anillo y
 * semana, racha, nivel con barra al siguiente, simulacro y aptitudes en casillas. Al cumplir el
 * objetivo, una recompensa: anillo, burbujas, sonido, vibración y aviso (ENT-01, ENT-02, SIM-01).
 */
export function Inicio() {
  const store = useStore();
  const [abierto, setAbierto] = useState(false);
  const [historial, setHistorial] = useState<Breakdown | null>(null);
  const [progreso, setProgreso] = useState<Progress | null>(null);
  const [hayTest, setHayTest] = useState(false);
  const [fecha, setFecha] = useState<string | null>(null);
  const [celebra, setCelebra] = useState(0);
  const [aviso, setAviso] = useState(false);
  // Burbujas: salen cuando el anillo termina de llenarse, no al empezar.
  const [estallido, setEstallido] = useState(0);
  const nivel = progreso?.semanas[progreso.semanas.length - 1] ?? null;
  const { plan } = usePlan();
  const reduce = useReducedMotion();
  const a = progreso ? permiso(progreso, plan.premium) : null;

  // Al volver a Inicio se relee: una sesión o un simulacro pueden haber cambiado los datos.
  useFocusEffect(
    useCallback(() => {
      Promise.all([
        store.getSetting('niveles'),
        loadProgress(store),
        store.getSetting('fecha'),
        store.getSetting(AJUSTE_CELEBRADO),
      ]).then(async ([raw, p, f, celebrado]) => {
        setHayTest(raw !== null);
        setProgreso(p);
        setFecha(f);
        // Objetivo cumplido hoy y aún sin celebrar: recompensa (una vez al día).
        if (p.hoyRespondidas >= HOY_PREGUNTAS && celebrado !== p.hoy) {
          await store.setSetting(AJUSTE_CELEBRADO, p.hoy);
          setCelebra((n) => n + 1);
        }
      });
      store.attempts().then((list) => setAbierto(list.some((x) => x.finishedAt === null)));
      historyBreakdown(store).then(setHistorial);
    }, [store]),
  );

  // La recompensa llega cuando el anillo termina de llenarse.
  useEffect(() => {
    if (!celebra) return;
    const t = setTimeout(
      () => {
        void sonar(store, 'objetivo');
        setEstallido((n) => n + 1);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        setAviso(true);
      },
      reduce ? 0 : tokens.motion.countUp,
    );
    return () => clearTimeout(t);
  }, [celebra, reduce, store]);

  const hechas = Math.min(progreso?.hoyRespondidas ?? 0, HOY_PREGUNTAS);
  const cumplido = hechas >= HOY_PREGUNTAS;
  const semana = progreso ? semanaDe(progreso.hoy, progreso.diasPractica) : null;
  const hoyIdx = semana?.findIndex((d) => d.hoy) ?? -1;
  const reforzar = historial ? aReforzar(historial) : null;
  const avance = nivel ? haciaSiguiente(nivel.global) : null;

  const detalleHoy = !progreso
    ? ' '
    : progreso.hoyHecha
      ? plan.premium
        ? 'Hecha · puedes repetirla'
        : 'Hecha · vuelve mañana para seguir la racha'
      : plan.premium && progreso.due.length
        ? `${HOY_PREGUNTAS} preguntas · ${progreso.due.length} ${progreso.due.length === 1 ? 'tipo' : 'tipos'} de repaso`
        : `${HOY_PREGUNTAS} preguntas · empieza por lo más flojo`;
  const sesionBloqueada = a !== null && !a.sesionHoy;
  const ocultarAviso = useCallback(() => setAviso(false), []);

  // Hasta leer el progreso, esqueletos: nada de «0 de 12» ni «Haz el test» que luego cambian.
  if (!progreso) return <Loading text="Cargando inicio" />;

  return (
    <View style={styles.flex}>
      <PaperBackground scroll style={styles.content}>
        <Animated.View
          entering={entrada(0, reduce)}
          style={styles.cabecera}
          accessibilityRole="header"
          accessibilityLabel="Inicio"
        >
          <Logo />
          <View style={styles.cabeceraDerecha}>
            {progreso && progreso.racha > 0 && <StreakChip dias={progreso.racha} />}
            <InfoFormato />
          </View>
        </Animated.View>

        <Animated.View entering={entrada(1, reduce)}>
          <Text variant="label" color="graphite">
            Guardia Civil
            {progreso?.diasExamen != null && fecha
              ? ` · examen en ${MESES[Number(fecha.slice(5, 7)) - 1]} de ${fecha.slice(0, 4)}`
              : ''}
          </Text>
        </Animated.View>

        <Animated.View entering={entrada(2, reduce)}>
          {/* Sin agrupar: dentro hay un botón al que debe llegar el lector de pantalla. */}
          <GlassCard accessible={false} style={styles.tarjeta}>
            <View style={styles.hoy}>
              <View>
                <ProgressRing
                  value={hechas / HOY_PREGUNTAS}
                  label={`Objetivo de hoy: ${hechas} de ${HOY_PREGUNTAS} preguntas`}
                >
                  <CountUp
                    value={hechas}
                    format={(n) => String(Math.round(n))}
                    variant="questionTitle"
                  />
                  <Text variant="label" color="graphiteStrong">
                    de {HOY_PREGUNTAS}
                  </Text>
                </ProgressRing>
                <Burst disparo={estallido} />
              </View>
              <View style={styles.flex}>
                <Text variant="label" color="graphiteStrong">
                  {cumplido ? 'Objetivo cumplido' : 'Objetivo de hoy'}
                </Text>
                <Text variant="questionTitle">Sesión de hoy</Text>
                <Text variant="caption" color="graphiteStrong">
                  {detalleHoy}
                </Text>
              </View>
            </View>
            {sesionBloqueada ? (
              <Button label="Sesión ilimitada con Premium" onPress={alMuro} variant="secondary" />
            ) : (
              <Button
                label={progreso?.hoyHecha ? 'Otra sesión' : 'Empezar sesión de hoy'}
                onPress={() => router.push('/practica')}
                variant={progreso?.hoyHecha ? 'secondary' : 'primary'}
              />
            )}
            {semana && <WeekStrip dias={semana} marcar={celebra ? hoyIdx : null} />}
          </GlassCard>
        </Animated.View>

        <Animated.View entering={entrada(3, reduce)} style={styles.carta}>
          <View style={styles.fila}>
            <Text variant="label" color="graphite">
              Tu nivel · orientativo
            </Text>
            <Text variant="label" color="graphite">
              de 5
            </Text>
          </View>
          {hayTest && nivel ? (
            <>
              <View
                style={[styles.fila, styles.centrado]}
                accessible
                accessibilityLabel={`Nivel estimado ${nivelTexto(nivel.global)} de 5${avance ? `, te faltan ${nivelTexto(avance.falta)} para el nivel ${avance.siguiente}` : ''}`}
              >
                <CountUp value={nivel.global} format={nivelTexto} variant="bigNumber" />
                {avance && (
                  <Text variant="caption" color="graphiteStrong">
                    {nivelTexto(avance.falta)} para el nivel {avance.siguiente}
                  </Text>
                )}
              </View>
              <BarraNivel fraccion={avance ? avance.fraccion : 1} />
            </>
          ) : (
            <>
              <Text color="graphiteStrong">
                {hayTest
                  ? 'Aún no hay datos suficientes para estimar tu nivel.'
                  : 'Haz el test de nivel para saber desde dónde empiezas.'}
              </Text>
              <Button
                label={hayTest ? 'Repetir el test de nivel' : 'Hacer el test de nivel'}
                onPress={() => router.push('/onboarding')}
                variant="secondary"
              />
            </>
          )}
        </Animated.View>

        <Animated.View entering={entrada(4, reduce)} style={[styles.carta, styles.simulacro]}>
          <View style={styles.flex}>
            <Text variant="label" color="graphite">
              Simulacro oficial
            </Text>
            {a && !a.simulacro && !abierto ? (
              <Text variant="caption" color="graphiteStrong">
                Próximo gratuito el lunes {diaYMes(a.proximoSimulacro!)}
              </Text>
            ) : (
              <Text variant="bodyStrong">
                {formatoCorto().split(' · ').slice(0, 2).join(' · ')}
              </Text>
            )}
          </View>
          {a && !a.simulacro && !abierto ? (
            <Button label="Ver Premium" onPress={alMuro} variant="secondary" />
          ) : (
            <Button
              label={abierto ? 'Continuar' : 'Empezar'}
              onPress={() => router.push('/simulacro')}
              variant="secondary"
            />
          )}
        </Animated.View>

        <Animated.View entering={entrada(5, reduce)} style={styles.bloque}>
          <Text variant="label" color="graphite" accessibilityRole="header">
            Practica por aptitud
          </Text>
          {/* De dos en dos: la última casilla, si va sola, no se estira a todo el ancho. */}
          {pares(Object.entries(APTITUDE_LABELS)).map((fila) => (
            <View key={fila[0]![0]} style={styles.rejilla}>
              {fila.map(([id, label]) => {
                const bloqueada = a !== null && tiposDe(id, a.tipos).length === 0;
                const n = nivel?.porAptitud[id];
                const t = historial?.byAptitude[id];
                return (
                  <View key={id} style={styles.flex}>
                    <AptitudeTile
                      label={label}
                      acierto={acierto(t)}
                      fraccion={t && t.total ? t.correct / t.total : null}
                      nivel={plan.premium && n !== undefined ? Math.round(n) : null}
                      weak={reforzar === id}
                      locked={bloqueada}
                      onPress={() =>
                        bloqueada
                          ? alMuro()
                          : router.push({ pathname: '/practica', params: { aptitud: id } })
                      }
                    />
                  </View>
                );
              })}
              {fila.length === 1 && <View style={styles.flex} />}
            </View>
          ))}
        </Animated.View>
        <TabSpacer />
      </PaperBackground>
      <RewardToast
        visible={aviso}
        titulo="Objetivo de hoy cumplido"
        detalle={progreso && progreso.racha > 0 ? `Racha de ${dias(progreso.racha)}` : undefined}
        onHide={ocultarAviso}
      />
    </View>
  );
}

/** Barra hacia el nivel siguiente: crece al aparecer (250 ms, después de la cifra). */
function BarraNivel({ fraccion }: { fraccion: number }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withDelay(
      tokens.motion.durationBase,
      withTiming(fraccion * 100, { duration: tokens.motion.durationSlow }),
    );
  }, [fraccion, w]);
  const anim = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  return (
    <View
      style={styles.pista}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View style={[styles.relleno, anim]} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { gap: tokens.spacing.l },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: tokens.size.touchMin,
  },
  cabeceraDerecha: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.xs },
  tarjeta: { gap: tokens.spacing.l },
  hoy: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.l },
  carta: {
    gap: tokens.spacing.m,
    padding: tokens.spacing.xl,
    backgroundColor: tokens.color.paperCard,
    borderRadius: tokens.radius.card,
    borderWidth: tokens.border.hairline,
    borderColor: tokens.color.line,
  },
  fila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    columnGap: tokens.spacing.m,
  },
  centrado: { alignItems: 'center' },
  pista: {
    height: tokens.size.bar,
    borderRadius: tokens.radius.pill,
    backgroundColor: withAlpha(tokens.color.ink, tokens.opacity.barTrack),
    overflow: 'hidden',
  },
  relleno: { height: '100%', borderRadius: tokens.radius.pill, backgroundColor: tokens.color.ink },
  simulacro: { flexDirection: 'row', alignItems: 'center' },
  bloque: { gap: tokens.spacing.m, marginTop: tokens.spacing.s },
  rejilla: { flexDirection: 'row', gap: tokens.spacing.s },
});
