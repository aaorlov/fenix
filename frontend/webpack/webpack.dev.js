const webpackMerge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { src, dist } = require('./paths');
const commonConfig = require('./webpack.common.js');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3002;
const PUBLIC = process.env.PUBLIC_DEV || `${HOST}:${PORT}`;

process.env.NODE_ENV = 'development';
process.env.ENV = 'development';

module.exports = webpackMerge(
  commonConfig({env: process.env.NODE_ENV}),
  {
    devtool: 'source-map',
    output: {
      path: dist,
      publicPath: '/',
      filename: 'static/bundle.[name].[hash].js',
      chunkFilename: 'static/[name].[chunkhash].chunk.js',
      library: '[name]',
      sourceMapFilename: 'static/bundle.[name].[hash].map',
      hashDigest: 'hex',
      hashDigestLength: 8
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          include: src,
          exclude: /(node_modules)/,
          use: [
            {
              loader: 'style-loader'
            },
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
    devServer: {
      port: PORT,
      host: HOST,
      public: PUBLIC,
      inline: true,
      progress: true,
      open: true,
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

