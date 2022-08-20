module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unicorn', 'react', 'jsx-a11y'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:unicorn/recommended',
    'plugin:jsx-a11y/strict',
    'plugin:astro/recommended',
    'plugin:astro/jsx-a11y-strict',
    'prettier',
  ],
  overrides: [
    {
      files: ['*.tsx'],
      extends: ['plugin:react/recommended', 'plugin:react/jsx-runtime'],
    },
    {
      files: ['*.astro'],
      plugins: ['astro'],
      env: {
        node: true,
        'astro/astro': true,
        es2020: true,
      },

      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
        sourceType: 'module',
      },
      rules: {},
    },
  ],
  rules: {
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    'unicorn/filename-case': 'off',
  },
  settings: {
    react: { version: 'detect' },
  },
};
