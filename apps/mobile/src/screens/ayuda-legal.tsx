import { tokens } from '@aptiq/tokens';
import { Icon, ListRow, Text, withAlpha } from '@aptiq/ui';
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

  const pagina = (p: Pagina, label: string, detail: string) => {
    const url = urlDe(p);
    return url && <ListRow label={label} detail={detail} external onPress={() => abrir(url)} />;
  };
  const correo = correoSoporte();

  return (
    <View style={styles.bloque}>
      {/* Sin web ni correo configurados no queda nada que enseñar: sin cabecera vacía. */}
      {(urlDe('ayuda') || correo) && (
        <>
          <Text variant="label" color="graphite" accessibilityRole="header" style={styles.seccion}>
            Ayuda
          </Text>
          <View>
            {pagina('ayuda', 'Preguntas frecuentes', 'Cuentas, pagos, sin conexión')}
            {correo && (
              <ListRow
                label="Escribir a soporte"
                detail={correo}
                onPress={() => abrir(`mailto:${correo}?subject=${encodeURIComponent('Aptiq')}`)}
              />
            )}
          </View>
        </>
      )}

      <Text variant="label" color="graphite" accessibilityRole="header" style={styles.seccion}>
        Privacidad
      </Text>
      <View>
        <View style={styles.fila}>
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
        {pagina('privacidad', 'Política de privacidad', 'Qué guardamos, dónde y tus derechos')}
      </View>

      {urlDe('terminos') && (
        <>
          <Text variant="label" color="graphite" accessibilityRole="header" style={styles.seccion}>
            Legal
          </Text>
          <View>
            {pagina('terminos', 'Términos de uso', 'Suscripción, prueba y pases')}
            {pagina('avisoLegal', 'Aviso legal', 'Titular y propiedad del contenido')}
          </View>
        </>
      )}

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
  bloque: { gap: tokens.spacing.s, marginTop: tokens.spacing.m },
  seccion: { marginTop: tokens.spacing.l },
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
