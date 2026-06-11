import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart"],
    },
    sitemap: `${getSiteUrl().origin}/sitemap.xml`,
  };
}
