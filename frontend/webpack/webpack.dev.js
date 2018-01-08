const webpackMerge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const helpers = require('./helpers');
const commonConfig = require('./webpack.common.js');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const PUBLIC = process.env.PUBLIC_DEV || `${HOST}:${PORT}`;
process.env.NODE_ENV = 'development';
process.env.ENV = 'development';

module.exports = webpackMerge(
  commonConfig({ env: process.env.NODE_ENV }),
  {
    devtool: 'inline-source-map',
    output: {
      path: helpers.root('dist'),
      publicPath: '/',
      filename: 'static/[name].[hash].bundle.js',
      chunkFilename: '[name].[chunkhash].chunk.js',
      library: '[name]',
      libraryTarget: 'var',
      sourceMapFilename: '[file].map'
    },
    devServer: {
      // contentBase: 'dist',
      port: PORT,
      host: HOST,
      public: PUBLIC,
      stats: {
        chunks: false,
        children: false
      },
      historyApiFallback: true
      // proxy: [
      //   {
      //     context: ['/api', '/login', '/logout'],
      //     target: 'http://localhost:8000'
      //   }
      // ]
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'disable'
      })
    ]
  }
);

