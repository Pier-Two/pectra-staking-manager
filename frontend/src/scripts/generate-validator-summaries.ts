import { config } from "dotenv";
import { ObjectId } from "mongodb";
config();

import { connect, ValidatorSummaryModel } from "pec/server/database/models";

const dataToCopy = new ObjectId("6819931ddb1b1cde4f6b0637");

const dateRangeToCopyTo = {
  from: new Date("2025-04-23"),
  to: new Date("2025-05-05"),
};

const main = async () => {
  await connect();

  const validatorSummary =
    await ValidatorSummaryModel.findById(dataToCopy).orFail();

  const date = dateRangeToCopyTo.from;

  while (date <= dateRangeToCopyTo.to) {
    const newValidatorSummary = await ValidatorSummaryModel.create({
      ...validatorSummary.toObject(),
      _id: new ObjectId(),
      timestamp: date,
    });

    console.log(
      `Created validator summary for ${date.toISOString()} for ${newValidatorSummary.withdrawalCredentialPrefix}`,
    );

    date.setDate(date.getDate() + 1);
  }
};

void main();
