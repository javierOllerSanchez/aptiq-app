import { fireEvent, render, screen } from '@testing-library/react-native';

import { CountUp } from './count-up';
import { IconButton } from './icon-button';
import { QuestionGrid } from './question-grid';
import { Sheet } from './sheet';
import { Text } from './text';
import { withSafeArea } from './test-utils';

test('Sheet solo se pinta abierta y se cierra tocando fuera', async () => {
  const onClose = jest.fn();
  const { rerender } = await render(
    withSafeArea(
      <Sheet visible={false} onClose={onClose} title="¿Entregar el simulacro?">
        <Text>Resumen</Text>
      </Sheet>,
    ),
  );
  expect(screen.queryByText('Resumen')).toBeNull();
  await rerender(
    withSafeArea(
      <Sheet visible onClose={onClose} title="¿Entregar el simulacro?">
        <Text>Resumen</Text>
      </Sheet>,
    ),
  );
  expect(screen.getByRole('header', { name: '¿Entregar el simulacro?' })).toBeTruthy();
  // En Jest el fondo se queda en su valor inicial (opacidad 0) porque la animación no corre.
  fireEvent.press(screen.getByRole('button', { name: 'Cerrar', includeHiddenElements: true }));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('QuestionGrid anuncia el estado de cada pregunta y salta a la elegida', async () => {
  const onSelect = jest.fn();
  await render(
    <QuestionGrid
      answered={[true, false, false]}
      marked={[false, true, false]}
      current={2}
      onSelect={onSelect}
    />,
  );
  expect(screen.getByRole('button', { name: 'Pregunta 1, respondida' })).toBeTruthy();
  fireEvent.press(
    screen.getByRole('button', { name: 'Pregunta 2, en blanco, marcada para revisar' }),
  );
  expect(onSelect).toHaveBeenCalledWith(1);
  expect(screen.getByRole('button', { name: 'Pregunta 3, en blanco, actual' })).toBeTruthy();
});

test('CountUp: el lector de pantalla oye solo el valor final', async () => {
  await render(<CountUp value={27} format={(n) => n.toFixed(1)} variant="scoreNumber" />);
  expect(screen.getByLabelText('27.0')).toBeTruthy();
});

test('IconButton exige etiqueta y anuncia si está activo', async () => {
  await render(<IconButton icon="flag" label="Marcar para revisar" onPress={() => {}} active />);
  expect(screen.getByRole('button', { name: 'Marcar para revisar', selected: true })).toBeTruthy();
});
