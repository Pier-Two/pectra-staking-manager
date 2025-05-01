import type { MetadataRoute } from "next";

import { siteConfig } from "pec/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only generate sitemap in production
  if (process.env.NODE_ENV !== "production") {
    return [];
  }

  return [
    {
      url: `${siteConfig.baseUrl}/welcome`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
