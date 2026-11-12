/* global jest */
// Reanimated 4 no corre en Jest con jest-expo en este monorepo (su simulación oficial choca con el
// entorno nativo de jest-expo). ponytail: simulación mínima con solo lo que usan los componentes;
// ampliarla cuando un componente use otra función de Reanimated.
jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');
  const id = (x) => x;
  return {
    __esModule: true,
    default: { View, Text },
    useSharedValue: (value) => ({ value }),
    useAnimatedStyle: (fn) => fn(),
    useReducedMotion: () => false,
    withTiming: id,
    withDelay: (_ms, v) => v,
    withSequence: (...v) => v[v.length - 1],
    Easing: { out: id, in: id, quad: id, cubic: id, bezier: () => id },
    ReduceMotion: { System: 'system', Always: 'always', Never: 'never' },
  };
});
