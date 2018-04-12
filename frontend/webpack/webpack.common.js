const EnvironmentPlugin = require('webpack/lib/EnvironmentPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const helpers = require('./helpers');

module.exports = options => ({
  context: helpers.root('src'),
  entry: {
    app: './index.jsx'
  },
  resolve: {
    modules: [
      helpers.root('src'),
      helpers.root('node_modules')
    ],
    extensions: ['.js', '.jsx', '.json', '.css']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        use: 'eslint-loader',
        exclude: helpers.root('node_modules'),
        include: helpers.root('src')
      },
      {
        test: /\.jsx?$/,
        exclude: helpers.root('node_modules', 'bower_components'),
        use: 'babel-loader',
        include: [
          helpers.root('../common/src'),
          helpers.root('src'),
          helpers.root('test')
        ]
      },
      {
        test: /\.s?css$/,
        include: helpers.root('src'),
        exclude: helpers.root('node_modules'),
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
              loader: 'postcss-loader',
              options: {
                config: {
                  ctx: {
                    env: options.env
                  }
                }
              }
            },
            {
              loader: 'sass-loader'
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
    new CommonsChunkPlugin({
      name: 'polyfills',
      chunks: ['polyfills']
    }),
    new CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
    }),
    new HtmlWebpackPlugin({
      title: 'Fenix project',
      template: 'index.html',
      filename: 'index.html',
      inject: 'body',
      chunksSortMode: (a, b) => {
        const entryPoints = ['polyfills', 'vendor', 'main'];
        return entryPoints.indexOf(a.names[0]) - entryPoints.indexOf(b.names[0]);
      },
      minify: (options.env === 'production') ? {
        caseSensitive: true,
        collapseWhitespace: true,
        keepClosingSlash: true
      } : false
    }),
    new ExtractTextPlugin({
      filename: 'static/styles.[chunkhash].css',
      publicPath: '/',
      allChunks: true,
      disable: (options.env === 'development') || (options.env === 'test')
    })
  ]
});
