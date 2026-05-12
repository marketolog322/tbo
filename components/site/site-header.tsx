import Link from "next/link"
import {
  Building2Icon,
  ChevronDownIcon,
  Globe2Icon,
  Layers3Icon,
  SearchIcon,
  ShieldCheckIcon,
  TagsIcon,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  affiliateLinks,
  brokerReviewLinks,
  categoryLinks,
  cloneScriptLinks,
  directionLinks,
  regionLinks,
  type SiteLink,
} from "@/components/site/site-links"

const navGroups = [
  {
    label: "Directory",
    icon: Building2Icon,
    links: directionLinks,
  },
  {
    label: "Brokers",
    icon: Layers3Icon,
    links: brokerReviewLinks,
  },
  {
    label: "Categories",
    icon: TagsIcon,
    links: categoryLinks,
  },
  {
    label: "Regions",
    icon: Globe2Icon,
    links: regionLinks,
  },
]

export function SiteHeader() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center" aria-label="TBO Broker Directory home">
          <img
            src="/brand/tbo-broker-directory-logo.png"
            alt="TBO Broker Directory"
            width={244}
            height={50}
            className="h-8 w-auto max-w-[185px] object-contain sm:h-9 sm:max-w-[240px]"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navGroups.map((group) => (
            <NavDropdown key={group.label} icon={group.icon} label={group.label} links={group.links} />
          ))}
          <NavDropdown
            label="Business"
            icon={Layers3Icon}
            links={[
              { href: "/affiliate-programs/quotex", label: "Affiliate reviews", description: "Programs by broker" },
              { href: "/clone-scripts/quotex", label: "Clone scripts", description: "White-label platform pages" },
              ...affiliateLinks.slice(0, 4),
              ...cloneScriptLinks.slice(0, 4),
            ]}
          />
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/brokers">
              <SearchIcon aria-hidden="true" />
              Find brokers
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation menu">
                <ChevronDownIcon aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-[70vh] w-80 overflow-y-auto">
              <DropdownMenuLabel>Broker directory</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <MobileLinkSection title="Main" links={directionLinks} />
              <MobileLinkSection title="Broker reviews" links={brokerReviewLinks} />
              <MobileLinkSection title="Categories" links={categoryLinks} />
              <MobileLinkSection title="Regions" links={regionLinks} />
              <MobileLinkSection title="Affiliate programs" links={affiliateLinks.slice(0, 6)} />
              <MobileLinkSection title="Clone scripts" links={cloneScriptLinks.slice(0, 6)} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

function NavDropdown({ icon: Icon, label, links }: { icon: LucideIcon; label: string; links: SiteLink[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Icon aria-hidden="true" />
          {label}
          <ChevronDownIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[360px] p-2">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <div className="grid gap-1">
          {links.slice(0, 10).map((link) => (
            <DropdownMenuItem key={`${label}-${link.href}-${link.label}`} asChild>
              <Link href={link.href} className="flex flex-col items-start gap-0.5 py-2">
                <span>{link.label}</span>
                {link.description ? <span className="text-muted-foreground text-xs">{link.description}</span> : null}
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileLinkSection({ title, links }: { title: string; links: SiteLink[] }) {
  return (
    <>
      <DropdownMenuLabel className="text-muted-foreground text-xs uppercase tracking-wide">{title}</DropdownMenuLabel>
      {links.map((link) => (
        <DropdownMenuItem key={`${title}-${link.href}-${link.label}`} asChild>
          <Link href={link.href}>{link.label}</Link>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
    </>
  )
}

export function TrustStrip() {
  return (
    <div className="border-b bg-card">
      <div className="text-muted-foreground mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-xs sm:px-6">
        <ShieldCheckIcon className="text-primary size-3.5" aria-hidden="true" />
        <span>Source-backed broker research. High-risk products are marked clearly.</span>
      </div>
    </div>
  )
}
