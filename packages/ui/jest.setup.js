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
    Easing: { bezier: () => id },
    ReduceMotion: { Never: 'never' },
  };
});
