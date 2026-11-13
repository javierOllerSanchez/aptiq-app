import { PaperBackground, Text } from '@aptiq/ui';

/** Estado de espera o de error mientras una pantalla lee la base local. */
export function Loading({ text = 'Cargando…' }: { text?: string }) {
  return (
    <PaperBackground>
      <Text color="graphite" accessibilityLiveRegion="polite">
        {text}
      </Text>
    </PaperBackground>
  );
}
