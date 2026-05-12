import { brokerCategories, brokers, featuredRegions, verticalLabels } from "@/lib/brokers"

export type SiteLink = {
  href: string
  label: string
  description?: string
}

const extraRegions = [
  "United States",
  "Canada",
  "United Kingdom",
  "Europe",
  "Malaysia",
  "Indonesia",
  "Nigeria",
  "UAE",
]

const uniqueRegions = Array.from(new Set([...featuredRegions, ...extraRegions]))

function toParam(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-")
}

export const directionLinks: SiteLink[] = [
  {
    href: "/brokers",
    label: "All broker reviews",
    description: "Compare deposits, regions, risks, and source status.",
  },
  {
    href: "/brokers?risk=watch",
    label: "Risk watch",
    description: "High-risk brokers and weak source trails.",
  },
  {
    href: "/affiliate-programs/quotex",
    label: "Affiliate program reviews",
    description: "Partner terms, payout evidence, and restrictions.",
  },
  {
    href: "/clone-scripts/quotex",
    label: "White-label clone scripts",
    description: "Platform modules, PSPs, apps, and compliance notes.",
  },
]

export const categoryLinks: SiteLink[] = brokerCategories.map((category) => ({
  href: `/brokers?category=${category.slug}`,
  label: category.label,
  description: category.status === "live" ? "Live coverage" : "Planned category",
}))

export const regionLinks: SiteLink[] = uniqueRegions.map((region) => ({
  href: `/brokers?region=${toParam(region)}`,
  label: `${region} brokers`,
}))

export const brokerReviewLinks: SiteLink[] = brokers.map((broker) => ({
  href: `/brokers/${broker.slug}`,
  label: `${broker.name} review`,
  description: broker.verticals.map((vertical) => verticalLabels[vertical]).join(", "),
}))

export const affiliateLinks: SiteLink[] = brokers.map((broker) => ({
  href: `/affiliate-programs/${broker.slug}`,
  label: `${broker.name} affiliate program`,
}))

export const cloneScriptLinks: SiteLink[] = brokers.map((broker) => ({
  href: `/clone-scripts/${broker.slug}`,
  label: `${broker.name} clone script`,
}))
