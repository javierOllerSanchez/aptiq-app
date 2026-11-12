import { fontFamily } from '@aptiq/ui';
import { BricolageGrotesque_800ExtraBold } from '@expo-google-fonts/bricolage-grotesque/800ExtraBold';
import { IBMPlexMono_600SemiBold } from '@expo-google-fonts/ibm-plex-mono/600SemiBold';
import { InstrumentSans_400Regular } from '@expo-google-fonts/instrument-sans/400Regular';
import { InstrumentSans_600SemiBold } from '@expo-google-fonts/instrument-sans/600SemiBold';
import { InstrumentSans_700Bold } from '@expo-google-fonts/instrument-sans/700Bold';

// Solo los pesos que usa la guía. fonts.test.ts comprueba que cubren todo tokens.type.
export const fontAssets = {
  [fontFamily('ui', 400)]: InstrumentSans_400Regular,
  [fontFamily('ui', 600)]: InstrumentSans_600SemiBold,
  [fontFamily('ui', 700)]: InstrumentSans_700Bold,
  [fontFamily('mono', 600)]: IBMPlexMono_600SemiBold,
  [fontFamily('brand', 800)]: BricolageGrotesque_800ExtraBold,
};
