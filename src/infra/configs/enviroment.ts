import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URL =
  process.env.MONGO_URL || 'mongodb://test:test@localhost:27017';

export const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME || 'test';
