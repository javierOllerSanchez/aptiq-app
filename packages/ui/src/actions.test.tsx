import { tokens } from '@aptiq/tokens';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { Button } from './button';
import { OptionBubble } from './option-bubble';

test('Button principal: rol, etiqueta, subrayador y alto mínimo', async () => {
  const onPress = jest.fn();
  await render(<Button label="Empezar simulacro" onPress={onPress} />);
  const button = screen.getByRole('button', { name: 'Empezar simulacro' });
  fireEvent.press(button);
  expect(onPress).toHaveBeenCalledTimes(1);
  expect(StyleSheet.flatten(button.props.style).minHeight).toBeGreaterThanOrEqual(
    tokens.size.touchMin,
  );
});

test('Button desactivado no responde y lo anuncia', async () => {
  const onPress = jest.fn();
  await render(<Button label="Confirmar" onPress={onPress} disabled />);
  const button = screen.getByRole('button', { name: 'Confirmar' });
  fireEvent.press(button);
  expect(onPress).not.toHaveBeenCalled();
  expect(button).toBeDisabled();
});

test('OptionBubble se anuncia como en la guía', async () => {
  const onPress = jest.fn();
  await render(<OptionBubble letter="B" value="63" state="marked" onPress={onPress} />);
  const option = screen.getByRole('radio', { name: 'Opción B, 63, seleccionada' });
  fireEvent.press(option);
  expect(onPress).toHaveBeenCalledTimes(1);
});

test.each([
  ['correct', 'Opción A, 47, correcta'],
  ['wrong', 'Opción A, 47, incorrecta'],
] as const)('OptionBubble en estado %s', async (state, name) => {
  await render(<OptionBubble letter="A" value="47" state={state} />);
  expect(screen.getByRole('radio', { name })).toBeOnTheScreen();
});
