import { tokens } from '@aptiq/tokens';
import { render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { Logo } from './logo';
import { PaperBackground } from './paper-background';
import { Text } from './text';
import { withSafeArea } from './test-utils';

test('Text aplica la variante de la guía y el color', async () => {
  await render(
    <Text variant="label" color="graphite">
      Nivel
    </Text>,
  );
  const s = StyleSheet.flatten(screen.getByText('Nivel').props.style);
  expect(s).toMatchObject({
    fontFamily: 'IBMPlexMono_600',
    fontSize: tokens.type.label.size,
    textTransform: 'uppercase',
    color: tokens.color.graphite,
  });
});

test('Text permite subir el peso (opción marcada)', async () => {
  await render(
    <Text variant="optionValue" weight={700}>
      63
    </Text>,
  );
  expect(StyleSheet.flatten(screen.getByText('63').props.style).fontFamily).toBe(
    'InstrumentSans_700',
  );
});

test('Logo es una imagen accesible y respeta el ancho mínimo', async () => {
  await render(<Logo width={10} />);
  const logo = screen.getByRole('image', { name: 'Aptiq' });
  expect(StyleSheet.flatten(logo.props.style).width).toBe(tokens.size.logoMin);
});

test('PaperBackground pinta el papel y su contenido', async () => {
  await render(
    withSafeArea(
      <PaperBackground>
        <Text>Contenido</Text>
      </PaperBackground>,
    ),
  );
  expect(screen.getByText('Contenido')).toBeOnTheScreen();
});
