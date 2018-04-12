module.exports = ctx => ({
    plugins: {
        stylelint: {},
        'postcss-import': {},
        'postcss-cssnext': {},
        cssnano: ctx.env === 'production' ? ctx.options.cssnano : false
    }
});
