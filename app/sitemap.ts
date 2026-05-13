import type { MetadataRoute } from "next"

import { brokers } from "@/lib/brokers"
import { absoluteUrl } from "@/lib/site-url"

const STATIC_LAST_MODIFIED = new Date("2026-05-13")

function brokerLastModified(lastVerifiedAt: string) {
  return new Date(lastVerifiedAt)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/brokers"),
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ]

  const brokerRoutes: MetadataRoute.Sitemap = brokers.flatMap((broker) => {
    const lastModified = brokerLastModified(broker.lastVerifiedAt)

    return [
      {
        url: absoluteUrl(`/brokers/${broker.slug}`),
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: absoluteUrl(`/affiliate-programs/${broker.slug}`),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.65,
      },
      {
        url: absoluteUrl(`/clone-scripts/${broker.slug}`),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.65,
      },
    ] satisfies MetadataRoute.Sitemap
  })

  return [...staticRoutes, ...brokerRoutes]
}
