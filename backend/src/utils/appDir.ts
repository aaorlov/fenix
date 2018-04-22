const config = require('./config').default('app');

export default `${process.cwd()}/${config.SOURCE_DIR}`;