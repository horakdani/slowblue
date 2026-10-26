import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  // `ios` is here for one reason worth knowing: `npx cap sync ios` copies the built
  // web bundle into ios/App/App/public, and eslint does not read .gitignore - so the
  // first sync turned the minified bundle into 1100 lint errors and took the gate
  // down with it. Nothing under ios/ is ours to lint; the Swift is Xcode's business.
  { ignores: ['dist', 'ios', 'node_modules', 'playwright-report', 'test-results', 'coverage'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      // A leading underscore is how this codebase says "this argument is part of
      // the signature and deliberately unused" - `resolveLang(_setting)` keeps
      // its parameter because every caller passes one and the function is one
      // language away from needing it again. TypeScript already reads the
      // underscore that way (`noUnusedParameters`); the linter did not, and the
      // disagreement was a red `npm run verify` nobody could fix without either
      // breaking a call site or deleting the intent.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
    },
  },
  {
    // The playability probe exists to print measurements.
    files: ['tests/**/*.ts', 'e2e/**/*.ts', 'tools/**/*.ts'],
    rules: { 'no-console': 'off' },
  },
);
