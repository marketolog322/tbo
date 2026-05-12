import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  AlertTriangleIcon,
  AppleIcon,
  ArrowRightIcon,
  BadgeDollarSignIcon,
  BotIcon,
  Building2Icon,
  CheckCircle2Icon,
  Clock3Icon,
  FileWarningIcon,
  Globe2Icon,
  Layers3Icon,
  LineChartIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  ShieldIcon,
  WalletCardsIcon,
} from "lucide-react"

import { BrokerageLeadForm } from "@/components/site/brokerage-lead-form"
import { RiskBadge, SourceBadge } from "@/components/site/broker-status"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { brokers, getCloneScriptProfile, verticalLabels } from "@/lib/brokers"

type CloneScriptPageProps = {
  params: Promise<{
    slug: string
  }>
}

const launchStats = [
  { label: "Launch path", value: "2-4 weeks", detail: "Branding, setup, QA, launch." },
  { label: "Instruments", value: "850+", detail: "Margin CFD, OTC assets, real assets" },
  { label: "PSP coverage", value: "170", detail: "PSP library plus new PSP setup." },
  { label: "Apps", value: "iOS + Android", detail: "Mobile apps included." },
]

const moduleGroups = [
  {
    title: "Core structure",
    description: "CRM, billing, dealing desk, and servers.",
    icon: <Building2Icon className="size-5" />,
    items: ["CRM and Backoffice", "Billing processing backend", "Dealing desk", "Servers"],
  },
  {
    title: "Platform & Trading",
    description: "Traderoom, quotes, CFDs, OTC, and real assets.",
    icon: <LineChartIcon className="size-5" />,
    items: ["Web traderoom", "Liquidity & Quotes", "Margin CFD", "850+ instruments", "OTC Assets", "Real Assets"],
  },
  {
    title: "Growth modules",
    description: "Sales, marketing, and affiliate tools from day one.",
    icon: <MegaphoneIcon className="size-5" />,
    items: ["Sales module", "Marketing module", "Affiliate module", "Advanced customization"],
  },
  {
    title: "Payments & Apps",
    description: "PSP connections and mobile app flows.",
    icon: <WalletCardsIcon className="size-5" />,
    items: ["Connecting new PSP", "170 PSPs", "iOS & Android Apps", "Web traderoom"],
  },
  {
    title: "Compliance & Security",
    description: "KYC, antifraud, and launch controls.",
    icon: <ShieldIcon className="size-5" />,
    items: ["KYC", "Antifraud", "Risk rules", "Compliance workflows"],
  },
]

const launchSteps = [
  {
    step: "01",
    title: "Brand and product setup",
    text: "Set logo, colors, domain, copy, emails, and platform labels.",
  },
  {
    step: "02",
    title: "Payments and operating stack",
    text: "Connect PSPs, billing, CRM, backoffice, and user flows.",
  },
  {
    step: "03",
    title: "Trading environment",
    text: "Configure instruments, CFD, OTC, real assets, quotes, and desk rules.",
  },
  {
    step: "04",
    title: "QA and go-live",
    text: "Test signup, deposits, withdrawals, KYC, apps, and affiliates.",
  },
]

const commercialWins = [
  "Lower cost than building the full stack from scratch",
  "Go live faster with CRM, apps, PSPs, and affiliate tools",
  "Fully branded UI for your own product",
  "Core operations included from day one",
]

export function generateStaticParams() {
  return brokers.map((broker) => ({
    slug: broker.slug,
  }))
}

export async function generateMetadata({ params }: CloneScriptPageProps): Promise<Metadata> {
  const { slug } = await params
  const result = getCloneScriptProfile(slug)

  if (!result) {
    return {
      title: "Clone script page not found",
    }
  }

  return {
    title: `Build a Brokerage with ${result.broker.name} Clone Script`,
    description: `Build a branded brokerage with a ${result.broker.name}-style clone script, mobile apps, CRM, PSP integrations, affiliate module, and 850+ instruments.`,
  }
}

export default async function CloneScriptPage({ params }: CloneScriptPageProps) {
  const { slug } = await params
  const result = getCloneScriptProfile(slug)

  if (!result) {
    notFound()
  }

  const { broker, profile } = result
  const brokerLogoSrc = broker.slug === "quotex" ? "/brokers/quotex-logo.png" : undefined

  return (
    <main className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="overflow-hidden shadow-xs">
          <CardContent className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="success">White-label platform</Badge>
                <Badge variant="secondary">Launch in weeks</Badge>
                <RiskBadge riskLevel={broker.riskLevel} />
                <SourceBadge sourceConfidence={broker.sourceConfidence} />
                <Badge variant="muted">{profile.productAngle ?? "trading platform reference"}</Badge>
                {broker.verticals.map((vertical) => (
                  <Badge key={vertical} variant="muted">
                    {verticalLabels[vertical]}
                  </Badge>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  {brokerLogoSrc ? (
                    <span className="flex size-12 items-center justify-center rounded-md bg-black p-2 ring-1 ring-border">
                      <img
                        src={brokerLogoSrc}
                        alt={`${broker.name} logo`}
                        width={1200}
                        height={630}
                        className="max-h-full max-w-full object-contain"
                      />
                    </span>
                  ) : null}
                  <div>
                    <p className="font-semibold">Brokerage launch package</p>
                    <p className="text-muted-foreground text-sm font-medium">{broker.name} clone-script reference</p>
                  </div>
                </div>
                <h1 className="max-w-4xl text-3xl font-semibold tracking-normal sm:text-4xl lg:text-5xl">
                  Build a Brokerage with {broker.name} Clone Script
                </h1>
                <p className="max-w-3xl text-base leading-7 text-muted-foreground">
                  Launch a branded trading platform with web, apps, CRM, PSP connections, affiliate tools, and a
                  configurable brand layer.
                </p>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {commercialWins.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-6">
                    <CheckCircle2Icon className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <a href="#lead-form">
                    Request launch quote
                    <ArrowRightIcon aria-hidden="true" />
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="#modules">View included modules</a>
                </Button>
              </div>
            </div>

            <div className="self-start rounded-md bg-primary/5 p-4 ring-1 ring-primary/15 sm:p-5">
              <div className="flex items-center gap-2">
                <Clock3Icon className="size-4 text-primary" aria-hidden="true" />
                <h2 className="text-lg font-semibold">Fast launch package</h2>
              </div>
              <div className="mt-5 divide-y">
                <PackageRow label="Launch path" value="2-4 weeks" />
                <PackageRow label="Branding" value="Full white-label UI" />
                <PackageRow label="Reference" value={profile.productAngle ?? "Trading platform"} />
                <PackageRow label="Apps" value={<PlatformIcons />} />
                <PackageRow label="PSP stack" value="170 PSPs + new PSP" />
                <PackageRow label="Instruments" value="850+ instruments" />
              </div>
              <Separator className="my-4" />
              <p className="text-sm leading-6 text-muted-foreground">
                For teams that want a faster path to market with trading, payments, CRM, sales, marketing, and
                affiliates already connected.
              </p>
            </div>
          </CardContent>
        </Card>

        <BrokerageLeadForm brokerName={broker.name} brokerSlug={broker.slug} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {launchStats.map((stat) => (
          <Card key={stat.label} className="gap-3 shadow-xs">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              {stat.label === "Apps" ? (
                <div className="mt-1">
                  <PlatformIcons align="start" />
                </div>
              ) : (
                <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
              )}
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{stat.detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section id="modules" className="grid scroll-mt-24 gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers3Icon className="size-4 text-primary" aria-hidden="true" />
                Modules and infrastructure
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Everything needed to move from concept to launch without building each subsystem separately.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-2">
              {moduleGroups.map((group) => (
                <FeatureGroup key={group.title} {...group} />
              ))}
              <FeatureGroup
                title={`${broker.name} reference scope`}
                description="Broker-specific product assumptions for this template."
                icon={<Globe2Icon className="size-5" />}
                items={profile.buildScope}
              />
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Launch roadmap</CardTitle>
              <p className="text-sm text-muted-foreground">A practical path for getting a branded platform live in weeks.</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {launchSteps.map((step) => (
                  <div key={step.step} className="rounded-md border p-4">
                    <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                      {step.step}
                    </span>
                    <h2 className="mt-3 font-semibold">{step.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-5">
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeDollarSignIcon className="size-4 text-primary" aria-hidden="true" />
                Operator notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(profile.operatorNotes ?? [
                "Avoid assembling traderoom, CRM, billing, apps, PSP, and affiliate logic as separate projects.",
                "Launch planning can focus on brand, traffic, compliance, payment partners, and operations.",
                "The front-end, app presentation, language, and customer journey can be customized around your own brand.",
              ]).map((note) => (
                <CommercialPoint key={note} title="Launch note" text={note} />
              ))}
            </CardContent>
          </Card>

          <Card className="border-amber-300/50 bg-amber-50/70 shadow-none dark:bg-amber-400/10">
            <CardContent className="flex gap-3 py-4">
              <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
              <p className="text-sm leading-6 text-amber-950 dark:text-amber-100">
                Build your own compliant white-label brand. Do not reuse protected broker assets, impersonate {broker.name},
                or launch trading/payment products without legal, licensing, KYC, and risk controls.
              </p>
            </CardContent>
          </Card>

        </aside>
      </section>

      <section>
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileWarningIcon className="size-4 text-amber-600" aria-hidden="true" />
              Compliance checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.complianceNotes.map((note) => (
              <div key={note} className="flex items-start gap-2 rounded-md border p-3 text-sm leading-6">
                <AlertTriangleIcon className="mt-1 size-4 shrink-0 text-amber-600" aria-hidden="true" />
                <span>{note}</span>
              </div>
            ))}
            {(profile.riskControls ?? []).map((note) => (
              <div key={note} className="flex items-start gap-2 rounded-md border p-3 text-sm leading-6">
                <ShieldCheckIcon className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{note}</span>
              </div>
            ))}
            <div className="flex items-start gap-2 rounded-md border p-3 text-sm leading-6">
              <ShieldCheckIcon className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>Configure KYC, antifraud, risk monitoring, withdrawal controls, and jurisdiction rules before launch.</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

function PackageRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-4 py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

function PlatformIcons({ align = "end" }: { align?: "start" | "end" }) {
  return (
    <span className={`flex flex-wrap gap-2 ${align === "end" ? "justify-end" : "justify-start"}`}>
      <span className="inline-flex items-center gap-1.5 rounded-md bg-background/80 px-2 py-1 ring-1 ring-border">
        <AppleIcon className="size-3.5" aria-hidden="true" />
        iOS
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-md bg-background/80 px-2 py-1 ring-1 ring-border">
        <BotIcon className="size-3.5" aria-hidden="true" />
        Android
      </span>
    </span>
  )
}

function FeatureGroup({
  title,
  description,
  icon,
  items,
}: {
  title: string
  description: string
  icon: React.ReactNode
  items: string[]
}) {
  return (
    <div className="rounded-md border p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="secondary" className="whitespace-normal leading-5">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function CommercialPoint({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center gap-2">
        <CheckCircle2Icon className="size-4 text-primary" aria-hidden="true" />
        <h2 className="font-medium">{title}</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  )
}
