// eslint-disable-next-line func-names
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo',
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'entry',
          corejs: '3.22',
        },
      ],
    ],
    plugins: [
      ['@babel/plugin-transform-private-property-in-object', { loose: true }],
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['module-resolver', {
        alias: {
          src: './src',
        },
      }],
    ],
  };
};
