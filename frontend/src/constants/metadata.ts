import { siteConfig } from "pec/constants/site";

export const title = (title: string) => `${title} | ${siteConfig.titleSuffix}`;
