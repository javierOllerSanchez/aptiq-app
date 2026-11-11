import { render, screen } from '@testing-library/react-native';

import { Provisional } from './provisional';

test('la pantalla provisional muestra el logotipo y el claim', async () => {
  await render(<Provisional />);
  expect(screen.getByLabelText('Aptiq')).toBeOnTheScreen();
  expect(screen.getByRole('header', { name: 'Saca tu apto.' })).toBeOnTheScreen();
});
