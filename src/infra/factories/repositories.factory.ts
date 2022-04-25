import { PersonRepository } from '@/adapters/repositories/person.repository';
import { MongoDB } from '../db/mongoDB';
import * as enviroment from '../configs/enviroment';
import { NestLogger } from '../logger/nest.logger';

export const personRepositoryFactory = (): PersonRepository => {
  const db = new MongoDB(
    {
      dbConnectionString: enviroment.MONGO_URL,
      dbName: enviroment.MONGO_DATABASE_NAME,
      collectionName: 'persons',
    },
    new NestLogger(),
  );

  return new PersonRepository(db);
};
