module.exports = ctx => ({
  plugins: {
    stylelint: {},
    'postcss-import': {},
    'postcss-cssnext': {},
    cssnano: ctx.env === 'production' ? {
      zindex: false,
      autoprefixer: false
    } : false
  }
});
