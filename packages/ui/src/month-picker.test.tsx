import { fireEvent, render, screen } from '@testing-library/react-native';

import { MonthPicker } from './month-picker';

test('MonthPicker no deja elegir meses pasados y ofrece «Aún no lo sé»', async () => {
  const onChange = jest.fn();
  await render(<MonthPicker value={null} onChange={onChange} hoy="2026-11" />);
  expect(screen.getByRole('radio', { name: 'octubre de 2026' })).toBeDisabled();
  await fireEvent.press(screen.getByRole('radio', { name: 'diciembre de 2026' }));
  expect(onChange).toHaveBeenLastCalledWith('2026-12');
  // Cambiar de año no elige un mes por su cuenta: solo cambia los meses que se ven.
  onChange.mockClear();
  await fireEvent.press(screen.getByRole('radio', { name: '2027' }));
  expect(onChange).not.toHaveBeenCalled();
  await fireEvent.press(screen.getByRole('radio', { name: 'enero de 2027' }));
  expect(onChange).toHaveBeenLastCalledWith('2027-01');
  expect(screen.getByRole('radio', { name: 'Aún no lo sé' })).toBeChecked();
});
