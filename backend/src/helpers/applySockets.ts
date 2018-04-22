import fs = require('fs');
import path = require('path');
import io = require('socket.io');
import { appDir } from '../utils';

export default function(io: SocketIO.Server, pathToComponents: string): void {
  pathToComponents = path.resolve(appDir, pathToComponents);

  io.on('connection', socket => {
    const components = fs.readdirSync(pathToComponents);
    
    components.forEach(component => {
      if (component[0] === '.') return; // skip hidden files and directories
  
      const path = `${pathToComponents}/${component}/socket`;
      const exists = fs.existsSync(path);
  
      if (exists) {
        require(path).default(socket);
      }
    });
  });
}