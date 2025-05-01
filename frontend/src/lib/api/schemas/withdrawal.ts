import { z } from "zod";
import { EmailSchema } from "./email";
import { ValidatorDataSchema } from "./validator";
import { SupportedChainIdSchema } from "./network";

export const FormWithdrawalSchema = z.object({
  withdrawals: z.array(
    z.object({
      validator: ValidatorDataSchema,
      amount: z
        .number()
        .min(0, { message: "Please enter an acceptable amount" }),
    }),
  ),
  email: EmailSchema,
});

export type FormWithdrawalType = z.infer<typeof FormWithdrawalSchema>;

export const StoreWithdrawalRequestSchema = z.object({
  validatorIndex: z.number(),
  withdrawalAddress: z.string(),
  balance: z.number(),
  amount: z.number(),
  txHash: z.string(),
  email: EmailSchema,
  network: SupportedChainIdSchema,
});

export type StoreWithdrawalRequestType = z.infer<
  typeof StoreWithdrawalRequestSchema
>;
