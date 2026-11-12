import { Redirect } from 'expo-router';

import { Catalogo } from '@/screens/catalogo';

// Solo en desarrollo: en producción la ruta lleva a Inicio.
export default function CatalogoRoute() {
  if (!__DEV__) return <Redirect href="/" />;
  return <Catalogo />;
}
