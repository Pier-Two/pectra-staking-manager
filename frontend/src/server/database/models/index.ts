import { getModelForClass, type DocumentType } from "@typegoose/typegoose";
import mongoose, { type Model, type Mongoose } from "mongoose";
import { env } from "pec/env";
import { Consolidation } from "../classes/consolidation";
import { Deposit } from "../classes/deposit";
import { ValidatorSummary } from "../classes/validatorSummary";
import { Withdrawal } from "../classes/withdrawal";
import { ValidatorUpgrade } from "../classes/validatorUpgrade";
import { Exit } from "../classes/exit";

// Create a cached connection variable
let conn: Mongoose | null = null;

export const connect = async () => {
  conn ??= await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  return conn;
};

// WITHDRAWALS

export const WithdrawalModel: Model<Withdrawal> =
  mongoose.models.Withdrawal ?? getModelForClass(Withdrawal);

export type WithdrawalDocumentType = DocumentType<Withdrawal>;

export const ExitModel: Model<Exit> =
  mongoose.models.Exit ?? getModelForClass(Exit);

export type ExitDocumentType = DocumentType<Exit>;

// DEPOSITS

export const DepositModel: Model<Deposit> =
  mongoose.models.Deposit ?? getModelForClass(Deposit);

export type DepositDocumentType = DocumentType<Deposit>;

// CONSOLIDATIONS

export const ConsolidationModel: Model<Consolidation> =
  mongoose.models.Consolidation ?? getModelForClass(Consolidation);

export type ConsolidationDocumentType = DocumentType<Consolidation>;

export const ValidatorUpgradeModel: Model<ValidatorUpgrade> =
  mongoose.models.ValidatorUpgrade ?? getModelForClass(ValidatorUpgrade);

export type ValidatorUpgradeDocumentType = DocumentType<ValidatorUpgrade>;

// VALIDATOR
export const ValidatorSummaryModel: Model<ValidatorSummary> =
  mongoose.models.ValidatorSummary ?? getModelForClass(ValidatorSummary);

export type ValidatorSummaryDocumentType = DocumentType<Deposit>;
