import { addDays, mondayOf } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import {
  ConsistencyCalendar,
  CountUp,
  type DiaCalendario,
  entrada,
  GlassCard,
  Icon,
  ListRow,
  MilestoneGrid,
  PaperBackground,
  PressScale,
  RewardToast,
  Stamp,
  Text,
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
import { fechaCorta, type HistoryRow, historyRows } from '@/history/rows';
import { APTITUDE_LABELS, formatNota } from '@/practice/run';
import { aptitudFloja, loadProgress, type Progress } from '@/progress/data';
import { AJUSTE_HITOS, type Hito, hitos as calcularHitos, hitosNuevos } from '@/progress/hitos';
import { usePlan } from '@/purchases/provider';
import { LevelChart, nivelTexto } from '@/screens/level-chart';
import { Loading } from '@/screens/loading';
import { TabSpacer } from '@/screens/tab-spacer';
import { sonar } from '@/sound/sound';

const SEMANAS_CALENDARIO = 5;

/** Cinco semanas de lunes a domingo hasta la actual, con los días practicados. */
export function calendario(hoy: string, practicados: readonly string[]): DiaCalendario[][] {
  const hechos = new Set(practicados);
  const primerLunes = addDays(mondayOf(hoy), -7 * (SEMANAS_CALENDARIO - 1));
  return Array.from({ length: SEMANAS_CALENDARIO }, (_, s) =>
    Array.from({ length: 7 }, (_, d) => {
      const dia = addDays(primerLunes, s * 7 + d);
      return { dia, hecho: hechos.has(dia), hoy: dia === hoy, futuro: dia > hoy };
    }),
  );
}

/**
 * Historial v2 (prototipo `historial-v2.html`, aprobado el 2026-11-25): cifras, nivel que se dibuja,
 * constancia, hitos con recompensa y simulacros como fichas frente a la nota mínima (PRO-01, PRO-02).
 */
export function Historial() {
  const store = useStore();
  const [rows, setRows] = useState<ReturnType<typeof historyRows> | null>(null);
  const [progreso, setProgreso] = useState<Progress | null>(null);
  const [nuevos, setNuevos] = useState<Hito[]>([]);
  const [aviso, setAviso] = useState(false);
  const [vistos, setVistos] = useState<string[]>([]);
  const { plan } = usePlan();
  const reduce = useReducedMotion();

  // Se relee al volver: puede haber llegado algo de otro dispositivo o un simulacro nuevo.
  useFocusEffect(
    useCallback(() => {
      Promise.all([
        store.sessions(),
        store.attempts(),
        loadProgress(store),
        store.getSetting(AJUSTE_HITOS),
      ]).then(async ([s, a, p, vistosRaw]) => {
        const r = historyRows(s, a);
        setRows(r);
        setProgreso(p);
        const antes = vistosRaw === null ? [] : (JSON.parse(vistosRaw) as string[]);
        const lista = hitosDe(r, p, antes);
        // Unión: un hito celebrado sigue conseguido y no se vuelve a celebrar.
        const todos = [
          ...new Set([...antes, ...lista.filter((h) => h.conseguido).map((h) => h.id)]),
        ];
        setVistos(todos);
        // Primera vez con hitos: se apuntan los que ya había sin celebrar (no una avalancha).
        if (vistosRaw === null) return store.setSetting(AJUSTE_HITOS, JSON.stringify(todos));
        const frescos = hitosNuevos(lista, antes);
        if (!frescos.length) return;
        await store.setSetting(AJUSTE_HITOS, JSON.stringify(todos));
        setNuevos(frescos);
      });
    }, [store]),
  );

  // Hito nuevo: el sello entra con rebote y llega la recompensa.
  useEffect(() => {
    if (!nuevos.length) return;
    const t = setTimeout(
      () => {
        void sonar(store, 'objetivo');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        setAviso(true);
      },
      reduce ? 0 : tokens.motion.spring,
    );
    return () => clearTimeout(t);
  }, [nuevos, reduce, store]);
  const ocultarAviso = useCallback(() => setAviso(false), []);

  if (!rows || !progreso) return <Loading />;
  const vacio = rows.simulacros.length === 0 && rows.practica.length === 0;
  // Plan gratuito: solo el último simulacro; el historial completo es de Premium (tabla «Monetización»).
  const simulacros = plan.premium ? rows.simulacros : rows.simulacros.slice(0, 1);
  const practica = plan.premium ? rows.practica : [];
  const oculto = rows.simulacros.length - simulacros.length + rows.practica.length;
  const lista = hitosDe(rows, progreso, vistos);
  const hechos = lista.filter((h) => h.conseguido).length;
  const dias = progreso.diasPractica.length;
  const cal = calendario(progreso.hoy, progreso.diasPractica);
  const enCalendario = cal.flat().filter((d) => d.hecho).length;

  return (
    <View style={styles.flex}>
      <PaperBackground scroll style={styles.content}>
        <Animated.View entering={entrada(0, reduce)}>
          <Text variant="screenTitle" accessibilityRole="header">
            Historial
          </Text>
          {vacio && (
            <Text color="graphite">
              Aquí aparecerán tus simulacros y sesiones cuando termines el primero.
            </Text>
          )}
        </Animated.View>

        <Animated.View entering={entrada(1, reduce)}>
          <GlassCard>
            <View style={styles.cifras}>
              <Cifra valor={progreso.racha} uno="día de racha" varios="días de racha" />
              <Cifra valor={dias} uno="día practicado" varios="días practicados" />
              <Cifra valor={progreso.totalRespondidas} uno="pregunta" varios="preguntas" />
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View entering={entrada(2, reduce)}>
          <TuNivel progreso={progreso} />
        </Animated.View>

        {/* Nivel por aptitud: Premium. Gratis, solo el global (tabla «Monetización»). */}
        {plan.premium && <PorAptitud progreso={progreso} />}

        <Animated.View entering={entrada(3, reduce)} style={styles.carta}>
          <Cabecera
            izquierda={`Constancia · ${SEMANAS_CALENDARIO} semanas`}
            derecha={`${enCalendario} ${enCalendario === 1 ? 'día' : 'días'}`}
          />
          <ConsistencyCalendar
            semanas={cal}
            resumen={`${enCalendario} ${enCalendario === 1 ? 'día' : 'días'} con práctica en las últimas ${SEMANAS_CALENDARIO} semanas`}
          />
        </Animated.View>

        <Animated.View entering={entrada(4, reduce)} style={styles.carta}>
          <Cabecera izquierda="Hitos" derecha={`${hechos} de ${lista.length}`} />
          <MilestoneGrid hitos={lista} nuevos={nuevos.map((h) => h.id)} />
        </Animated.View>

        {simulacros.length > 0 && (
          <Animated.View entering={entrada(5, reduce)} style={styles.bloque}>
            <Cabecera
              izquierda="Simulacros"
              derecha={`Nota / ${simulacros[0]!.nota?.maxima ?? ''}`}
            />
            {simulacros.map((r, i) => (
              <FichaSimulacro
                key={r.id}
                row={r}
                orden={i}
                onPress={() => router.push({ pathname: '/resultado', params: { id: r.id } })}
              />
            ))}
          </Animated.View>
        )}
        {oculto > 0 && (
          <PressScale
            onPress={() => router.push('/muro-pago')}
            accessibilityRole="button"
            accessibilityLabel={`Historial completo, ${oculto} ${oculto === 1 ? 'entrada más' : 'entradas más'}, incluido en Premium`}
            style={styles.bloqueada}
          >
            <Icon name="lock" />
            <View style={styles.flex}>
              <Text variant="bodyStrong">Historial completo</Text>
              <Text variant="caption" color="graphiteStrong">
                {oculto} {oculto === 1 ? 'entrada más' : 'entradas más'} con repaso de fallos ·
                Premium
              </Text>
            </View>
          </PressScale>
        )}
        {practica.length > 0 && (
          <View style={styles.bloque}>
            <Cabecera izquierda="Práctica" derecha="Aciertos" />
            <View>
              {practica.map((r) => (
                <ListRow
                  key={r.id}
                  label={r.label}
                  detail={r.detail}
                  value={r.value}
                  valueLabel={r.valueLabel}
                  onPress={() => router.push({ pathname: '/repasar', params: { sesion: r.id } })}
                />
              ))}
            </View>
          </View>
        )}
        <TabSpacer />
      </PaperBackground>
      <RewardToast
        visible={aviso}
        titulo={nuevos.length > 1 ? `${nuevos.length} hitos conseguidos` : 'Hito conseguido'}
        detalle={nuevos.map((h) => h.titulo).join(' · ')}
        onHide={ocultarAviso}
      />
    </View>
  );
}

function hitosDe(r: ReturnType<typeof historyRows>, p: Progress, vistos: readonly string[]) {
  const notas = r.simulacros.flatMap((s) => (s.nota ? [s.nota] : []));
  return calcularHitos({
    simulacros: r.simulacros.length,
    minimoAlcanzado: notas.some((n) => n.supera),
    mejorNota: notas.length ? Math.max(...notas.map((n) => n.puntos)) : null,
    notaMinima: notas[0]?.minima ?? null,
    diasPractica: p.diasPractica,
    totalRespondidas: p.totalRespondidas,
    mejorNivel: Math.max(0, ...p.semanas.flatMap((s) => Object.values(s.porAptitud))),
    vistos,
  });
}

function Cabecera({ izquierda, derecha }: { izquierda: string; derecha: string }) {
  return (
    <View style={styles.cabecera}>
      <Text variant="label" color="graphite" accessibilityRole="header">
        {izquierda}
      </Text>
      <Text variant="label" color="graphite">
        {derecha}
      </Text>
    </View>
  );
}

function Cifra({ valor, uno, varios }: { valor: number; uno: string; varios: string }) {
  const texto = valor === 1 ? uno : varios;
  return (
    <View style={styles.cifra} accessible accessibilityLabel={`${valor} ${texto}`}>
      <CountUp value={valor} format={(n) => String(Math.round(n))} variant="questionTitle" />
      <Text variant="label" color="graphiteStrong">
        {texto}
      </Text>
    </View>
  );
}

function TuNivel({ progreso }: { progreso: Progress }) {
  const { semanas } = progreso;
  const actual = semanas[semanas.length - 1];
  const primera = semanas[0];
  if (!actual || !primera) return null;
  const delta = actual.global - primera.global;
  const desde = fechaCorta(new Date(`${primera.semana}T12:00:00`).getTime());
  return (
    <View style={styles.carta}>
      <Cabecera izquierda={`Tu nivel · ${semanas.length} semanas`} derecha="De 5" />
      <View
        style={[styles.cabecera, styles.centrado]}
        accessible
        accessibilityLabel={`Nivel global ${nivelTexto(actual.global)} de 5${delta !== 0 ? `, ${delta > 0 ? 'sube' : 'baja'} ${nivelTexto(Math.abs(delta))} desde el ${desde}` : ''}`}
      >
        <CountUp value={actual.global} format={nivelTexto} variant="bigNumber" />
        {delta !== 0 && (
          <View style={[styles.delta, delta > 0 && styles.deltaSube]}>
            <Text variant="formula">
              {delta > 0 ? '+' : '−'}
              {nivelTexto(Math.abs(delta))} desde el {desde}
            </Text>
          </View>
        )}
      </View>
      <LevelChart semanas={semanas} />
    </View>
  );
}

function PorAptitud({ progreso }: { progreso: Progress }) {
  const actual = progreso.semanas[progreso.semanas.length - 1];
  if (!actual) return null;
  const flojo = aptitudFloja(actual.porAptitud);
  return (
    <View>
      {Object.entries(APTITUDE_LABELS)
        .filter(([id]) => actual.porAptitud[id] !== undefined)
        .map(([id, label]) => (
          <ListRow
            key={id}
            label={label}
            value={nivelTexto(actual.porAptitud[id]!)}
            valueLabel={`nivel ${nivelTexto(actual.porAptitud[id]!)} de 5`}
            weak={id === flojo}
            onPress={() => router.push({ pathname: '/practica', params: { aptitud: id } })}
          />
        ))}
    </View>
  );
}

/** Simulacro como ficha: nota grande y barra frente a la nota mínima, con el sello si llega. */
function FichaSimulacro({
  row,
  orden,
  onPress,
}: {
  row: HistoryRow;
  orden: number;
  onPress: () => void;
}) {
  const n = row.nota;
  const w = useSharedValue(0);
  const fraccion = n ? Math.max(0, Math.min(1, n.puntos / n.maxima)) : 0;
  useEffect(() => {
    w.value = withDelay(
      tokens.motion.durationBase + orden * tokens.motion.stagger,
      withTiming(fraccion * 100, { duration: tokens.motion.durationSlow }),
    );
  }, [fraccion, orden, w]);
  const anim = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  if (!n) return null;
  const minimo = `${(n.minima / n.maxima) * 100}%` as const;
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Simulacro del ${row.detail}, ${row.valueLabel}, ${n.supera ? 'apto' : 'no llega al mínimo'}. Ver resultado`}
      style={[styles.carta, styles.ficha]}
    >
      <View style={[styles.cabecera, styles.centrado]}>
        <View style={styles.nota}>
          <Text variant="screenTitle">{formatNota(n.puntos)}</Text>
          <Text variant="bodyStrong" color="graphite">
            / {n.maxima}
          </Text>
        </View>
        {n.supera ? (
          <View style={styles.selloPequeno}>
            <Stamp label="Apto" />
          </View>
        ) : (
          <Text variant="label" color="sealText">
            No llega al mínimo
          </Text>
        )}
      </View>
      <View style={styles.regla}>
        <Animated.View style={[styles.reglaRelleno, !n.supera && styles.reglaNo, anim]} />
        <View style={[styles.minimo, { left: minimo }]} />
      </View>
      <View style={styles.cabecera}>
        <Text variant="caption" color="graphiteStrong">
          {row.detail} · mín. {n.minima}
        </Text>
        <View style={styles.verResultado}>
          <Text variant="label">Ver resultado</Text>
          <Icon name="chevron" size={tokens.size.chevron} />
        </View>
      </View>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { gap: tokens.spacing.l },
  cifras: { flexDirection: 'row', gap: tokens.spacing.s },
  cifra: { flex: 1, gap: tokens.spacing.xs },
  carta: {
    gap: tokens.spacing.m,
    padding: tokens.spacing.xl,
    backgroundColor: tokens.color.paperCard,
    borderRadius: tokens.radius.card,
    borderWidth: tokens.border.hairline,
    borderColor: tokens.color.line,
  },
  bloque: { gap: tokens.spacing.m, marginTop: tokens.spacing.s },
  cabecera: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    columnGap: tokens.spacing.m,
  },
  centrado: { alignItems: 'center' },
  verResultado: { flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.xs },
  delta: {
    paddingHorizontal: tokens.spacing.m,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.pill,
    borderWidth: tokens.border.default,
    borderColor: tokens.color.ink,
  },
  deltaSube: { backgroundColor: tokens.color.highlighter },
  ficha: { gap: tokens.spacing.m },
  nota: { flexDirection: 'row', alignItems: 'baseline', gap: tokens.spacing.xs },
  selloPequeno: { transform: [{ scale: 0.6 }], marginVertical: -tokens.spacing.m },
  regla: {
    height: tokens.size.bar,
    borderRadius: tokens.radius.pill,
    backgroundColor: withAlpha(tokens.color.ink, tokens.opacity.barTrack),
  },
  reglaRelleno: {
    height: '100%',
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.color.ink,
  },
  reglaNo: { backgroundColor: tokens.color.seal },
  minimo: {
    position: 'absolute',
    top: -tokens.spacing.xs,
    bottom: -tokens.spacing.xs,
    width: tokens.border.selected,
    backgroundColor: tokens.color.ink,
  },
  bloqueada: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.m,
    padding: tokens.spacing.xl,
    borderRadius: tokens.radius.card,
    borderWidth: tokens.border.default,
    borderStyle: 'dashed',
    borderColor: withAlpha(tokens.color.ink, tokens.opacity.emptyBubbleBorder),
  },
});
