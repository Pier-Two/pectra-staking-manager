import { api } from "pec/trpc/server";
import { ValidatorTableView } from "./validatorTable.view";

export const ValidatorTable = async () => {
  const data = await api.validators.getValidators({ address: "XXX" });
  return <ValidatorTableView data={data ?? []} />;
};
