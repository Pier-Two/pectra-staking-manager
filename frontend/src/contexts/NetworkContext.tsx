"use client";

import { ThirdwebProvider } from "thirdweb/react";

import type { ParentComponent } from "pec/types/components";

export const NetworkContextProvider = ({ children }: ParentComponent) => {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
};
