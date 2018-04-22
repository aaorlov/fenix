const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require('compression-webpack-plugin');

const { src, dist } = require('./paths');
const commonConfig = require('./webpack.common.js');

process.env.NODE_ENV = 'production';
process.env.ENV = 'production';

module.exports = webpackMerge(
  commonConfig({env: process.env.NODE_ENV}),
  {
    output: {
      path: dist,
      publicPath: '/',
      filename: 'static/bundle.[name].[hash].js',
      chunkFilename: 'static/chunk.[name].[chunkhash].js',
      library: '[name]',
      hashDigest: 'hex',
      hashDigestLength: 8
    },
    performance: {
      maxEntrypointSize: 1000000, // ~1Mb
      maxAssetSize: 300000, // ~300Kb
      assetFilter(assetFilename) {
        return (/\.(?:js|css)\.gz$/.test(assetFilename));
      }
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          include: src,
          exclude: /(node_modules)/,
          use: [
            MiniCssExtractPlugin.loader,
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
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'static/bundle.[contenthash].css',
        chunkFilename: 'static/chunk.[contenthash].css'
      }),
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|svg)/
      })
    ]
  }
);

