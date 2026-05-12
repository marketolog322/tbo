import Link from "next/link"
import {
  AlertTriangleIcon,
  BadgeCheckIcon,
  BarChart3Icon,
  BookOpenCheckIcon,
  BoxesIcon,
  CalendarClockIcon,
  ChevronRightIcon,
  Globe2Icon,
  HomeIcon,
  ListChecksIcon,
  ListFilterIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  Table2Icon,
} from "lucide-react"

import { BrokerCard } from "@/components/site/broker-card"
import { BrokerTable } from "@/components/site/broker-table"
import { FilterBar } from "@/components/site/filter-bar"
import { MetricCard } from "@/components/site/metric-card"
import { RiskBadge, SourceBadge } from "@/components/site/broker-status"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  brokerCategories,
  brokers,
  featuredRegions,
  formatDate,
  getVerificationQueueCount,
  getVerifiedBasicsCount,
  verticalLabels,
} from "@/lib/brokers"

const railItems = [
  { label: "Overview", href: "#overview", icon: HomeIcon, badge: `${brokers.length}` },
  { label: "Top brokers", href: "#top-brokers", icon: BadgeCheckIcon },
  { label: "Categories", href: "#categories", icon: BoxesIcon },
  { label: "Compare", href: "#broker-table", icon: Table2Icon },
  { label: "Risk watch", href: "#risk-watch", icon: ShieldAlertIcon },
  { label: "Methodology", href: "#methodology", icon: BookOpenCheckIcon },
]

const topBrokers = brokers.slice(0, 4)
const riskWatch = brokers.filter((broker) => broker.riskLevel === "very_high" || broker.sourceConfidence === "needs_verification")
const latestUpdates = [...brokers]
  .sort((a, b) => new Date(`${b.lastVerifiedAt}T00:00:00Z`).getTime() - new Date(`${a.lastVerifiedAt}T00:00:00Z`).getTime())
  .slice(0, 5)

export default function Home() {
  return (
    <main className="bg-background">
      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-[105px] hidden h-[calc(100dvh-105px)] border-r bg-card px-4 py-6 lg:block">
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground px-2 text-xs font-medium uppercase tracking-wide">Broker directory</p>
              <nav className="mt-3 space-y-1" aria-label="Homepage sections">
                {railItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className="hover:bg-accent hover:text-accent-foreground flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="size-4" aria-hidden="true" />
                        {item.label}
                      </span>
                      {item.badge ? (
                        <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">{item.badge}</span>
                      ) : null}
                    </a>
                  )
                })}
              </nav>
            </div>

            <Separator />

            <div className="space-y-3 rounded-lg border bg-background p-3">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="text-primary size-4" aria-hidden="true" />
                <p className="text-sm font-medium">How we label brokers</p>
              </div>
              <p className="text-muted-foreground text-xs leading-5">
                We separate official facts from weak claims, show risk labels, and keep verification dates visible.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground px-2 text-xs font-medium uppercase tracking-wide">Region shortcuts</p>
              <div className="flex flex-wrap gap-2 px-2">
                {featuredRegions.map((region) => (
                  <Badge key={region} variant="muted">
                    {region}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <section id="overview" className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">Broker reviews</Badge>
                  <Badge variant="muted">Deposits</Badge>
                  <Badge variant="muted">Restrictions</Badge>
                  <Badge variant="muted">Source checks</Badge>
                </div>
                <div className="space-y-3">
                  <h1 className="max-w-4xl text-3xl font-semibold tracking-normal sm:text-4xl lg:text-5xl">
                    Find broker reviews, risk notes, deposits, and verified sources.
                  </h1>
                  <p className="text-muted-foreground max-w-3xl text-base leading-7">
                    Compare brokers by product type, minimum deposit, demo access, restricted regions, source quality,
                    and last verification date. No fake ratings, no hidden risk labels.
                  </p>
                </div>
                <FilterBar compact />
              </div>

              <Card className="shadow-xs">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ListChecksIcon className="text-primary size-4" aria-hidden="true" />
                    Popular broker checks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {topBrokers.map((broker) => (
                    <Link
                      key={broker.slug}
                      href={`/brokers/${broker.slug}`}
                      className="group flex items-center justify-between gap-3 rounded-md border px-3 py-2.5 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span>
                        <span className="block font-medium">{broker.name}</span>
                        <span className="text-muted-foreground mt-0.5 block text-xs">
                          {broker.minDeposit} deposit · verified {formatDate(broker.lastVerifiedAt)}
                        </span>
                      </span>
                      <ChevronRightIcon className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                icon={<BarChart3Icon className="size-4" aria-hidden="true" />}
                value={`${brokers.length}`}
                label="Tracked brokers"
                detail="Real broker brands with source status and review pages."
              />
              <MetricCard
                icon={<BadgeCheckIcon className="size-4" aria-hidden="true" />}
                value={`${getVerifiedBasicsCount()}`}
                label="Official basics found"
                detail="At least one official source supports the core profile."
              />
              <MetricCard
                icon={<CalendarClockIcon className="size-4" aria-hidden="true" />}
                value={`${getVerificationQueueCount()}`}
                label="Needs follow-up"
                detail="Weak claims stay marked until better evidence is added."
              />
            </div>
          </section>

          <section id="top-brokers" className="space-y-5 px-4 pb-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Top tracked brokers</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Quick cards for the brokers users are most likely to research first.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/brokers">Open full directory</Link>
              </Button>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {topBrokers.map((broker) => (
                <BrokerCard key={broker.slug} broker={broker} />
              ))}
            </div>
          </section>

          <section id="categories" className="space-y-5 px-4 pb-6 sm:px-6 lg:px-8">
            <div>
              <h2 className="text-2xl font-semibold">Broker categories</h2>
              <p className="text-muted-foreground mt-1 text-sm">Browse by market type and review focus.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-4">
              {brokerCategories.map((category) => (
                <Card key={category.slug} className="gap-4 shadow-xs">
                  <CardHeader className="flex-row items-center justify-between gap-3">
                    <CardTitle className="text-base">{category.label}</CardTitle>
                    <Badge variant={category.status === "live" ? "success" : "muted"}>
                      {category.status === "live" ? "Live" : "Soon"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-6">{category.description}</p>
                    <Button asChild variant="outline" size="sm">
                      <a href="#broker-table">Compare brokers</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="grid gap-6 px-4 pb-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
            <Card id="risk-watch" className="shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangleIcon className="text-amber-600 size-5" aria-hidden="true" />
                  Risk watch
                </CardTitle>
                <p className="text-muted-foreground text-sm">Brokers with very high risk labels or weak source trails.</p>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {riskWatch.map((broker) => (
                  <div key={broker.slug} className="space-y-3 rounded-md border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/brokers/${broker.slug}`} className="font-medium hover:text-primary">
                          {broker.name}
                        </Link>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {broker.verticals.map((vertical) => verticalLabels[vertical]).join(", ")}
                        </p>
                      </div>
                      <RiskBadge riskLevel={broker.riskLevel} />
                    </div>
                    <p className="text-sm leading-6">{broker.keyNotes[0]}</p>
                    <SourceBadge sourceConfidence={broker.sourceConfidence} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="self-start shadow-xs">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe2Icon className="text-primary size-4" aria-hidden="true" />
                  Latest verification updates
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y">
                {latestUpdates.map((broker) => (
                  <div key={broker.slug} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <Link href={`/brokers/${broker.slug}`} className="font-medium hover:text-primary">
                      {broker.name}
                    </Link>
                    <span className="text-muted-foreground text-xs">{formatDate(broker.lastVerifiedAt)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section id="broker-table" className="space-y-5 px-4 pb-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Broker comparison table</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Scan product type, minimum deposit, demo account, restrictions, and evidence status.
                </p>
              </div>
              <Button asChild variant="outline">
                <a href="#methodology">
                  <ListFilterIcon aria-hidden="true" />
                  Review method
                </a>
              </Button>
            </div>
            <Card className="py-0 shadow-xs">
              <BrokerTable brokers={brokers} />
            </Card>
          </section>

          <section id="methodology" className="px-4 pb-8 sm:px-6 lg:px-8">
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle>How the directory works</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm leading-6 md:grid-cols-3">
                <MethodItem title="Facts first" text="Minimum deposits, demo access, assets, and regions are shown separately from claims." />
                <MethodItem title="Risk is visible" text="High-risk products and weak evidence are labeled instead of hidden." />
                <MethodItem title="Sources stay linked" text="Broker pages keep official and third-party sources with verification dates." />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  )
}

function MethodItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-md border p-3">
      <p className="font-medium">{title}</p>
      <p className="text-muted-foreground mt-1 text-sm">{text}</p>
    </div>
  )
}
