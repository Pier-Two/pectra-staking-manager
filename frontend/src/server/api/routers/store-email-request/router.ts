import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import { MOCK_VALIDATORS } from "pec/server/__mocks__/validators";
import { storeConsolidationRequest } from "./consolidation";

// class UserModel {
//   @prop({ required: true })
//   email: string;
// }
//
// class WithdrawalModel {
//   @prop({ ref: () => UserModel })
//   user: Ref<UserModel>;
//
//   @prop({ required: true })
//   validatorIndex: number;
//
//   // If null then it means that the validator has not requested a withdrawal
//   @prop({ required: true })
//   withdrawalIndex: number | null;
// }
//
//
// class DepositModel {
//   @prop({ ref: () => UserModel })
//   user: Ref<UserModel>;
//
//   @prop({ required: true })
//   validatorIndex: number;
//
//   @prop({ required: true })
//   txHash: string;
// }

export const storeEmailRequestRouter = createTRPCRouter({
  storeWithdrawalRequest: publicProcedure
    .input(z.object({ validatorIndex: z.number() }))
    .query(({}) => {
      // const data = axios.get(
      //   `https://beaconcha.in/api/v1/validator/${validatorIndex}/withdrawal`,
      // );
      //
      // const lastWithdrawalIndex = data.withdrawalIndex;
      //
      // await WithdrawalModel.create({
      //   data: {
      //     validatorIndex,
      //     withdrawalIndex: lastWithdrawalIndex,
      //   },
      // });

      return MOCK_VALIDATORS;
    }),
  storeDepositRequest: publicProcedure
    .input(z.object({ validatorIndex: z.number(), txHash: z.string() }))
    .query(({}) => {
      // await DepositModel.create({
      //   data: {
      //     validatorIndex,
      //     txHash,
      //   },
      // });
      return MOCK_VALIDATORS;
    }),

  // ! Leave this for now
  storeConsolidationRequest: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(({}) => {
      return storeConsolidationRequest();
    }),
});
