const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('./paths');

module.exports = options => ({
  context: paths.src,
  entry: ['babel-polyfill', 'whatwg-fetch', './index.jsx'],
  mode: options.env,
  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json', '.css']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        use: 'eslint-loader',
        exclude: /(node_modules)/,
        include: paths.src
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
        include: paths.src
      },
      {
        test: /\.(png|gif|jpe?g|svg|ttf|eot|otf|woff2)$/,
        use: 'url-loader?limit=10000&name=[path][name].[hash:base64:5].[ext]'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Evico 2',
      template: 'index.html',
      filename: 'index.html',
      favicon: paths.root('favicon.ico'),
      minify: (options.env === 'production') && {
        caseSensitive: true,
        collapseWhitespace: true,
        keepClosingSlash: true
      }
    })
  ]
});
