import {
  type Breakdown,
  HOY_PREGUNTAS,
  type Tally,
} from '@aptiq/engine';
import { perfil } from '@/content/content';
import { tokens } from '@aptiq/tokens';
import {
  Button,
  GlassCard,
  LevelBubbles,
  ListRow,
  PaperBackground,
  SourceNote,
  Text,
} from '@aptiq/ui';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useStore } from '@/data/provider';
import { APTITUDE_LABELS, avisoMezcla, cita, historyBreakdown } from '@/practice/run';
import { loadProgress, permiso, type Progress } from '@/progress/data';
import { tiposDe } from '@/purchases/muro';
import { usePlan } from '@/purchases/provider';
import { nivelTexto } from '@/screens/level-chart';
import { TabSpacer } from '@/screens/tab-spacer';

const formato = () => perfil().format;
const dato = (n: number | null, texto: string) =>
  n === null ? `${texto} pendiente de confirmar` : `${n} ${texto}`;
/** «81 %», o «—» si aún no hay respuestas de esa aptitud (no se inventa un dato). */
const acierto = (t?: Tally) =>
  t && t.total ? `${Math.round((t.correct / t.total) * 100)} %` : '—';
/** Lo que dice el lector de pantalla: «81 % de acierto» o «sin datos». */
const lectura = (t?: Tally) => (t && t.total ? `${acierto(t)} de acierto` : 'sin datos');

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
/** «2026-11-23» → «23 de noviembre». */
const diaYMes = (dia: string) => `${Number(dia.slice(8, 10))} de ${MESES[Number(dia.slice(5, 7)) - 1]}`;
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
      <Text variant="label" color="graphite">
        Guardia Civil
      </Text>
      <Text variant="screenTitle" accessibilityRole="header">
        Sesión de hoy
      </Text>
      <Text color="graphite">
        Simulacro con formato oficial: {dato(formato().preguntas, 'preguntas')} en {dato(formato().minutos, 'minutos')},{' '}
        {dato(formato().opciones, 'opciones')}
        {formato().opciones !== null ? `; ${formato().opciones! - 1} fallos restan 1 acierto.` : '.'}
      </Text>
      {progreso?.diasExamen != null && (
        <Text variant="bodyStrong">
          {progreso.diasExamen === 0
            ? 'El examen es hoy.'
            : `Faltan ${progreso.diasExamen} ${progreso.diasExamen === 1 ? 'día' : 'días'} para el examen.`}
        </Text>
      )}
      {hayTest && progreso !== null && (
        <GlassCard accessible={nivel !== null}>
          <View style={styles.cabeceraTarjeta}>
            <Text variant="label" color="graphiteStrong">
              Nivel estimado · orientativo
            </Text>
            {progreso !== null && progreso.racha > 0 && (
              <Text variant="formula" color="graphiteStrong">
                Racha · {progreso.racha} {progreso.racha === 1 ? 'día' : 'días'}
              </Text>
            )}
          </View>
          {nivel === null ? (
            <>
              <Text>Sin datos suficientes para estimar tu nivel.</Text>
              <Button
                label="Repetir el test de nivel"
                onPress={() => router.push('/onboarding')}
                variant="secondary"
              />
            </>
          ) : (
            <>
              <View
                style={styles.nivel}
                accessible
                accessibilityLabel={`Nivel ${nivelTexto(nivel.global)} de 5`}
              >
                <Text variant="bigNumber">{nivelTexto(nivel.global)}</Text>
                <Text variant="label" color="graphite">
                  de 5
                </Text>
              </View>
              <LevelBubbles level={Math.round(nivel.global)} max={5} />
              {plan.premium && Object.entries(nivel.porAptitud).map(([apt, n]) => (
                <Text key={apt} color="graphiteStrong">
                  {APTITUDE_LABELS[apt] ?? apt}: nivel {nivelTexto(n)}
                </Text>
              ))}
            </>
          )}
        </GlassCard>
      )}
      {a && !a.simulacro && !abierto ? (
        // Sin agrupar: dentro hay un botón al que debe llegar el lector de pantalla.
        <GlassCard accessible={false}>
          <Text variant="label" color="graphiteStrong">
            Simulacro de esta semana · hecho
          </Text>
          <Text color="graphiteStrong">
            El próximo simulacro gratuito está disponible el lunes {diaYMes(a.proximoSimulacro!)}.
          </Text>
          <Button label="Simulacros ilimitados con Premium" onPress={alMuro} variant="secondary" />
        </GlassCard>
      ) : (
        <Button
          label={abierto ? 'Continuar simulacro' : 'Empezar simulacro'}
          onPress={() => router.push('/simulacro')}
          variant="primary"
        />
      )}
      {avisoMezcla() && (
        <Text variant="caption" color="graphite">
          {avisoMezcla()}
        </Text>
      )}
      <SourceNote cita={cita()} />
      <View style={styles.cabeceraLista}>
        <Text variant="label" color="graphite" accessibilityRole="header">
          Práctica por aptitud
        </Text>
        <Text variant="label" color="graphite">
          Acierto
        </Text>
      </View>
      <View>
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
              value={historial ? acierto(t) : undefined}
              valueLabel={historial ? lectura(t) : undefined}
              weak={historial?.weakest === id}
              locked={bloqueada}
              onPress={() => (bloqueada ? alMuro() : router.push({ pathname: '/practica', params: { aptitud: id } }))}
            />
          );
        })}
      </View>
      <View style={styles.aviso}>
        <Text variant="caption" color="graphite">
          Las preguntas están en revisión: la dificultad y las explicaciones se validan con
          opositores en la beta. Aptiq es independiente de la Administración.
        </Text>
      </View>
      <TabSpacer />
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  cabeceraTarjeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    columnGap: tokens.spacing.m,
  },
  content: { gap: tokens.spacing.m },
  nivel: { flexDirection: 'row', alignItems: 'baseline', gap: tokens.spacing.s },
  aviso: { paddingTop: tokens.spacing.s },
  cabeceraLista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    columnGap: tokens.spacing.m,
    marginTop: tokens.spacing.m,
  },
});
