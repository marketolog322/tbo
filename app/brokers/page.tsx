import type { Metadata } from "next"
import Link from "next/link"
import { CalendarCheckIcon, DatabaseZapIcon, ShieldAlertIcon } from "lucide-react"

import { AffiliateDisclosure } from "@/components/site/disclosure"
import { BrokerCard } from "@/components/site/broker-card"
import { BrokerTable } from "@/components/site/broker-table"
import { FilterBar } from "@/components/site/filter-bar"
import { MetricCard } from "@/components/site/metric-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { brokers, getVerificationQueueCount, getVerifiedBasicsCount } from "@/lib/brokers"

export const metadata: Metadata = {
  title: "Broker Directory",
  description:
    "Compare broker profiles by source confidence, category, restrictions, minimum deposit, demo availability, and verification date.",
}

export default function BrokersPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_0.35fr]">
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm font-medium">Broker directory</p>
          <h1 className="max-w-3xl text-3xl font-semibold sm:text-4xl">
            Scan brokers by category, source confidence, restrictions, and verification status.
          </h1>
          <p className="text-muted-foreground max-w-3xl leading-7">
            The initial dataset is binary-options focused, but the structure supports forex, crypto, CFD, and other
            broker categories.
          </p>
        </div>
        <AffiliateDisclosure compact />
      </section>

      <FilterBar />

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={<DatabaseZapIcon className="size-4" aria-hidden="true" />}
          value={`${brokers.length}`}
          label="Tracked brands"
          detail="Quotex, Pocket Option, IQ Option, Olymp Trade, Binomo, Deriv, ExpertOption, Binarium."
        />
        <MetricCard
          icon={<ShieldAlertIcon className="size-4" aria-hidden="true" />}
          value={`${getVerificationQueueCount()}`}
          label="Verification queue"
          detail="Commercial or regulatory claims that need better evidence."
        />
        <MetricCard
          icon={<CalendarCheckIcon className="size-4" aria-hidden="true" />}
          value={`${getVerifiedBasicsCount()}`}
          label="Official basics"
          detail="Profiles with at least one official source for core facts."
        />
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Broker cards</h2>
            <p className="text-muted-foreground mt-1 text-sm">Fast review summaries before the dense table view.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/brokers/quotex">Open Quotex profile</Link>
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {brokers.map((broker) => (
            <BrokerCard key={broker.slug} broker={broker} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold">Comparison rows</h2>
          <p className="text-muted-foreground mt-1 text-sm">Dense, Shadcn-style data for repeated scanning.</p>
        </div>
        <Card className="py-0">
          <BrokerTable brokers={brokers} />
        </Card>
      </section>
    </main>
  )
}
