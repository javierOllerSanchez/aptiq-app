import { tokens } from '@aptiq/tokens';
import { View } from 'react-native';

/** Hueco al final (PaperBackground ya suma el área segura y un margen) de las pantallas con pestañas para que la barra flotante no tape el contenido. */
export function TabSpacer() {
  return <View style={{ height: tokens.size.tabBar }} />;
}
