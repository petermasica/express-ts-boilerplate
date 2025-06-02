import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

import { noProcessEnvOutsideEnvTS } from './eslint-rules/no-process-env-outside-envts';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    ignores: ['**/*.config.{js,mjs,ts}', 'dist/**'],
  },
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'local-rules': {
        rules: {
          'no-process-env-outside-envts': noProcessEnvOutsideEnvTS,
        },
      },
    },
    rules: {
      'no-console': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'local-rules/no-process-env-outside-envts': 'error',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
);
