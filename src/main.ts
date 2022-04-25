import { PersonController } from '@/presenters/controllers/person.controller';
import { register as RouterRegister } from 'express-decorators';
import { NestLogger } from '@/infra/logger/nest.logger';
import docs from 'express-oas-generator';
import bodyParser from 'body-parser';
import express from 'express';
import { insertDataOnDB } from './migrate';

const app = express();
const logger = new NestLogger();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const personController = new PersonController();
RouterRegister(app, personController);
docs.init(app, {
  openapi: '3.0',
  info: {
    title: 'Person API',
    description: 'API for managing persons',
    version: '1.0.0',
  },
});

insertDataOnDB();

app.listen(3000, () =>
  logger.log('Server is running on port 3000', 'Server Starting'),
);
