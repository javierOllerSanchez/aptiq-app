import { tokens } from '@aptiq/tokens';
import { Icon, type IconName, IconTile, ListRow, Text, withAlpha } from '@aptiq/ui';
import Constants from 'expo-constants';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { permisoAnalitica, setPermisoAnalitica } from '@/analytics/analytics';
import { useStore } from '@/data/provider';
import { abrir, correoSoporte, urlDe, type Pagina } from '@/legal';

/**
 * Ayuda y legal, al final de Cuenta con y sin sesión (SOP-03, NFR-05, NFR-08).
 * Prototipo aprobado: docs/prototipos/ayuda.html.
 */
export function AyudaLegal() {
  const store = useStore();
  const [datos, setDatos] = useState(false);

  useFocusEffect(
    useCallback(() => {
      permisoAnalitica(store).then((p) => setDatos(p === true));
    }, [store]),
  );

  const cambiar = async (si: boolean) => {
    setDatos(si);
    await setPermisoAnalitica(store, si);
  };

  const pagina = (p: Pagina, label: string, detail: string, icon: IconName) => {
    const url = urlDe(p);
    return (
      url && (
        <ListRow icon={icon} label={label} detail={detail} external onPress={() => abrir(url)} />
      )
    );
  };
  const correo = correoSoporte();

  // Filas para el grupo «Ayuda y privacidad» de Cuenta (la cabecera la pone Cuenta).
  return (
    <View>
      {pagina('ayuda', 'Preguntas frecuentes', 'Cuentas, pagos, sin conexión', 'help')}
      {correo && (
        <ListRow
          icon="mail"
          label="Escribir a soporte"
          detail={correo}
          onPress={() => abrir(`mailto:${correo}?subject=${encodeURIComponent('Aptiq')}`)}
        />
      )}
      <View style={styles.fila}>
        <IconTile name="eye" />
        <View style={styles.flex}>
          <Text variant="bodyStrong">Compartir datos de uso</Text>
          <Text variant="caption" color="graphite">
            Anónimos. Ayudan a mejorar la app
          </Text>
        </View>
        <Switch
          value={datos}
          onValueChange={cambiar}
          accessibilityLabel="Compartir datos de uso"
          trackColor={{
            false: withAlpha(tokens.color.ink, tokens.opacity.pendingTick),
            true: tokens.color.ink,
          }}
          thumbColor={datos ? tokens.color.highlighter : tokens.color.paperCard}
          ios_backgroundColor={withAlpha(tokens.color.ink, tokens.opacity.pendingTick)}
        />
      </View>
      {pagina(
        'privacidad',
        'Política de privacidad',
        'Qué guardamos, dónde y tus derechos',
        'document',
      )}
      {pagina('terminos', 'Términos de uso', 'Suscripción, prueba y pases', 'document')}
      {pagina('avisoLegal', 'Aviso legal', 'Titular y propiedad del contenido', 'document')}
    </View>
  );
}

/** Pie de Cuenta: aviso de independencia (NFR-08) y versión. */
export function PieLegal() {
  return (
    <View style={styles.pie}>
      <View style={styles.nota}>
        <Icon name="document" color="graphite" size={tokens.size.chevron} />
        <Text variant="caption" color="graphiteStrong" style={styles.flex}>
          Aptiq es independiente de la Administración y de la Guardia Civil. Las preguntas son
          originales.
        </Text>
      </View>
      <Text variant="formula" color="graphiteStrong">
        VERSIÓN {Constants.expoConfig?.version ?? '—'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pie: { gap: tokens.spacing.s, marginTop: tokens.spacing.s },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.m,
    minHeight: tokens.size.listRow,
    borderBottomWidth: tokens.border.hairline,
    borderBottomColor: withAlpha(tokens.color.ink, tokens.opacity.divider),
    paddingVertical: tokens.spacing.s,
  },
  flex: { flex: 1 },
  nota: {
    flexDirection: 'row',
    gap: tokens.spacing.s,
    alignItems: 'flex-start',
    marginTop: tokens.spacing.l,
  },
});
