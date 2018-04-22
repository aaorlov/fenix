import fs = require('fs');
import path = require('path');
import express = require('express');
import { appDir } from '../utils';

export default function(app: express.Application, pathToModules: string, prefix: string = null): void {
  pathToModules = path.resolve(appDir, pathToModules);

  fs.readdirSync(pathToModules).forEach(moduleName => {
    if (moduleName[0] === '.') return; // skip hidden files and directories
    
    let route = `/${moduleName}`;
    
    if (prefix) route = `/${prefix}/${moduleName}`;

    app.use(route, require(`${pathToModules}/${moduleName}/router`).default);
  });
}