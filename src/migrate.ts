import { MONGO_DATABASE_NAME, MONGO_URL } from '@/infra/configs/enviroment';
import data from './scripts/db/init_db.json';
import * as mongoDB from 'mongodb';
import { NestLogger } from '@/infra/logger/nest.logger';

const logger = new NestLogger();

async function connectToDatabase() {
  logger.log('Connecting to database...', 'Database');
  logger.log(`Database: ${MONGO_DATABASE_NAME}`, 'Database');

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(MONGO_URL);

  await client.connect();

  const db: mongoDB.Db = client.db(MONGO_DATABASE_NAME);

  const collection: mongoDB.Collection = db.collection('persons');

  logger.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${collection.collectionName}`,
    'Database Initializer',
  );

  return collection;
}

export async function insertDataOnDB() {
  const collection = await connectToDatabase();
  const collectionData = await collection.find().toArray();
  if (collectionData.length === 0) {
    collection.insertMany(data);
    logger.log(
      `Data inserted successfully to collection: ${collection.collectionName}`,
      'Database Initializer',
    );
  }
  logger.log(
    `Data already exists in collection: ${collection.collectionName}`,
    'Database Initializer',
  );
  return collection;
}
