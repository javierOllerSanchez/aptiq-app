/* global jest */
// Reanimated 4 no corre en Jest con jest-expo en este monorepo (su simulación oficial choca con el
// entorno nativo de jest-expo). ponytail: simulación mínima con solo lo que usan los componentes;
// ampliarla cuando un componente use otra función de Reanimated.
jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');
  const id = (x) => x;
  // Animaciones de entrada: cada método devuelve el mismo objeto para poder encadenarlos.
  const layout = new Proxy({}, { get: () => () => layout });
  return {
    __esModule: true,
    default: { View, Text, createAnimatedComponent: id },
    useSharedValue: (value) => ({ value, set(v) { this.value = v; } }),
    useAnimatedStyle: (fn) => fn(),
    useAnimatedProps: (fn) => fn(),
    withSpring: (v) => v,
    useReducedMotion: () => false,
    withTiming: id,
    withDelay: (_, v) => v,
    withSequence: (...v) => v[v.length - 1],
    withRepeat: id,
    Easing: { bezier: () => id, linear: id },
    ReduceMotion: { Never: 'never', System: 'system' },
    FadeIn: layout,
    FadeInDown: layout,
  };
});

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  const gesture = new Proxy({}, { get: () => () => gesture });
  return {
    Gesture: { Pan: () => gesture },
    GestureDetector: ({ children }) => children,
    GestureHandlerRootView: View,
  };
});

// Sonidos de recompensa (apps/mobile/src/sound): en Jest no suenan.
jest.mock(
  'expo-audio',
  () => ({
    createAudioPlayer: () => ({ seekTo: async () => {}, play: () => {} }),
    setAudioModeAsync: async () => {},
  }),
  { virtual: true },
);
