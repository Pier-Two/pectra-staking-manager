import { z } from "zod";
import { ValidatorDataSchema } from "./validator";
import {
  EBatchDepositStage,
  EDistributionMethod,
} from "pec/types/batch-deposits";

export const DepositDataSchema = z.object({
  validator: ValidatorDataSchema,
  amount: z.number().min(0, { message: "Please enter an acceptable amount" }),
});

export type DepositData = z.infer<typeof DepositDataSchema>;

export const DepositSchema = z.object({
  selectedValidators: z.array(ValidatorDataSchema),
  stage: z.nativeEnum(EBatchDepositStage),
  deposits: z.array(DepositDataSchema),
  totalToDistribute: z.number(),
  distributionMethod: z.nativeEnum(EDistributionMethod),
});

export type DepositType = z.infer<typeof DepositSchema>;
