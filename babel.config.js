module.exports = (api) => {
  const isTest = api.env('test');
  api.cache(true);
  return {
    plugins: [
      [
        '@emotion',
        {
          sourceMap: true,
          autoLabel: 'dev-only',
          labelFormat: '[filename]--[local]',
          cssPropOptimization: true,
        },
      ],
    ],
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/react',
        {
          runtime: 'automatic',
        },
      ],
      [
        '@babel/env',
        {
          targets: {
            browsers: ['last 2 versions'],
          },
          modules: isTest ? 'commonjs' : false,
        },
      ],
    ],
  };
};
