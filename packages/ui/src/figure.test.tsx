import { fireEvent, render, screen } from '@testing-library/react-native';

import { Figure } from './figure';
import { OptionBubble } from './option-bubble';

const drawing = {
  size: 2,
  shapes: [
    { d: 'M0 0L1 0L1 1L0 1Z', fill: 'ink' as const, stroke: 'paper' as const, width: 0.06 },
    { d: 'M1 1L2 1L2 2L1 2Z', fill: 'none' as const, stroke: 'ink' as const, width: 0.08 },
  ],
};

test('Figure es una imagen con su descripción para el lector de pantalla', async () => {
  await render(<Figure drawing={drawing} size={120} label="fila 1: cuadro 1; fila 2: cuadro 2" />);
  expect(screen.getByLabelText('fila 1: cuadro 1; fila 2: cuadro 2')).toBeTruthy();
});

test('una opción con figura anuncia la letra y la descripción, no el código interno', async () => {
  const onPress = jest.fn();
  await render(
    <OptionBubble
      letter="B"
      value="arriba círculo, delante cruz, a la derecha aspa"
      figure={<Figure drawing={drawing} size={80} />}
      state="marked"
      onPress={onPress}
    />,
  );
  const option = screen.getByRole('radio', {
    name: 'Opción B, arriba círculo, delante cruz, a la derecha aspa, seleccionada',
  });
  fireEvent.press(option);
  expect(onPress).toHaveBeenCalledTimes(1);
  // El texto no se pinta: la opción es el dibujo.
  expect(screen.queryByText('arriba círculo, delante cruz, a la derecha aspa')).toBeNull();
});
