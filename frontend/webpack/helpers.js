const path = require('path');

const EVENT = process.env.npm_lifecycle_event || '';

const root = path.join.bind(path, path.resolve(__dirname, '..'));

/** check proccess flag */
const hasProcessFlag = flag => process.argv.join('').indexOf(flag) > -1;

/** check npm flag */
const hasNpmFlag = flag => EVENT.includes(flag);

/** check dev server */
const isWebpackDevServer = () => process.argv[1] && !!(/webpack-dev-server/.exec(process.argv[1]));

exports.hasProcessFlag = hasProcessFlag;
exports.hasNpmFlag = hasNpmFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.root = root;
