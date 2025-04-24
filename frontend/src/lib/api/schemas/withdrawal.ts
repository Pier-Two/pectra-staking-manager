import { z } from "zod";
import { DatabaseWithdrawalSchema } from "./database/withdrawal";
import { EmailSchema } from "./email";
import { ValidatorDataSchema } from "./validator";
export const WithdrawalFormSchema = z.object({
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

export type WithdrawalFormType = z.infer<typeof WithdrawalFormSchema>;

export const StoreWithdrawalRequestSchema = DatabaseWithdrawalSchema.omit({
  status: true,
  withdrawalIndex: true,
});

export type StoreWithdrawalRequestType = z.infer<
  typeof StoreWithdrawalRequestSchema
>;
