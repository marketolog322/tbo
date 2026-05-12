import Link from "next/link"

import {
  affiliateLinks,
  brokerReviewLinks,
  categoryLinks,
  cloneScriptLinks,
  directionLinks,
  regionLinks,
  type SiteLink,
} from "@/components/site/site-links"

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="grid gap-8 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="space-y-3">
            <Link href="/" className="inline-flex" aria-label="TBO Broker Directory home">
              <img
                src="/brand/tbo-broker-directory-logo.png"
                alt="TBO Broker Directory"
                width={244}
                height={50}
                className="h-8 w-auto max-w-[230px] object-contain"
              />
            </Link>
            <p className="text-muted-foreground max-w-sm text-sm leading-6">
              Source-backed broker research across reviews, categories, regions, affiliate programs, and white-label
              platform pages.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[0.85fr_0.9fr_1.05fr_1fr_1.3fr]">
            <FooterGroup title="Directory" links={directionLinks} />
            <FooterGroup title="Categories" links={categoryLinks} />
            <FooterGroup title="Broker reviews" links={brokerReviewLinks} />
            <FooterGroup title="Regions" links={regionLinks} />
            <div className="space-y-6">
              <FooterGroup title="Affiliate programs" links={affiliateLinks.slice(0, 8)} />
              <FooterGroup title="Clone scripts" links={cloneScriptLinks.slice(0, 8)} />
            </div>
          </div>
        </div>

        <div className="text-muted-foreground mt-8 flex flex-col gap-2 border-t pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TBO Broker Directory.</p>
          <p>Broker information is source dated and may change by region.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterGroup({ title, links }: { title: string; links: SiteLink[] }) {
  return (
    <div>
      <h2 className="text-foreground text-sm font-semibold">{title}</h2>
      <ul className="mt-3 space-y-2.5">
        {links.map((link) => (
          <li key={`${title}-${link.href}-${link.label}`}>
            <Link href={link.href} className="text-muted-foreground hover:text-foreground text-sm leading-5">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
