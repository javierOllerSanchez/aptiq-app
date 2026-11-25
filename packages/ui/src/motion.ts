import { tokens } from '@aptiq/tokens';
import { Easing, FadeIn, FadeInDown, ReduceMotion } from 'react-native-reanimated';

const { motion } = tokens;

/** Curva ease-out de la guía (sección 8). */
export const easeOut = Easing.bezier(...motion.easingCurve);

/**
 * Entrada de un bloque: fundido y 8 px hacia arriba, escalonado por `orden`.
 * Con «reducir movimiento», solo el fundido (la guía lo permite).
 */
export const entrada = (orden = 0, reduce = false) =>
  reduce
    ? FadeIn.duration(motion.durationBase)
        .delay(orden * motion.stagger)
        .reduceMotion(ReduceMotion.Never)
    : FadeInDown.duration(motion.durationSlow)
        .delay(orden * motion.stagger)
        .easing(easeOut)
        .withInitialValues({ opacity: 0, transform: [{ translateY: motion.enterOffset }] });
