// import { api } from "pec/trpc/react";
import { api } from "pec/trpc/server";
import { ValidatorTableView } from "./validatorTable.view";

export const ValidatorTable = async () => {
  // const { data } = api.validators.getValidators.useQuery({ address: "0x1234" });
  const data = await api.validators.getValidators({ address: "0x1234" });
  return <ValidatorTableView data={data ?? []} />;
};
