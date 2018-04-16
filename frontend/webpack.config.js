switch (process.env.NODE_ENV || process.env.ENV) {
  case 'prod':
  case 'production':
    module.exports = require('./webpack/webpack.prod'); //eslint-disable-line
    break;
  case 'dev':
  case 'development':
  default:
    module.exports = require('./webpack/webpack.dev'); //eslint-disable-line
}
