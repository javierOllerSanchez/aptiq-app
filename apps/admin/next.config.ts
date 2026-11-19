import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';

// El panel usa la misma URL y clave publicable que la app (públicas por diseño; la seguridad la da RLS).
// Se leen de la configuración de la app para no duplicarlas. Nunca se usa la clave de servicio.
const mobile = path.resolve(__dirname, '../mobile');
loadEnvConfig(mobile);
// Sin .env propio, los valores públicos versionados de la app (.env.example), solo estas dos claves.
const ejemplo = path.join(mobile, '.env.example');
if (existsSync(ejemplo))
  for (const linea of readFileSync(ejemplo, 'utf8').split(/\r?\n/)) {
    const m = linea.match(/^(EXPO_PUBLIC_SUPABASE_URL|EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY)=(.*)$/);
    if (m && !process.env[m[1]!]) process.env[m[1]!] = m[2]!.trim();
  }

const config: NextConfig = {
  transpilePackages: ['@aptiq/engine', '@aptiq/tokens'],
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
  },
};

export default config;
