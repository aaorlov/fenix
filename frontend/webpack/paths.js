const path = require('path');
const root = path.join.bind(path, path.resolve(__dirname, '..'));

module.exports = {
    src: root('src'),
    dist: root('dist'),
    root
};
