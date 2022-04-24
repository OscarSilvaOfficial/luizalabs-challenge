import express from 'express';
import { PersonController } from './presenters/controllers/person.controller';
import { register as RouterRegister } from 'express-decorators';
import bodyParser from 'body-parser';
import docs from 'express-oas-generator';

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const personController = new PersonController();
RouterRegister(app, personController);
docs.init(app, {
  info: {
    title: 'Person API',
    description: 'API for managing persons',
    version: '1.0.0',
  },
});

app.listen(3000, () => console.log('Server is running on port 3000'));
