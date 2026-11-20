import { tokens } from '@aptiq/tokens';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { AptitudeBar } from './aptitude-bar';
import { ListRow } from './list-row';

test('ListRow es un botón con nombre, valor y punto débil anunciados', async () => {
  const onPress = jest.fn();
  await render(
    <ListRow label="Verbal" value="58 %" valueLabel="58 % de acierto" weak onPress={onPress} />,
  );
  const row = screen.getByRole('button', { name: 'Verbal, 58 % de acierto, a reforzar' });
  expect(StyleSheet.flatten(screen.getByText('58 %').props.style).color).toBe(
    tokens.color.sealText,
  );
  // El punto débil no se indica solo con color (WCAG 1.4.1).
  expect(screen.getByText('Verbal · a reforzar')).toBeTruthy();
  fireEvent.press(row);
  expect(onPress).toHaveBeenCalledTimes(1);
});

test('ListRow con detalle y aviso propio los lee en orden', async () => {
  await render(
    <ListRow
      label="Simulacro"
      detail="14 nov · 55 min"
      value="12,50 / 30"
      valueLabel="12,50 sobre 30"
      weak
      weakLabel="no llega al mínimo"
      onPress={() => {}}
    />,
  );
  expect(
    screen.getByRole('button', { name: 'Simulacro, 14 nov · 55 min, 12,50 sobre 30, no llega al mínimo' }),
  ).toBeTruthy();
  expect(screen.getByText('14 nov · 55 min')).toBeTruthy();
  expect(screen.getByText('Simulacro · no llega al mínimo')).toBeTruthy();
});

test('ListRow sin valor no inventa un dato', async () => {
  await render(<ListRow label="Numérica" onPress={() => {}} />);
  expect(screen.getByRole('button', { name: 'Numérica' })).toBeTruthy();
});

test('AptitudeBar recorta el porcentaje a 0–100 y lo anuncia', async () => {
  await render(<AptitudeBar label="Numérica" percent={140} />);
  expect(screen.getByLabelText('Numérica: 100 % de acierto')).toBeTruthy();
  expect(screen.getByText('100 %')).toBeTruthy();
});

test('AptitudeBar marca la aptitud a reforzar', async () => {
  await render(<AptitudeBar label="Verbal" percent={58} weak />);
  expect(screen.getByLabelText('Verbal, a reforzar: 58 % de acierto')).toBeTruthy();
});

test('ListRow bloqueada muestra candado y «Premium» y lo anuncia (fase 7)', async () => {
  await render(<ListRow label="Abstracta" value="40 %" locked onPress={() => {}} />);
  expect(screen.getByRole('button', { name: 'Abstracta, incluido en Premium' })).toBeTruthy();
  expect(screen.getByText('Premium')).toBeTruthy();
  expect(screen.queryByText('40 %')).toBeNull();
});

test('ListRow externa se anuncia como enlace', async () => {
  const onPress = jest.fn();
  await render(<ListRow label="Política de privacidad" detail="Qué guardamos" external onPress={onPress} />);
  fireEvent.press(screen.getByRole('link', { name: 'Política de privacidad, Qué guardamos' }));
  expect(onPress).toHaveBeenCalledTimes(1);
});
