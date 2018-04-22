import path = require('path');
import express = require('express');
import bodyParser = require('body-parser');
import { projectDir, response } from './utils';
import { logger, applyModules, applySwagger, applyRepository } from './helpers';
import { Request, Response, NextFunction, Error } from './interfaces';

const app = express();
const config = require('./utils').config('app');

app.set('x-powered-by', false);

app.use(logger());
app.use(bodyParser.json({ limit: config.JSON_LIMIT }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(projectDir, 'public')));

applyRepository();
applyModules(app, 'api', 'v1');
applySwagger(app, 'api', '/v1/docs');

// 404 error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  response(res, 404);
});

// error handler
app.use(function(err: Error, req: Request, res: Response, next: NextFunction) {
  response(res, err.status, null, err);
});

export default app;
