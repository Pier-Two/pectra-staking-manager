import type { ReactNode } from "react";

export type ChildrenProp = {
  children: ReactNode | Array<ReactNode>;
};

export const ACTIVE_STATUS = "ACTIVE";
export const INACTIVE_STATUS = "INACTIVE";

export const DatabaseDocumentStatuses = [
  ACTIVE_STATUS,
  INACTIVE_STATUS,
] as const;
