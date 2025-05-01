import mongoose from "mongoose";
import { DocumentType, Ref } from "@typegoose/typegoose";

/**
 * Checks if a Ref<T> is populated and returns typeguard to DocumentType<T>
 */
export function isPopulated<T>(doc: Ref<T>): doc is DocumentType<T> {
  return (
    typeof doc === "object" && doc !== null && !mongoose.isValidObjectId(doc)
  );
}
