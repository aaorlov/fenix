const webpackMerge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const helpers = require('./helpers');
const commonConfig = require('./webpack.common.js');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3002;
const PUBLIC = process.env.PUBLIC_DEV || `${HOST}:${PORT}`;
process.env.NODE_ENV = 'development';
process.env.ENV = 'development';

module.exports = webpackMerge(
  commonConfig({ env: process.env.NODE_ENV }),
  {
    devtool: 'source-map',
    output: {
      path: helpers.root('dist'),
      publicPath: '/',
      filename: 'static/bundle.[name].[hash].js',
      chunkFilename: '[name].[chunkhash].chunk.js',
      library: '[name]',
      sourceMapFilename: '[file].[hash].map',
      hashDigest: 'hex',
      hashDigestLength: 8
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
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'disable'
      })
    ]
  }
);

