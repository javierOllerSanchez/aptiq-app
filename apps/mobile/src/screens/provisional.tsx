import { tokens } from '@aptiq/tokens';
import { Button, Logo, PaperBackground, Text } from '@aptiq/ui';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

// Pantalla provisional hasta la fase 4 (Inicio real).
export function Provisional() {
  return (
    <PaperBackground>
      <View style={styles.content}>
        <Logo />
        <Text variant="label" color="graphite">
          Fase 1 · Sistema de diseño
        </Text>
        <Text variant="screenTitle" accessibilityRole="header">
          Saca tu apto.
        </Text>
        <Text>Pantalla provisional. Las pantallas reales llegan en la fase 4.</Text>
        {__DEV__ && (
          <Button label="Ver catálogo" variant="secondary" onPress={() => router.push('/catalogo')} />
        )}
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  content: { gap: tokens.spacing.l },
});
