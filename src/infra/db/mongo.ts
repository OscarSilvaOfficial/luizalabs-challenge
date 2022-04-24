import { DBContract } from '@/adapters/contracts/db.contract';
import { connect, model, Schema } from 'mongoose';

export interface IMongoConfig {
  schema: Schema;
  dbConnectionString: string;
  collectionName: string;
}

export class MongoDB implements DBContract<any> {
  private schema: Schema;
  private dbConnectionString: string;
  private collection: any;

  constructor(mongoConfig: IMongoConfig) {
    this.dbConnectionString = mongoConfig.dbConnectionString;
    this.schema = mongoConfig.schema;
    this.collection = model(mongoConfig.collectionName, this.schema);
    this.createConnection();
  }

  private async createConnection() {
    try {
      await connect(`${this.dbConnectionString}`);
    } catch (err) {
      console.log('Mongo error', 'MongoConnectionError', err);
    }
  }

  async getAll(): Promise<any> {
    return await this.collection.find();
  }

  async getByName(name: string): Promise<any> {
    const response = await this.collection.find({ name });
    return response;
  }

  async create(data: any) {
    const newDocument = this.collection;
    const newData = new newDocument(data);
    return await newData.save();
  }
}
