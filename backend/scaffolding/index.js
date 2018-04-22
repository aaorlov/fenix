import 'colors';
import fs from 'fs';
import mkdirp from 'mkdirp';
import {
  controllerTemplate,
  modelTemplate,
  routerTemplate,
  schemaTemplate,
  interfaceTemplate
} from './templates';

const appDir = process.cwd();
const argument = process.argv[2];
const path = `${appDir}/src/api/${argument}`;
const done = [];

const controller = `${path}/controller.ts`;
const model = `${path}/model.ts`;
const router = `${path}/router.ts`;
const schema = `${path}/schema.ts`;
const _interface = `${path}/interface.ts`;

const isDirExists = fs.existsSync(path);

/**
 * create file
 * */
const createFile = (component, template) => {
  fs.openSync(component, 'w');
  fs.writeFile(component, template(argument));
  fs.closeSync(fs.openSync(component, 'w'));
  if (fs.existsSync(component)) done.push(true);
};

/**
 * show message in console
 * */
const showMessage = message => {
  console.log('');
  console.log(message);
  console.log('');
  console.log('');
};

if (isDirExists) {
  showMessage(`Component ${`${argument}`.cyan} already ${'exists'.red}`);
} else {
  mkdirp(path, err => {
    if (err) return console.error(err);

    createFile(controller, controllerTemplate);
    createFile(model, modelTemplate);
    createFile(router, routerTemplate);
    createFile(schema, schemaTemplate);
    createFile(_interface, interfaceTemplate);

    if (done.length === 5) {
      showMessage(`Component ${`${argument}`.cyan} generated ${'successfuly.'.green}`);
    } else {
      showMessage(`${'Oops... Something wrong.'.red} Component not created.`);
    }

    return null;
  });
}
