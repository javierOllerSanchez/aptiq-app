import { fireEvent, render, screen } from '@testing-library/react-native';

import { MonthPicker } from './month-picker';

test('MonthPicker no deja elegir meses pasados y ofrece «Aún no lo sé»', async () => {
  const onChange = jest.fn();
  await render(<MonthPicker value={null} onChange={onChange} hoy="2026-11" />);
  expect(screen.getByRole('radio', { name: 'octubre de 2026' })).toBeDisabled();
  fireEvent.press(screen.getByRole('radio', { name: 'diciembre de 2026' }));
  expect(onChange).toHaveBeenLastCalledWith('2026-12');
  fireEvent.press(screen.getByRole('radio', { name: '2027' }));
  expect(onChange).toHaveBeenLastCalledWith('2027-01');
  expect(screen.getByRole('radio', { name: 'Aún no lo sé' })).toBeChecked();
});
