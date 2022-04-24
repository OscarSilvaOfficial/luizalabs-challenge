import { PersonRepository } from '@/adapters/repositories/person.repository';
import { MongoDB } from '../db/mongoDB';
import * as enviroment from '../configs/enviroment';

export const personRepositoryFactory = (): PersonRepository => {
  const db = new MongoDB({
    dbConnectionString: enviroment.MONGO_URL,
    dbName: enviroment.MONGO_DATABASE_NAME,
    collectionName: 'persons',
  });

  return new PersonRepository(db);
};
