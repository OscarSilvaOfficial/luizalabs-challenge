import { DBContract } from '@/adapters/contracts/db.contract';
import * as mongoDB from 'mongodb';
import { NestLogger } from '../logger/nest.logger';

export interface IMongoConfig {
  dbConnectionString: string;
  dbName: string;
  collectionName: string;
}

export class MongoDB implements DBContract {
  private driver: mongoDB.Collection;
  private logger: NestLogger;

  constructor(mongoConfig: IMongoConfig, logger: NestLogger) {
    this.logger = logger;
    this.createConnection(mongoConfig);
  }

  private async createConnection(mongoConfig: IMongoConfig) {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(
      mongoConfig.dbConnectionString,
    );

    try {
      await client.connect();
      this.logger.log(
        `Successfully connected to database: ${mongoConfig.dbName}`,
        'MongoDB Connection',
      );
    } catch (error) {
      this.logger.error(
        `Try to connect ${mongoConfig.dbConnectionString} on database: ${mongoConfig.dbName}`,
        error,
        'MongoDB Connection',
      );
      throw error;
    }

    try {
      const db: mongoDB.Db = client.db(mongoConfig.dbName);

      const collection: mongoDB.Collection = db.collection(
        mongoConfig.collectionName,
      );

      this.driver = collection;
    } catch (error) {
      this.logger.error(
        `Error connecting to collection: ${mongoConfig.collectionName}`,
        error,
        'MongoDB Connection',
      );
      throw error;
    }
  }

  async getAll(): Promise<any> {
    const dbResponse = this.driver.find();
    return dbResponse.toArray();
  }

  async getByName(name: string): Promise<any> {
    const dbResponse = await this.driver.findOne({ name });
    return dbResponse;
  }

  async create(data: any[] | any): Promise<any> {
    return Array.isArray(data)
      ? this.driver.insertMany(data)
      : this.driver.insertOne(data);
  }
}
