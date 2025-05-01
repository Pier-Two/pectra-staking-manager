import { EDistributionMethod } from "pec/types/batch-deposits";
import { z } from "zod";
import { EmailSchema } from "./email";
import { ValidatorDataSchema } from "./validator";

export const DepositDataSchema = z.object({
  validator: ValidatorDataSchema,
  amount: z.number().min(0, { message: "Please enter an acceptable amount" }),
});

export type DepositData = z.infer<typeof DepositDataSchema>;

export const DepositSchema = (
  maxTotalToDistribute: number,
  maxTotalRemaining: number,
) =>
  z.object({
    deposits: z.array(DepositDataSchema),
    totalToDistribute: z
      .number({ invalid_type_error: "Please enter a valid amount" })
      .min(0)
      .refine((val) => val <= maxTotalToDistribute, {
        message:
          "Please enter an amount less than or equal to your available balance",
      })
      .refine((val) => val <= maxTotalRemaining, {
        message: "Amount exceeds maximum remaining validator capacity",
      }),
    distributionMethod: z.nativeEnum(EDistributionMethod),
    email: EmailSchema,
  });

export type DepositType = z.infer<ReturnType<typeof DepositSchema>>;
