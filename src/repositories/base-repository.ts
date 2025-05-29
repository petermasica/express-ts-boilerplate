import type { Document } from 'mongodb';

import { getDb } from '~/config/db';

export const getEntitiesPaginated = async <T extends Document>(
  collectionName: string,
  options: { page: number; limit: number } = { page: 1, limit: 20 },
) => {
  const page = options.page > 0 ? options.page : 1;
  const limit = options.limit > 0 ? options.limit : 20;
  const skip = (page - 1) * limit;

  const db = getDb();
  const collection = db.collection<T>(collectionName);

  const [entities, total] = await Promise.all([
    collection.find().skip(skip).limit(limit).toArray(),
    collection.countDocuments(),
  ]);

  return {
    entities,
    total,
    page,
    limit,
  };
};
