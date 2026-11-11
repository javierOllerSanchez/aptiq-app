import { defineConfig, globalIgnores } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import tseslint from 'typescript-eslint';

const motorDeterminista = 'El motor debe ser determinista: usa createRng(seed) (ver skill aptiq-generator).';

export default defineConfig([
  globalIgnores([
    '**/node_modules/',
    '**/.expo/',
    '**/dist/',
    '**/expo-env.d.ts',
    '.claude/',
    'docs/',
    'scripts/',
  ]),
  { files: ['apps/mobile/**', 'packages/ui/**'], extends: [expoConfig] },
  {
    // ESLint se ejecuta desde la raíz: el alias «@/» se resuelve con el tsconfig de la app.
    files: ['apps/mobile/**'],
    settings: { 'import/resolver': { typescript: { project: 'apps/mobile/tsconfig.json' } } },
  },
  {
    files: ['packages/engine/**/*.ts', 'packages/tokens/**/*.ts'],
    extends: [tseslint.configs.recommended],
  },
  {
    files: ['packages/engine/**/*.ts'],
    rules: {
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: motorDeterminista },
        { object: 'Date', property: 'now', message: motorDeterminista },
      ],
      'no-restricted-syntax': [
        'error',
        { selector: "NewExpression[callee.name='Date']", message: motorDeterminista },
      ],
    },
  },
]);
