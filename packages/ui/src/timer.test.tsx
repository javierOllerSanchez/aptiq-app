import { render, screen } from '@testing-library/react-native';

import { OptionBubble } from './option-bubble';
import { Timer } from './timer';

test('Timer muestra mm:ss y se anuncia por minutos, no por segundos', async () => {
  await render(<Timer remainingMs={(54 * 60 + 57) * 1000} />);
  expect(screen.getByText('54:57')).toBeOnTheScreen();
  expect(screen.getByLabelText('Quedan 55 minutos')).toBeOnTheScreen();
});

test('Timer en el último minuto usa el singular y no baja de 00:00', async () => {
  await render(<Timer remainingMs={0} />);
  expect(screen.getByText('00:00')).toBeOnTheScreen();
  expect(screen.getByLabelText('Tiempo agotado')).toBeOnTheScreen();
});

test('OptionBubble marcada informa checked a TalkBack y VoiceOver', async () => {
  await render(<OptionBubble letter="B" value="63" state="marked" onPress={() => {}} />);
  expect(screen.getByRole('radio')).toBeChecked();
});
