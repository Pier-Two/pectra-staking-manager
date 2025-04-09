import { getModelForClass, type DocumentType } from "@typegoose/typegoose";
import mongoose, { type Model, type Mongoose } from "mongoose";
import { env } from "pec/env";
import { Deposit } from "../classes/deposit";
import { User } from "../classes/user";
import { ValidatorSummary } from "../classes/validatorSummary";
import { Withdrawal } from "../classes/withdrawal";

// Create a cached connection variable
let conn: Mongoose | null = null;

export const connect = async () => {
  if (conn === null) {
    conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  return conn;
};

export const UserModel: Model<User> =
  mongoose.models.User ?? getModelForClass(User);

export type UserDocumentType = DocumentType<User>;

export const WithdrawalModel: Model<Withdrawal> =
  mongoose.models.Withdrawal ?? getModelForClass(Withdrawal);

export type WithdrawalDocumentType = DocumentType<Withdrawal>;

export const DepositModel: Model<Deposit> =
  mongoose.models.Deposit ?? getModelForClass(Deposit);

export type DepositDocumentType = DocumentType<Deposit>;

export const ValidatorSummaryModel: Model<ValidatorSummary> =
  mongoose.models.ValidatorSummary ?? getModelForClass(ValidatorSummary);

export type ValidatorSummaryDocumentType = DocumentType<Deposit>;
