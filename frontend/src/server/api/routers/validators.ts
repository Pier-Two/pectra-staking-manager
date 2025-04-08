import { z } from "zod";

import axios from "axios";
import { ValidatorSummaryModel } from "pec/lib/database/models";
import { MOCK_VALIDATORS } from "pec/server/__mocks__/validators";
import { createTRPCRouter, publicProcedure } from "pec/server/api/trpc";
import {
  type ValidatorsResponseData,
  type ValidatorUpgradeSummaryObject,
} from "pec/types/quicknode-validators";

export const validatorRouter = createTRPCRouter({
  /**
   * Generates summaries of the validators currently marked as active. In particular, it records the total staked, average staked and number of validators
   */
  generateValidatorSummary: publicProcedure.mutation(async () => {
    // TODO: Potentially look at upgrading this to a paid key if possible
    // Fetch the validator data (return ALL active validators - ~1 million entries)
    const { data } = await axios.get<ValidatorsResponseData>(
      `https://${process.env.QUICKNODE_ENDPOINT_NAME}.quiknode.pro/${process.env.QUICKNODE_ENDPOINT_SECRET}/eth/v1/beacon/states/head/validators?status=active`,
    );

    // Initial summary. All values are 0 to begin with
    const initialSummary: ValidatorUpgradeSummaryObject = {
      "0x00": {
        count: 0,
        balance: BigInt("0"),
      },
      "0x01": {
        count: 0,
        balance: BigInt("0"),
      },
      "0x02": {
        count: 0,
        balance: BigInt("0"),
      },
      other: {
        count: 0,
        balance: BigInt("0"),
      },
    };

    // Reduce the validator data down to a single object containing totals of each relevant statistic
    const summary = data.data.reduce((acc, validator) => {
      const withdrawalCredentials = validator.validator.withdrawal_credentials;

      if (withdrawalCredentials.startsWith("0x00")) {
        acc["0x00"].count = acc["0x00"].count + 1;
        acc["0x00"].balance = acc["0x00"].balance + BigInt(validator.balance);
        return acc;
      } else if (withdrawalCredentials.startsWith("0x01")) {
        acc["0x01"].count = acc["0x01"].count + 1;
        acc["0x01"].balance = acc["0x01"].balance + BigInt(validator.balance);
        return acc;
      } else if (withdrawalCredentials.startsWith("0x02")) {
        acc["0x02"].count = acc["0x02"].count + 1;
        acc["0x02"].balance = acc["0x02"].balance + BigInt(validator.balance);
        return acc;
      } else {
        acc.other.count = acc.other.count + 1;
        acc.other.balance = acc.other.balance + BigInt(validator.balance);
        return acc;
      }
    }, initialSummary);

    // Check if any other withdraw credentials were identified. If so, throw an error, but don't error out
    if (summary.other.count > 0) {
      console.error("'other' withdraw credentials were detected");
    }

    // Convert to array and remove the "other" data
    const summaryArr = Object.entries(summary);
    summaryArr.splice(-1, 1);

    // Generate Validator Summaries
    const bulkWriteQuery = summaryArr.map(([withdrawCredential, summary]) => ({
      insertOne: {
        document: {
          withdrawalCredentialPrefix: withdrawCredential,
          totalStaked: summary.balance.toString(),
          count: summary.count,
          avgStaked: summary.balance / BigInt(summary.count),
        },
      },
    }));

    // Commit updates to database
    await ValidatorSummaryModel.bulkWrite(bulkWriteQuery);
  }),

  getValidators: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input: { address } }) => {
      return MOCK_VALIDATORS;
      // try {
      //   const validators: ValidatorDetailsResponse[] = [];

      //   const validatorResponse = await fetch(
      //     `https://beaconcha.in/api/v1/validator/eth1/${address}?api_key=${env.BEACONCHAIN_API_KEY}`,
      //   );

      //   if (!validatorResponse.ok) return [];
      //   const validatorResponseJson =
      //     (await validatorResponse.json()) as BeaconChainAllValidatorsResponse;
      //   if (validatorResponseJson.data.length === 0) return [];

      //   const validatorIndexes = validatorResponseJson.data.map(
      //     (validator) => validator.validatorindex,
      //   );

      //   if (validatorIndexes.length === 0) return [];

      //   const validatorDetails = await fetch(
      //     `https://beaconcha.in/api/v1/validator/${validatorIndexes.join(",")}?api_key=${env.BEACONCHAIN_API_KEY}`,
      //   );

      //   if (!validatorDetails.ok) return [];
      //   const validatorDetailsJson =
      //     (await validatorDetails.json()) as BeaconChainValidatorDetailsResponse;
      //   if (validatorDetailsJson.data.length === 0) return [];

      //   validatorDetailsJson.data.forEach((validator) => {
      //     const { activeSince, activeDuration } = getValidatorActiveInfo(
      //       validator.activationepoch,
      //     );

      //     validators.push({
      //       validatorIndex: validator.validatorindex,
      //       publicKey: validator.pubkey,
      //       withdrawalAddress: validator.withdrawalcredentials,
      //       balance: validator.balance,
      //       effectiveBalance: validator.effectivebalance,
      //       status: validator.status.toLowerCase().includes("active")
      //         ? ValidatorStatus.ACTIVE
      //         : ValidatorStatus.INACTIVE,
      //       numberOfWithdrawals: validator.total_withdrawals,
      //       activeSince,
      //       activeDuration,
      //       withdrawalTransaction: null,
      //       consolidationTransaction: null,
      //       depositTransaction: null,
      //     });
      //   });

      //   return validators;
      // } catch (error) {
      //   console.error("Error fetching validators:", error);
      //   return [];
      // }
    }),
});
