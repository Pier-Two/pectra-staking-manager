import { EDistributionMethod } from "pec/types/batch-deposits";
import { z } from "zod";
import { EmailSchema } from "./email";
import { ValidatorDataSchema } from "./validator";
import { SupportedChainIdSchema } from "./network";
import { emailSchema } from "pec/components/consolidation/summary/Email";

const FormDepositDataSchema = z.object({
  validator: ValidatorDataSchema,
  amount: z.number().min(0, { message: "Please enter an acceptable amount" }),
});

export type FormDepositData = z.infer<typeof FormDepositDataSchema>;

export const FormDepositSchema = (
  maxTotalToDistribute: number,
  maxTotalRemaining: number,
) =>
  z
    .object({
      deposits: z.array(FormDepositDataSchema),
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
    })
    .and(emailSchema);

export type FormDepositType = z.infer<ReturnType<typeof FormDepositSchema>>;

export const StoreDatabaseDepositSchema = z.object({
  deposits: z.array(
    z.object({
      publicKey: z.string(),
      validatorIndex: z.number(),
      amount: z.number(),
    }),
  ),
  txHash: z.string(),
  networkId: SupportedChainIdSchema,
  email: EmailSchema,
});

export type StoreDatabaseDepositType = z.infer<
  typeof StoreDatabaseDepositSchema
>;
