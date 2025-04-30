/**
 * Site configuration
 * Contains shared configuration values used across the application
 */

export const siteConfig = {
  /**
   * The base URL of the site
   * Defaults to localhost in development
   */
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pectrastaking.com",
  title: "Pectra Staking Manager",
  titleSuffix: "Pectra Staking Manager",
} as const;
