import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Provisional } from './provisional';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 59, left: 0, right: 0, bottom: 34 },
};

test('la pantalla provisional muestra el logotipo y el claim', async () => {
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <Provisional />
    </SafeAreaProvider>,
  );
  expect(screen.getByRole('image', { name: 'Aptiq' })).toBeOnTheScreen();
  expect(screen.getByRole('header', { name: 'Saca tu apto.' })).toBeOnTheScreen();
});
