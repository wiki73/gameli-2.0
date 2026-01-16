export default {
  plugins: {
    'postcss-import': {
      inject: true,
      root: 'src',
      path: ['src/styles'],
    },
    'postcss-mixins': {},
    'postcss-nesting': {},
    'postcss-preset-env': {
      stage: 1,
    },
    autoprefixer: {},
  },
};
