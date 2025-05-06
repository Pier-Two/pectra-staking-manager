import axios from "axios";
import { headers } from "next/headers";
import { env } from "pec/env";
import { generateChartData } from "pec/server/api/routers/charts/generateChartData";
import { connect, ValidatorSummaryModel } from "pec/server/database/models";
import type { ValidatorStatistics } from "pec/types/chart";

import {
  type ValidatorsResponseData,
  type ValidatorUpgradeSummaryObject,
} from "pec/types/quicknode-validators";

export const maxDuration = 60;

/**
 * Generates summaries of the validators currently marked as active. In particular, it records the total staked, average staked and number of validators
 */
export const POST = async () => {
  // Check the headers for a secret key
  const secret = (await headers()).get("x-trigger-secret");

  if (secret !== env.MONGO_TRIGGER_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // connect to the database
  await connect();

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

  // Specify a timestamp that the data is fetched from
  const currentTimestamp = new Date();

  // Generate Validator Summaries
  const bulkWriteQuery = summaryArr.map(([withdrawCredential, summary]) => ({
    insertOne: {
      document: {
        withdrawalCredentialPrefix: withdrawCredential,
        totalStaked: summary.balance.toString(),
        count: summary.count,
        avgStaked: summary.balance / BigInt(summary.count),
        timestamp: currentTimestamp,
      },
    },
  }));

  // Commit updates to database
  await ValidatorSummaryModel.bulkWrite(bulkWriteQuery);

  await generateChartData();

  return Response.json({}, { status: 200 });
};
