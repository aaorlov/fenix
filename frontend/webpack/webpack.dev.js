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
    /** for debug */
    devtool: 'source-map',
    output: {
      path: helpers.root('dist'),
      publicPath: '/assets/',
      filename: 'static/[name].[hash].bundle.js',
      chunkFilename: '[name].[chunkhash].chunk.js',
      /** create output as library */
      library: '[name]',
      sourceMapFilename: '[file].map',
      /** hash type and length (default hex 20) */
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

