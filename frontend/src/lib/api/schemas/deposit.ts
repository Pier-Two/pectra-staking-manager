import { z } from "zod";
import { ValidatorDataSchema } from "./validator";
import { EDistributionMethod } from "pec/types/batch-deposits";

export const DepositDataSchema = z.object({
  validator: ValidatorDataSchema,
  amount: z.number().min(0, { message: "Please enter an acceptable amount" }),
});

export type DepositData = z.infer<typeof DepositDataSchema>;

export const DepositSchema = (maxTotalToDistribute: number) =>
  z.object({
    deposits: z.array(DepositDataSchema),
    totalToDistribute: z.number().min(0).max(maxTotalToDistribute),
    distributionMethod: z.nativeEnum(EDistributionMethod),
    email: z.string().email().optional(),
  });

export type DepositType = z.infer<ReturnType<typeof DepositSchema>>;
