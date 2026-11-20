import { Linking } from 'react-native';

/**
 * Páginas de la web de Aptiq (apps/web) y correo de soporte (SOP-03, NFR-08, PAY-01).
 * Se fijan al compilar con EAS: `EXPO_PUBLIC_WEB_URL` y `EXPO_PUBLIC_SOPORTE_EMAIL`.
 * shortcut: sin ellas las filas no se muestran (dominio aún pendiente); la compilación de tienda debe tenerlas (T9).
 */
export const PAGINAS = {
  ayuda: 'ayuda.html',
  privacidad: 'privacidad.html',
  terminos: 'terminos.html',
  avisoLegal: 'aviso-legal.html',
} as const;
export type Pagina = keyof typeof PAGINAS;

export function urlDe(p: Pagina): string | null {
  const web = process.env.EXPO_PUBLIC_WEB_URL?.replace(/\/+$/, '');
  return web ? `${web}/${PAGINAS[p]}` : null;
}

export function correoSoporte(): string | null {
  return process.env.EXPO_PUBLIC_SOPORTE_EMAIL || null;
}

export const abrir = (url: string) => Linking.openURL(url).catch(() => undefined);
