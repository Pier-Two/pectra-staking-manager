import axios, { type AxiosResponse } from "axios";
import { getBeaconChainURL } from "pec/constants/beaconchain";
import { ConsolidationModel, UserModel } from "pec/lib/database/models";
import { generateErrorResponse } from "pec/lib/utils";
import { ACTIVE_STATUS, INACTIVE_STATUS } from "pec/types/app";
import type { IResponse } from "pec/types/response";
import { env } from "pec/env";
import { z } from "zod";
import { BEACONCHAIN_OK_STATUS } from "pec/lib/constants";
import { sendEmailNotification } from "pec/lib/services/emailService";
import { EMAIL_NAMES } from "pec/constants/email";

const ConsolidationDataSchema = z.object({
  activationeligibilityepoch: z.number(),
  activationepoch: z.number(),
  balance: z.number(),
  effectivebalance: z.number(),
  exitepoch: z.number(),
  lastattestationslot: z.number(),
  name: z.string(),
  pubkey: z.string(),
  slashed: z.boolean(),
  status: z.string(),
  validatorindex: z.number(),
  withdrawableepoch: z.number(),
  withdrawalcredentials: z.string(),
  total_withdrawals: z.number(),
});

const ConsolidationResponseSchema = z.object({
  status: z.literal(BEACONCHAIN_OK_STATUS),
  data: ConsolidationDataSchema,
});

type ConsolidationResponse = z.infer<typeof ConsolidationResponseSchema>;
type ConsolidationData = z.infer<typeof ConsolidationDataSchema>;

const ACTIVE_CHECK = "active";
const EXITED_CHECK = "exited";

export const processConsolidations = async (): Promise<IResponse> => {
  try {
    debugger;
    const consolidations = await ConsolidationModel.find({
      status: ACTIVE_STATUS,
    });

    if (!consolidations)
      return {
        success: false,
        message: "Consolidation query failed to execute.",
      };

    if (consolidations.length === 0)
      return {
        success: true,
        message: "No active consolidations found, nothing to process.",
      };

    for (const consolidation of consolidations) {
      const { sourceTargetValidatorIndex, txHash, user } = consolidation;
      const currentUser = await UserModel.findById(user);

      if (!currentUser) {
        await markConsolidationInactive(sourceTargetValidatorIndex, txHash);
        continue;
      }

      const response = await axios.get<ConsolidationResponse>(
        `${getBeaconChainURL()}api/v1/validator/${sourceTargetValidatorIndex}?apikey=${env.BEACONCHAIN_API_KEY}`,
      );

      if (!isResponseValid(response)) continue;
      const consolidationData = response.data.data;
      if (!consolidationData) continue;

      const consolidated = isConsolidationProcessed(consolidationData);
      if (!consolidated) continue;

      const email = await sendEmailNotification({
        emailName: EMAIL_NAMES.PECTRA_STAKING_MANAGER_CONSOLIDATION_COMPLETE,
        metadata: {
          email: currentUser.email,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          companyName: currentUser.companyName,
          txHash,
        },
      });

      if (!email.success) {
        console.error("Error sending email notification:", email.message);
        continue;
      }

      debugger;
      await markConsolidationInactive(sourceTargetValidatorIndex, txHash);
    }

    return {
      success: true,
      message: "Consolidations processed successfully.",
    };
  } catch (error) {
    return generateErrorResponse(error);
  }
};

const isResponseValid = (
  response: AxiosResponse<ConsolidationResponse>,
): boolean => {
  if (!response || response.status !== 200) return false;
  const result = ConsolidationResponseSchema.safeParse(response.data);
  return result.success;
};

const markConsolidationInactive = async (
  sourceTargetValidatorIndex: number,
  txHash: string,
): Promise<void> => {
  await ConsolidationModel.updateOne(
    { sourceTargetValidatorIndex, txHash },
    { $set: { status: INACTIVE_STATUS } },
  );
};

const isConsolidationProcessed = (
  validatorData: ConsolidationData,
): boolean => {
  // A consolidation is processed when:
  // 1. Balance is 0
  // 2. Status is "exited" (not active)
  if (validatorData.balance > 0) return false;
  if (validatorData.status.toLowerCase().includes(ACTIVE_CHECK)) return false;
  if (
    validatorData.balance === 0 &&
    validatorData.status.toLowerCase().includes(EXITED_CHECK)
  )
    return true;
  return false;
};
