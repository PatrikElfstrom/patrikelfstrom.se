module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  arrowParens: 'always',
  tailwindConfig: './tailwind.config.cjs',
  plugins: [require('prettier-plugin-astro'), require('prettier-plugin-tailwindcss')],
};
