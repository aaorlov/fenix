const webpackMerge = require('webpack-merge');

const helpers = require('./helpers');
const commonConfig = require('./webpack.common.js');

process.env.NODE_ENV = 'production';
process.env.ENV = 'production';

module.exports = webpackMerge(
  commonConfig({ env: process.env.NODE_ENV }),
  {
    output: {
      path: helpers.root('dist'),
      publicPath: '/',
      filename: 'static/bundle.[name].[hash].js',
      chunkFilename: '[name].[chunkhash].chunk.js',
      library: '[name]'
    },
    plugins: [

    ]
  }
);

