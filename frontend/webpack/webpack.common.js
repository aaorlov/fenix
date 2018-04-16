const EnvironmentPlugin = require('webpack/lib/EnvironmentPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const helpers = require('./helpers');

module.exports = options => ({
  context: helpers.root('src'),
  entry: ['babel-polyfill', './index.jsx'],
  resolve: {
    modules: [helpers.root('src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json', '.css']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        use: 'eslint-loader',
        exclude: /(node_modules)/,
        include: helpers.root('src')
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
        include: [
          helpers.root('../common/src'),
          helpers.root('src')
        ]
      },
      {
        test: /\.css$/,
        include: helpers.root('src'),
        exclude: /(node_modules)/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        })
      },
      {
        test: /\.(png|gif|jpe?g|svg|ttf|eot|otf|woff2)$/,
        use: 'url-loader?limit=10000&name=[path][name].[hash:base64:5].[ext]'
      }
    ]
  },
  plugins: [
    new EnvironmentPlugin(['NODE_ENV']),
    new HtmlWebpackPlugin({
      title: 'Fenix project',
      template: 'index.html',
      filename: 'index.html',
      favicon: helpers.root('favicon.ico'),
      minify: (options.env === 'production') && {
        caseSensitive: true,
        collapseWhitespace: true,
        keepClosingSlash: true
      }
    }),
    new ExtractTextPlugin({
      filename: 'static/styles.[chunkhash].css',
      publicPath: '/',
      allChunks: true,
      disable: options.env === 'development'
    })
  ]
});
