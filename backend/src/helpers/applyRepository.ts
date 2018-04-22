const fs = require('fs');
const config = require('../utils').config('app');

export default function(): void {
  if (!fs.existsSync(config.REPOSITORY.DIR)) {
    fs.mkdirSync(config.REPOSITORY.DIR);
  }
}