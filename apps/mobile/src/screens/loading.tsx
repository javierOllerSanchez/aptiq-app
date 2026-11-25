import { PaperBackground, SkeletonScreen, Text } from '@aptiq/ui';

/**
 * Espera mientras una pantalla lee la base local: esqueletos de papel (guía §5).
 * Con `error`, el texto del problema en lugar de los esqueletos.
 */
export function Loading({ text = 'Cargando', error = false }: { text?: string; error?: boolean }) {
  return (
    <PaperBackground>
      {error ? (
        <Text color="graphite" accessibilityLiveRegion="polite">
          {text}
        </Text>
      ) : (
        <SkeletonScreen label={text} />
      )}
    </PaperBackground>
  );
}
