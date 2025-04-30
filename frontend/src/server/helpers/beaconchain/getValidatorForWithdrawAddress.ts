import { SupportedNetworkIds } from "pec/constants/chain";

export const getValidatorsForWithdrawAddress = async (
  withdrawAddress: string,
  network: SupportedNetworkIds,
): Promise<IResponse<ValidatorResponse["data"]>> => {
  const response = await getBeaconChainAxios(network).get(
    `/api/v1/validator/withdrawals/${withdrawAddress}`,
  );

  const parsedData = ValidatorResponseSchema.safeParse(response.data);

  if (!parsedData.success) {
    return generateErrorResponse(parsedData.error);
  }

  return {
    success: true,
    data: parsedData.data.data,
  };
};
