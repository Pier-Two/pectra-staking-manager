import { ObjectId } from "mongodb";

export type DocumentWithId<T> = T & {
  _id: ObjectId;
};
