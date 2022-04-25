import bodyParser from 'body-parser';
import express from 'express';
import { RegisterRoutes } from '../build/routes';
import * as swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../build/swagger.json';
import './presenters/controllers/person.controller';

export const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(bodyParser.json());

try {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (err) {
  console.log('Unable to load swagger.json', err);
}

RegisterRoutes(app);
