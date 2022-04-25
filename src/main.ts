import { insertDataOnDB } from './migrate';
import { app } from './app';
import { NestLogger } from './infra/logger/nest.logger';

const logger = new NestLogger();
insertDataOnDB();

app.listen(3000, () =>
  logger.log('Server is running on port 3000', 'Server Starting'),
);
