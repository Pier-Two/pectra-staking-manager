import type { MetadataRoute } from "next";
import { siteConfig } from "pec/constants/site";

export default function robots(): MetadataRoute.Robots {
  // Only generate robots rules in production
  if (process.env.NODE_ENV !== "production") {
    return {
      rules: {
        userAgent: "*",
        // disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      // disallow: "/",
      allow: ["/welcome", "/sitemap.xml", "/charts"],
    },
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
  };
}
