import { Db, MongoClient } from 'mongodb';

import { config } from './env';
import { logger } from './logger';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

let client: MongoClient;
let db: Db;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const initDbConnection = async (attempts = 1): Promise<void> => {
  try {
    client = new MongoClient(`${config.db.uri}/${config.db.name}`);
    await client.connect();

    db = client.db(config.db.name);

    logger.info('MongoDB connection successful');
  } catch (err) {
    logger.error(`MongoDB connection failed (attempt ${attempts}):`, {
      error: err,
    });

    if (attempts >= MAX_RETRIES) {
      throw new Error('Failed to connect to MongoDB after multiple attempts.');
    }

    await sleep(RETRY_DELAY_MS);
    await initDbConnection(attempts + 1);
  }
};

export const getClient = () => client;
export const getDb = () => db;
