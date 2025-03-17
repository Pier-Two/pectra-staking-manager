"use client";

import { api } from "pec/trpc/react";
import { ValidatorTableView } from "./validatorTable.view";
import { useActiveAccount } from "thirdweb/react";

export const ValidatorTable = () => {
  const connectedAccount = useActiveAccount();
  const { data } = api.validators.getValidators.useQuery({
    address: connectedAccount?.address ?? "",
  });
  return <ValidatorTableView data={data ?? []} />;
};
