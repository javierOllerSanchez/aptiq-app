import { tokens } from '@aptiq/tokens';
import { Image } from 'expo-image';

import sobrePapel from '../../../docs/marca/logo-aptiq.svg';
import sobreSubrayador from '../../../docs/marca/logo-aptiq-sobre-subrayador.svg';
import sobreTinta from '../../../docs/marca/logo-aptiq-sobre-tinta.svg';

// Archivos oficiales de docs/marca: el logotipo nunca se recrea con una fuente.
const sources = { paper: sobrePapel, ink: sobreTinta, highlighter: sobreSubrayador };

export function Logo({
  on = 'paper',
  width = tokens.size.logo,
}: {
  on?: keyof typeof sources;
  width?: number;
}) {
  const w = Math.max(width, tokens.size.logoMin);
  return (
    <Image
      source={sources[on]}
      style={{ width: w, aspectRatio: 2 }} // viewBox oficial 240 × 120
      contentFit="contain"
      accessible
      accessibilityRole="image"
      accessibilityLabel="Aptiq"
    />
  );
}
