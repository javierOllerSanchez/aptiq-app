import { configDefaults, defineConfig } from 'vitest/config';

// `--mode muestras` solo ejecuta el exportador de muestras; `pnpm test` nunca lo ejecuta.
export default defineConfig(({ mode }) => ({
  test: {
    include: mode === 'muestras' ? ['scripts/muestras.ts'] : configDefaults.include,
  },
}));
