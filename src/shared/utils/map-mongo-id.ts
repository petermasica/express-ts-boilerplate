import { ObjectId } from 'mongodb';

export const mapMongoId = <T extends { _id: ObjectId }>(doc: T) => {
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toString() };
};
