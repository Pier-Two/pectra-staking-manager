"use client";

import { api } from "pec/trpc/react";

export const ValidatorTable = () => {
  const {data} = api.validators.getValidators.useQuery({address: "0x1234"});

  console.log(data);

  return (<div><h1>Validator Table</h1></div>);
};
