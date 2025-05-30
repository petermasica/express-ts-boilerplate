import type { Document, Filter, OptionalUnlessRequiredId } from 'mongodb';

import { getDb } from '~/config/db';

const buildProjection = (keys: string[]) => {
  return keys.reduce<Record<string, number | string>>((projection, key) => {
    if (key === 'id') {
      projection.id = '$_id';
      projection._id = 0;
    } else {
      projection[key] = 1;
    }
    return projection;
  }, {});
};

export const getEntitiesPaginated = async <T extends Document>(
  collectionName: string,
  paginationOptions: { page: number; limit: number } = { page: 1, limit: 20 },
) => {
  const page = paginationOptions.page > 0 ? paginationOptions.page : 1;
  const limit = paginationOptions.limit > 0 ? paginationOptions.limit : 20;
  const skip = (page - 1) * limit;

  const db = getDb();
  const collection = db.collection<T>(collectionName);

  const [entities, total] = await Promise.all([
    collection
      .find({}, { projection: { id: '$_id', _id: 0, name: 1, description: 1 } })
      .skip(skip)
      .limit(limit)
      .toArray(),
    collection.countDocuments(),
  ]);

  return {
    entities,
    total,
    page,
    limit,
  };
};

export const createEntity = async <T extends Document>(
  collectionName: string,
  entity: OptionalUnlessRequiredId<T>,
) => {
  const db = getDb();
  const collection = db.collection<T>(collectionName);

  return collection.insertOne(entity);
};

export const getOneEntityById = async <T extends Document>(
  collectionName: string,
  id: Filter<T>,
  projectionKeys: string[],
) => {
  const db = getDb();
  const collection = db.collection<T>(collectionName);
  return collection.findOne(
    { _id: id },
    {
      projection: buildProjection(projectionKeys),
    },
  );
};
