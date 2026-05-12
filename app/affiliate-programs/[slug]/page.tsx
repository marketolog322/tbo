import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  BadgeDollarSignIcon,
  BanIcon,
  CheckCircle2Icon,
  ClockIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  FileSearchIcon,
  ShieldAlertIcon,
} from "lucide-react"

import { AffiliateDisclosure } from "@/components/site/disclosure"
import { RiskBadge, SourceBadge } from "@/components/site/broker-status"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate, getAffiliateProgram } from "@/lib/brokers"

type AffiliatePageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: AffiliatePageProps): Promise<Metadata> {
  const { slug } = await params
  const result = getAffiliateProgram(slug)

  if (!result) {
    return {
      title: "Affiliate program not found",
    }
  }

  return {
    title: `${result.broker.name} Affiliate Program`,
    description: `${result.program.name} verification file for CPA, revshare, payout methods, restrictions, and source confidence.`,
  }
}

export default async function AffiliateProgramPage({ params }: AffiliatePageProps) {
  const { slug } = await params
  const result = getAffiliateProgram(slug)

  if (!result) {
    notFound()
  }

  const { broker, program } = result

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Affiliate verification file</Badge>
            <RiskBadge riskLevel={broker.riskLevel} />
            <SourceBadge sourceConfidence={broker.sourceConfidence} />
          </div>
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm font-medium">Affiliate program review</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">{program.name}</h1>
            <p className="text-muted-foreground max-w-3xl text-base leading-7">
              Commercial claims for {broker.name} are separated from verified broker facts. We show the payout model only
              when there is a source trail, and keep weak CPA, cookie, geo, or payment claims marked as verification gaps.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a href={program.applicationUrl} rel="sponsored nofollow" target="_blank">
                Open source / program page
                <ExternalLinkIcon aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/brokers/${broker.slug}`}>Read broker profile</Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Program snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgramMetric icon={<BadgeDollarSignIcon className="size-4" />} label="CPA range" value={program.cpaRange} />
            <ProgramMetric icon={<FileSearchIcon className="size-4" />} label="Evidence status" value={program.evidenceStatus ?? "Commercial terms need source verification"} />
            <ProgramMetric icon={<ClockIcon className="size-4" />} label="Cookie duration" value={program.cookieDuration} />
            <ProgramMetric icon={<CreditCardIcon className="size-4" />} label="Payout frequency" value={program.payoutFrequency} />
          </CardContent>
        </Card>
      </section>

      <AffiliateDisclosure />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Commercial model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProgramMetric icon={<BadgeDollarSignIcon className="size-4" />} label="Model" value={program.model ?? "Needs verification"} />
            <ProgramMetric icon={<BadgeDollarSignIcon className="size-4" />} label="CPA" value={program.cpaRange} />
            <ProgramMetric icon={<BadgeDollarSignIcon className="size-4" />} label="Revshare" value={program.revshareRange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment methods</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {program.paymentMethods.map((method) => (
              <Badge key={method} variant="secondary">
                {method}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Restricted geos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {program.restrictedGeos.map((geo) => (
              <div key={geo} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                <BanIcon className="text-destructive size-4" aria-hidden="true" />
                <span>{geo}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Affiliate due diligence notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 leading-7">
            <p className="text-muted-foreground">
              This program file is not an endorsement. Broker affiliate offers can change by entity, traffic source,
              product type, and country, so commercial claims stay separated from the broker safety review.
            </p>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <ProgramChecklist
                title="What we can track"
                icon={<CheckCircle2Icon className="size-4" />}
                items={program.trackingNotes ?? ["Program page exists, but detailed tracking terms need verification."]}
              />
              <ProgramChecklist
                title="What needs caution"
                icon={<ShieldAlertIcon className="size-4" />}
                items={program.dueDiligenceNotes ?? ["Verify payout terms, restricted geos, traffic rules, and legal disclosures before promotion."]}
                warning
              />
            </div>
            <p className="text-muted-foreground text-sm">Last checked {formatDate(broker.lastVerifiedAt)}.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Source trail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {broker.sources.map((source) => (
              <a
                key={`${source.publisher}-${source.title}`}
                href={source.url}
                className="block rounded-md border p-3 hover:bg-muted/50"
                rel="nofollow"
                target="_blank"
              >
                <span className="block text-sm font-medium">{source.title}</span>
                <span className="text-muted-foreground block text-xs">
                  {source.publisher} · accessed {formatDate(source.accessedAt)}
                </span>
              </a>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function ProgramMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border p-3">
      <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">{icon}</span>
      <span>
        <span className="text-muted-foreground block text-xs">{label}</span>
        <span className="block text-sm font-medium">{value}</span>
      </span>
    </div>
  )
}

function ProgramChecklist({
  title,
  icon,
  items,
  warning = false,
}: {
  title: string
  icon: ReactNode
  items: string[]
  warning?: boolean
}) {
  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center gap-2">
        <span className={warning ? "text-amber-600" : "text-primary"}>{icon}</span>
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-muted-foreground text-sm leading-6">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
