import nextConfig from 'eslint-config-next/core-web-vitals';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

const config = [
  ...nextConfig,
  { name: eslintConfigPrettier.name, rules: eslintConfigPrettier.rules },
  {
    ignores: [
      '.next/**',
      '.scannerwork/**',
      'out/**',
      'build/**',
      'coverage/**',
      'node_modules/**',
    ],
  },
  {
    files: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'jsx-a11y/alt-text': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
