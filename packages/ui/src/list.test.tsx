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
  fireEvent.press(row);
  expect(onPress).toHaveBeenCalledTimes(1);
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
