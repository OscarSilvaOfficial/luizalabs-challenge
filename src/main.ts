import express from 'express';
import { PersonController } from './presenters/controllers/person.controller';
import { register as RouterRegister } from 'express-decorators';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const personController = new PersonController();
RouterRegister(app, personController);

app.listen(3000, () => console.log('Server is running on port 3000'));
