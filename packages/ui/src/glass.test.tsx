import { fireEvent, render, screen } from '@testing-library/react-native';

import { GlassCard } from './glass-card';
import { SourceNote } from './source-note';
import { TabBar } from './tab-bar';
import { Text } from './text';

test('TabBar: cuatro pestañas con nombre y la activa marcada', async () => {
  const onSelect = jest.fn();
  await render(<TabBar active="home" onSelect={onSelect} />);
  for (const name of ['Inicio', 'Tests', 'Estadísticas', 'Perfil']) {
    expect(screen.getByRole('tab', { name })).toBeOnTheScreen();
  }
  expect(screen.getByRole('tab', { name: 'Inicio' })).toBeSelected();
  fireEvent.press(screen.getByRole('tab', { name: 'Perfil' }));
  expect(onSelect).toHaveBeenCalledWith('profile');
});

test('GlassCard muestra su contenido', async () => {
  await render(
    <GlassCard>
      <Text>Nivel estimado</Text>
    </GlassCard>,
  );
  expect(screen.getByText('Nivel estimado')).toBeOnTheScreen();
});

test('SourceNote cita solo la fuente que se le pasa (principio 4: nada de «exámenes publicados»)', async () => {
  await render(<SourceNote cita="BOE-A-2026-9982, bases 6.1.2.a, 7.3 y 7.8" />);
  expect(
    screen.getByText(
      'Formato según la convocatoria oficial: BOE-A-2026-9982, bases 6.1.2.a, 7.3 y 7.8.',
    ),
  ).toBeOnTheScreen();
});
