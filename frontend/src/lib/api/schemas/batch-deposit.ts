import { z } from "zod";

export const BatchDepositTransactionSchema = z.object({
  rawDepositData: z.string().min(1, {message: "Raw deposit data is required"}),
  signedDepositData: z.string().min(1, {message: "Signed deposit data is required"}),
});

export type BatchDepositTransaction = z.infer<
  typeof BatchDepositTransactionSchema
>;

export const BatchDepositGenerateTransactionSchema = z.object({
  transactions: z.array(BatchDepositTransactionSchema),
});

export type BatchDepositGenerateTransaction = z.infer<
  typeof BatchDepositGenerateTransactionSchema
>;
