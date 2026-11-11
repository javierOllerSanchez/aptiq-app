import { tokens } from '@aptiq/tokens';
import { BricolageGrotesque_800ExtraBold } from '@expo-google-fonts/bricolage-grotesque/800ExtraBold';
import { IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono/600SemiBold';
import { InstrumentSans_400Regular } from '@expo-google-fonts/instrument-sans/400Regular';
import { InstrumentSans_600SemiBold } from '@expo-google-fonts/instrument-sans/600SemiBold';
import { InstrumentSans_700Bold } from '@expo-google-fonts/instrument-sans/700Bold';

type Font = keyof typeof tokens.font;

// En Android el peso no elige archivo: cada peso es una familia propia («InstrumentSans_700»).
export const fontFamily = (font: Font, weight: number) => `${tokens.font[font]}_${weight}`;

// Solo los pesos que usa la guía de estilos.
export const fontAssets = {
  [fontFamily('ui', 400)]: InstrumentSans_400Regular,
  [fontFamily('ui', 600)]: InstrumentSans_600SemiBold,
  [fontFamily('ui', 700)]: InstrumentSans_700Bold,
  [fontFamily('mono', 600)]: IBMPlexMono_600SemiBold,
  [fontFamily('brand', 800)]: BricolageGrotesque_800ExtraBold,
};
