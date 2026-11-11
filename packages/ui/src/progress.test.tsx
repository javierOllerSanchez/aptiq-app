import { render, screen } from '@testing-library/react-native';

import { LevelBubbles, ProgressTicks } from './progress';
import { Stamp } from './stamp';

test('ProgressTicks se anuncia como «Pregunta 12 de 40»', async () => {
  const answered = Array.from({ length: 40 }, (_, i) => i < 11);
  await render(<ProgressTicks total={40} current={11} answered={answered} />);
  const bar = screen.getByRole('progressbar', { name: 'Pregunta 12 de 40' });
  expect(bar.props.accessibilityValue).toEqual({ min: 1, max: 40, now: 12 });
});

test('LevelBubbles se anuncia como «Nivel 7 de 10»', async () => {
  await render(<LevelBubbles level={7} />);
  expect(screen.getByRole('progressbar', { name: 'Nivel 7 de 10' })).toBeOnTheScreen();
});

test('Stamp muestra «Apto» accesible', async () => {
  await render(<Stamp />);
  expect(screen.getByLabelText('Apto')).toBeOnTheScreen();
  expect(screen.getByText('Apto')).toBeOnTheScreen();
});
