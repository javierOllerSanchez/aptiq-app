import { tokens } from '@aptiq/tokens';
import { StyleSheet, View } from 'react-native';

import { Icon } from './icon';
import { Text } from './text';

/**
 * Cita de la fuente oficial del formato. Obligatoria en cada simulacro.
 * El organismo llega del perfil de examen: este componente nunca inventa una fuente.
 */
export function SourceNote({ organismo }: { organismo: string }) {
  return (
    <View style={styles.row} accessible>
      <Icon
        name="document"
        color="graphiteStrong"
        size={tokens.type.caption.size + tokens.spacing.xs}
      />
      <Text variant="caption" color="graphiteStrong" style={styles.text}>
        Estructura basada en las bases del BOE y en los exámenes publicados por {organismo}.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: tokens.spacing.s, alignItems: 'flex-start' },
  text: { flex: 1 },
});
