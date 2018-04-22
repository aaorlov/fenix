import fs = require('fs');
import express = require('express');
import { appDir, projectDir, log } from '../utils';
import { 
  forEach,
  isString,
  isNumber,
  isArray,
  isObject,
  isBoolean,
  isMap,
  merge,
  last,
  startsWith,
  flatten,
  findIndex,
  camelCase,
  upperFirst,
  isEmpty
} from 'lodash';

const config = require('../utils').config('app');

export default function(app: express.Application, dir: string, url: string): void {
  log.info('Swagger intialization...');
  
  const path = `${appDir}/api`;
  const swaggerPath = `${projectDir}/swagger`;
  const models = [];
  const routers = [];
  const routerDocs = [];
  let swaggerDocument = require(swaggerPath);
  
  fs.readdirSync(path).forEach(moduleName => {
    if (moduleName[0] === '.') return; // skip hidden files and directories

    const basePath = `${path}/${moduleName}`;
    
    try {
      models.push({
        name: moduleName,
        model: require(`${basePath}/schema`).default
      });
    } catch (exception) {}

    try {
      routers.push({
        name: moduleName,
        router: require(`${basePath}/router`).default
      });
    } catch (exception) {}
    
    routerDocs.push({
      name: moduleName,
      path: `${projectDir}/src/api/${moduleName}/router`
    });
  });
  
  try {
    swaggerDocument = parseRouters(swaggerDocument, routers, routerDocs);  
    swaggerDocument = parseModels(swaggerDocument, models);
  } catch (exception) {
    log.error(exception);
    log.info('Swagger generator contains error. More in errors.log');
  }
  
  swaggerDocument.host = `${(config.DOMAIN || 'localhost')}:${(config.PORT || process.env.PORT || 3000)}`;

  if (process.env.NODE_ENV === global.DEVELOPMENT_ENV || process.env.NODE_ENV === global.STAGING_ENV) {
    saveJSON(swaggerPath, swaggerDocument);
    const swaggerUi = require('swagger-ui-express');
    
    app.use(url, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    
    log.info('Swagger connected.');
  } else {
    log.info('Swagger disabled in this environment');
  }
}

function parseRouters(swaggerDocument, routers, routerDocs) {
  const docs = flatten(routerDocs.map(doc => parseRouterDocs(doc)));

  swaggerDocument.tags = [];
  swaggerDocument.paths = {};

  routers.forEach((instance, index) => {
    swaggerDocument.tags.push({ name: instance.name });

    instance.router.stack.forEach(({route}) => {
      const method = route.stack[0].method;
      const path = `/${instance.name}${route.path}`;
      const index = findIndex(docs, { url: path, method });
      const item: any = docs[index];
      let type = null;
      let result = {};

      if (item != null) {
        result = {
          'parameters': [ ...item.params ]
        }
        
        switch (item.format) {
          case 'json': type = 'application/json'; break;
          case 'xml': type = 'application/xml'; break;
        }
      }

      if (type != null) {
        merge(result, { 
          'consumes': [ type ],
          'produces': [ type ]
        });
      }

      swaggerDocument.paths = merge(swaggerDocument.paths, { 
        [path]: {
          [method]: {
            'tags': [ instance.name ],
            ...result
          }
        } 
      });
    });
  });

  return swaggerDocument;
}

function parseModels(swaggerDocument, models) {
  swaggerDocument.definitions = {};

  models.forEach(instance => {
    instance.name = upperFirst(camelCase(instance.name));

    swaggerDocument.definitions[instance.name] = {
      type: 'object',
      properties: {
        _id: {
          type: 'ObjectId'
        }
      }
    }

    forEach(instance.model, (value: any, key) => {
      if (key[0] === '$') return;

      let type;

      if (!isEmpty(value.$)) {
        type = value.$;
      } else if (value.type && !value.type.schemaName) {
        type = value.type();

        if (isString(type)) {
          type = 'string';
        } else if (isNumber(type)) {
          type = 'integer';
        } else if (isBoolean(type)) {
          type = 'boolean';
        } else if (isArray(type)) {
          type = 'array';
        } else if (isObject(type)) {
          type = 'object';
        } else if (isMap(type)) {
          type = 'map';
        }
      } else {
        type = 'ObjectId';
      }

      swaggerDocument.definitions[instance.name].properties[key] = { type };
    });
  });

  return swaggerDocument;
}

function parseRouterDocs(router) {
  const data = [];

  let routerAsString: string = fs.readFileSync(`${router.path}.ts`, 'utf-8');
  const startsRegex = /\*\*/g;
  const starts: any = routerAsString.match(startsRegex) || [];

  starts.forEach((val, key) => {
    const start = routerAsString.indexOf('/**');
    const end = routerAsString.indexOf('*/') + 50;
    const result = routerAsString.slice(start, end);

    const formatTag = '@type';    
    const methodTag = '@method';
    const paramTag = '@param';

    let method;
    let params = [];
    let format;

    let args = result.split('*').filter(row => {
      row = row.trim();
      
      return row !== '';
    });

    args = args.slice(0, args.length - 1);
    args = args.map(item => item.trim());

    args.forEach(item => {
      if (startsWith(item, formatTag)) format = last(item.split(formatTag)).trim();      
      if (startsWith(item, methodTag)) method = last(item.split(methodTag)).trim();
      if (startsWith(item, paramTag)) {
        let result = last(item.split(paramTag)).trim();
        let resultArray = result.split(' ');
        
        params.push({
          name: resultArray[0],
          type: resultArray[1].replace('{', '').replace('}', ''),
          required: result.indexOf('!') > -1
        });
      }
    });
    
    const startPath = routerAsString.indexOf(`.${method}(`);
    const endPath = routerAsString.indexOf(`',`);
    const resultPath = routerAsString.slice(startPath, endPath);
    const url = `/${router.name}${last(resultPath.split('(')).trim().slice(1)}`;

    routerAsString = routerAsString.replace(result, '');
    routerAsString = routerAsString.replace(resultPath, '');
    
    if (!(url.indexOf('\'') > -1) && !(url.indexOf('"') > -1)) {
      data.push({
        url,
        method,
        format,
        params
      });
    }
  });

  return data;
}

function saveJSON(path: string, output: object): void {
  const content = JSON.stringify(output);

  fs.writeFileSync(`${path}.json`, content, 'utf8'); 
}
