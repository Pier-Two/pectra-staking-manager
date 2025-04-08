"use client";

import type { ParentComponent } from "pec/types/components";
import { ThirdwebProvider } from "thirdweb/react";

export const NetworkContextProvider = ({ children }: ParentComponent) => {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
};
