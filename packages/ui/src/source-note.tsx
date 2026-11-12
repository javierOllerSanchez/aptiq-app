import { tokens } from '@aptiq/tokens';
import { StyleSheet, View } from 'react-native';

import { Icon } from './icon';
import { Text } from './text';

/**
 * Cita de la fuente oficial del formato. Obligatoria en cada simulacro.
 * La cita llega del perfil de examen (fuente y apartado): este componente nunca inventa una fuente
 * ni afirma que existan exámenes publicados que no lo están.
 */
export function SourceNote({ cita }: { cita: string }) {
  return (
    <View style={styles.row} accessible>
      <Icon
        name="document"
        color="graphiteStrong"
        size={tokens.type.caption.size + tokens.spacing.xs}
      />
      <Text variant="caption" color="graphiteStrong" style={styles.text}>
        Formato según la convocatoria oficial: {cita}.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: tokens.spacing.s, alignItems: 'flex-start' },
  text: { flex: 1 },
});
