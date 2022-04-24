import { PersonRepository } from '@/adapters/repositories/person.repository';
import { MongoDB } from '../db/mongo';
import { Schema } from 'mongoose';
import { IPersonConstructor } from '@/core/entities/Person';
import { MONGO_URL } from '../configs/enviroment';

export const personRepositoryFactory = (): PersonRepository => {
  const schema = new Schema<IPersonConstructor>({
    name: String,
    friends: [{}],
  });

  const db = new MongoDB({
    collectionName: 'persons',
    dbConnectionString: MONGO_URL,
    schema: schema,
  });

  return new PersonRepository(db);
};
