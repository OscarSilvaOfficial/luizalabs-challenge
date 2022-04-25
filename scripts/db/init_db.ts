import {
  MONGO_DATABASE_NAME,
  MONGO_URL,
} from '../../src/infra/configs/enviroment';
import data from './init_db.json';
import * as mongoDB from 'mongodb';

export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(MONGO_URL);

  await client.connect();

  const db: mongoDB.Db = client.db(MONGO_DATABASE_NAME);

  const collection: mongoDB.Collection = db.collection('persons');

  console.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${collection.collectionName}`,
  );

  return collection;
}

export async function insertDataOnDB() {
  const collection = await connectToDatabase();
  const collectionData = await collection.find().toArray();
  if (collectionData.length === 0) {
    collection.insertMany(data);
    console.log(
      `Data inserted successfully to collection: ${collection.collectionName}`,
    );
  }
}
