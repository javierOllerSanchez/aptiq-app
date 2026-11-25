import { type Breakdown, HOY_PREGUNTAS, type Tally } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import {
  Button,
  CountUp,
  entrada,
  GlassCard,
  LevelBubbles,
  ListRow,
  Logo,
  PaperBackground,
  Text,
} from '@aptiq/ui';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { useStore } from '@/data/provider';
import { APTITUDE_LABELS, historyBreakdown } from '@/practice/run';
import { loadProgress, permiso, type Progress } from '@/progress/data';
import { tiposDe } from '@/purchases/muro';
import { usePlan } from '@/purchases/provider';
import { nivelTexto } from '@/screens/level-chart';
import { formatoCorto, InfoFormato } from '@/screens/info-formato';
import { TabSpacer } from '@/screens/tab-spacer';

/** «81 %», o «—» si aún no hay respuestas de esa aptitud (no se inventa un dato). */
const acierto = (t?: Tally) =>
  t && t.total ? `${Math.round((t.correct / t.total) * 100)} %` : '—';
/** Lo que dice el lector de pantalla: «81 % de acierto» o «sin datos». */
const lectura = (t?: Tally) => (t && t.total ? `${acierto(t)} de acierto` : 'sin datos');

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
/** «2026-11-23» → «23 de noviembre». */
const diaYMes = (dia: string) =>
  `${Number(dia.slice(8, 10))} de ${MESES[Number(dia.slice(5, 7)) - 1]}`;
const alMuro = () => router.push('/muro-pago');

/** Inicio: nivel estimado, simulacro, sesión de hoy y práctica por aptitud (ENT-01, ENT-02, SIM-01, ONB-02). */
export function Inicio() {
  const store = useStore();
  const [abierto, setAbierto] = useState(false);
  const [historial, setHistorial] = useState<Breakdown | null>(null);
  const [progreso, setProgreso] = useState<Progress | null>(null);
  const [hayTest, setHayTest] = useState(false);
  // Mismo nivel que «Tu nivel» en Historial (ENT-03, PRO-01): semana actual, solo tipos con test.
  const nivel = progreso?.semanas[progreso.semanas.length - 1] ?? null;
  const { plan } = usePlan();
  const reduce = useReducedMotion();
  // Lo que permite el plan hoy (tabla «Monetización»); con Premium, todo.
  const a = progreso ? permiso(progreso, plan.premium) : null;

  // Al volver a Inicio se relee: el test o un simulacro pueden haber cambiado los datos.
  useFocusEffect(
    useCallback(() => {
      Promise.all([store.getSetting('niveles'), loadProgress(store)]).then(([raw, p]) => {
        setHayTest(raw !== null);
        setProgreso(p);
      });
      store.attempts().then((list) => setAbierto(list.some((a) => a.finishedAt === null)));
      historyBreakdown(store).then(setHistorial);
    }, [store]),
  );

  return (
    <PaperBackground scroll style={styles.content}>
      <Animated.View entering={entrada(0, reduce)} style={styles.cabecera}>
        <Logo />
        <View style={styles.cabeceraDerecha}>
          <View style={styles.oposicion} accessible accessibilityLabel="Oposición: Guardia Civil">
            <Text variant="bodyStrong">Guardia Civil</Text>
          </View>
          <InfoFormato />
        </View>
      </Animated.View>
      {progreso?.diasExamen != null && (
        <Animated.View entering={entrada(1, reduce)}>
          <Text variant="label" color="graphite">
            {progreso.diasExamen === 0
              ? 'El examen es hoy.'
              : `Faltan ${progreso.diasExamen} ${progreso.diasExamen === 1 ? 'día' : 'días'} para el examen.`}
          </Text>
        </Animated.View>
      )}
      <Animated.View entering={entrada(2, reduce)}>
        {/* Sin agrupar: dentro hay botones a los que debe llegar el lector de pantalla. */}
        <GlassCard accessible={false} style={styles.tarjeta}>
          <View style={styles.cabeceraTarjeta}>
            <Text variant="label" color="graphiteStrong">
              {hayTest ? 'Nivel estimado' : 'Simulacro oficial'}
            </Text>
            {progreso !== null && progreso.racha > 0 && (
              <Text variant="label" color="graphiteStrong">
                Racha · {progreso.racha} {progreso.racha === 1 ? 'día' : 'días'}
              </Text>
            )}
          </View>
          {hayTest && progreso !== null && nivel !== null && (
            <View style={styles.bloqueNivel}>
              <View
                style={styles.nivel}
                accessible
                accessibilityLabel={`Nivel estimado ${nivelTexto(nivel.global)} de 5, orientativo`}
              >
                <CountUp value={nivel.global} format={nivelTexto} variant="bigNumber" />
                <Text variant="label" color="graphite">
                  de 5
                </Text>
              </View>
              <LevelBubbles level={Math.round(nivel.global)} max={5} />
              {plan.premium && (
                <Text variant="caption" color="graphiteStrong">
                  {Object.entries(nivel.porAptitud)
                    .map(([apt, n]) => `${APTITUDE_LABELS[apt] ?? apt} ${nivelTexto(n)}`)
                    .join(' · ')}
                </Text>
              )}
            </View>
          )}
          {hayTest && progreso !== null && nivel === null && (
            <Text color="graphiteStrong">Aún no hay datos suficientes para estimar tu nivel.</Text>
          )}
          <Text variant="formula" color="graphiteStrong">
            {formatoCorto()}
          </Text>
          {a && !a.simulacro && !abierto ? (
            <View style={styles.agotado}>
              <Text color="graphiteStrong">
                El próximo simulacro gratuito está disponible el lunes{' '}
                {diaYMes(a.proximoSimulacro!)}.
              </Text>
              <Button label="Ver Premium" onPress={alMuro} variant="secondary" />
            </View>
          ) : (
            <Button
              label={abierto ? 'Continuar simulacro' : 'Empezar simulacro'}
              onPress={() => router.push('/simulacro')}
              variant="primary"
            />
          )}
          {!hayTest && (
            <Button
              label="Hacer el test de nivel"
              onPress={() => router.push('/onboarding')}
              variant="text"
            />
          )}
        </GlassCard>
      </Animated.View>
      <Animated.View entering={entrada(3, reduce)}>
        <View style={styles.cabeceraLista}>
          <Text variant="label" color="graphite" accessibilityRole="header">
            Práctica
          </Text>
          <Text variant="label" color="graphite">
            Acierto
          </Text>
        </View>
        <ListRow
          label="Sesión de hoy"
          detail={
            progreso === null
              ? undefined
              : progreso.hoyHecha
                ? plan.premium
                  ? 'Hecha · puedes repetirla'
                  : 'Hecha · vuelve mañana'
                : plan.premium && progreso.due.length
                  ? `${HOY_PREGUNTAS} preguntas · ${progreso.due.length} ${progreso.due.length === 1 ? 'tipo' : 'tipos'} de repaso`
                  : `${HOY_PREGUNTAS} preguntas · prioriza lo más flojo`
          }
          locked={a !== null && !a.sesionHoy}
          lockedLabel="ilimitada con Premium"
          onPress={() => (a && !a.sesionHoy ? alMuro() : router.push('/practica'))}
        />
        {Object.entries(APTITUDE_LABELS).map(([id, label]) => {
          const t = historial?.byAptitude[id];
          const bloqueada = a !== null && tiposDe(id, a.tipos).length === 0;
          return (
            <ListRow
              key={id}
              label={label}
              detail={historial && !t?.total && !bloqueada ? 'Sin empezar' : undefined}
              value={historial ? acierto(t) : undefined}
              valueLabel={historial ? lectura(t) : undefined}
              weak={historial?.weakest === id}
              locked={bloqueada}
              onPress={() =>
                bloqueada
                  ? alMuro()
                  : router.push({ pathname: '/practica', params: { aptitud: id } })
              }
            />
          );
        })}
      </Animated.View>
      <TabSpacer />
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.l },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: tokens.size.touchMin,
  },
  cabeceraDerecha: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.xs },
  oposicion: {
    minHeight: tokens.size.touchMin,
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.m,
    borderRadius: tokens.radius.pill,
    borderWidth: tokens.border.default,
    borderColor: tokens.color.ink,
  },
  tarjeta: { gap: tokens.spacing.l },
  cabeceraTarjeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    columnGap: tokens.spacing.m,
  },
  bloqueNivel: { gap: tokens.spacing.m },
  nivel: { flexDirection: 'row', alignItems: 'baseline', gap: tokens.spacing.s },
  agotado: { gap: tokens.spacing.m },
  cabeceraLista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    columnGap: tokens.spacing.m,
    marginTop: tokens.spacing.s,
  },
});
