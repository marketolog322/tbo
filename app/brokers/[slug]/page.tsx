import type { Metadata } from "next"
import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import {
  AlertTriangleIcon,
  CalendarClockIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  ShieldAlertIcon,
  StarIcon,
  XCircleIcon,
} from "lucide-react"

import { ReviewBadge, RiskBadge, SourceBadge } from "@/components/site/broker-status"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Broker, BrokerReview } from "@/lib/brokers"
import { formatDate, getBroker, sourceConfidenceLabels, verticalLabels } from "@/lib/brokers"

type BrokerPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BrokerPageProps): Promise<Metadata> {
  const { slug } = await params
  const broker = getBroker(slug)

  if (!broker) {
    return {
      title: "Broker not found",
    }
  }

  return {
    title: `${broker.name} Review`,
    description: `${broker.name} broker review with ratings, safety checks, trading conditions, restrictions, sources, and FAQ.`,
  }
}

export default async function BrokerReviewPage({ params }: BrokerPageProps) {
  const { slug } = await params
  const broker = getBroker(slug)

  if (!broker) {
    notFound()
  }

  const review = broker.review ?? createFallbackReview(broker)
  const hasFullReview = Boolean(broker.review)
  const jsonLd = createReviewSchema(broker, review, hasFullReview)
  const regulationScore = review.ratings.find((rating) => rating.label === "Regulation")?.score ?? 0
  const feesScore = review.ratings.find((rating) => rating.label === "Fees")?.score ?? 0
  const restrictedRegions = broker.restrictedRegions.slice(0, 3).join(", ")
  const verifiedFact =
    broker.minDeposit === "Needs verification" ? "Deposit pending" : `${summarizeMinimumDeposit(broker.minDeposit)} deposit`

  return (
    <main className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="overflow-hidden shadow-xs">
          <CardContent className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[300px_minmax(0,1fr)]">
            <div className="order-2 space-y-4 lg:order-1">
              <BrokerLogo broker={broker} />
              <div className="grid gap-2">
                <QuickFact label="Min. deposit" value={broker.minDeposit} />
                <QuickFact label="Trust score" value={hasFullReview ? `${review.trustScore}/100` : "Pending"} />
                <QuickFact label="Regulation" value={review.regulation} tone="warning" />
                <QuickFact label="Restricted regions" value={`${restrictedRegions} + more checks`} tone="warning" />
              </div>
            </div>

            <div className="order-1 space-y-5 lg:order-2">
              <div className="flex flex-wrap items-center gap-2">
                <ReviewBadge broker={broker} />
                <RiskBadge riskLevel={broker.riskLevel} />
                <SourceBadge sourceConfidence={broker.sourceConfidence} />
                {broker.verticals.map((vertical) => (
                  <Badge key={vertical} variant="muted">
                    {verticalLabels[vertical]}
                  </Badge>
                ))}
              </div>

              <div className="space-y-3">
                <p className="text-muted-foreground text-sm font-medium">Review summary</p>
                <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">{broker.name} Review</h1>
                <p className="max-w-3xl text-base leading-7 text-muted-foreground">
                  {hasFullReview
                    ? review.verdict
                    : "Research profile with source-dated broker facts. Editorial score, regulation status, payment terms, and country availability still need a deeper source pass."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {hasFullReview ? (
                  <>
                    <ScoreCard label="Overall score" value={review.overallScore.toFixed(1)} suffix="/5" tone="warning" />
                    <ScoreCard label="Fees" value={scoreOutOfTen(feesScore)} suffix="/10" />
                    <ScoreCard label="Regulation" value={scoreOutOfTen(regulationScore)} suffix="/10" tone="danger" />
                  </>
                ) : (
                  <>
                    <ScoreCard label="Editorial score" value="Pending" tone="warning" />
                    <ScoreCard label="Source trail" value={sourceConfidenceLabels[broker.sourceConfidence]} compact />
                    <ScoreCard label="Regulation" value="Needs check" tone="warning" compact />
                  </>
                )}
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <StatusTile label={hasFullReview ? "Verified fact" : "Known fact"} value={verifiedFact} icon={<CheckCircle2Icon className="size-4" />} />
                <StatusTile label="Main risk" value={hasFullReview ? review.cons[0] : "Claims not verified"} icon={<ShieldAlertIcon className="size-4" />} tone="warning" />
                <StatusTile label="Source pass" value={formatDate(broker.lastVerifiedAt)} icon={<CalendarClockIcon className="size-4" />} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle>Verdict</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                {hasFullReview ? (
                  <>
                    <div className="flex items-end gap-2">
                      <span className="text-6xl font-semibold tracking-tight">{review.overallScore.toFixed(1)}</span>
                      <span className="pb-2 text-sm text-muted-foreground">/ 5</span>
                    </div>
                    <StarRating score={review.overallScore} />
                  </>
                ) : (
                  <div>
                    <span className="text-4xl font-semibold tracking-tight">Pending</span>
                    <p className="mt-1 text-sm text-muted-foreground">No editorial score yet</p>
                  </div>
                )}
              </div>
              <Badge variant={hasFullReview ? "warning" : "muted"}>{review.scoreLabel}</Badge>
            </div>
            <Separator />
            <ul className="space-y-2 text-sm leading-6">
              {hasFullReview ? (
                <>
                  <VerdictItem text="Source-backed facts are separated from weak or unresolved claims." type="neutral" />
                  <VerdictItem text="Check the exact entity, jurisdiction, payments, and product restrictions before funding." type="warning" />
                  <VerdictItem text="This page is research, not a broker recommendation or investment advice." type="danger" />
                </>
              ) : (
                <>
                  <VerdictItem text="Source profile exists and is ready for editorial review." type="neutral" />
                  <VerdictItem text="Regulation, payments, and country availability still need stronger evidence." type="warning" />
                  <VerdictItem text="No recommendation is made until verification is complete." type="danger" />
                </>
              )}
            </ul>
            <Button asChild className="w-full">
              <a href={broker.officialUrl} rel="nofollow" target="_blank">
                Open primary source
                <ExternalLinkIcon aria-hidden="true" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[230px_minmax(0,1fr)]">
        <ReviewNavigation broker={broker} review={review} hasFullReview={hasFullReview} />

        <div className="space-y-5">
          <section id="scores" className="scroll-mt-24 grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(380px,0.72fr)]">
            <Card className="shadow-xs">
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Rating breakdown</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {hasFullReview ? "Editorial score by review area." : "Review categories queued for source verification."}
                  </p>
                </div>
                <Badge variant="secondary">{hasFullReview ? "Internal score" : "Pending score"}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {review.ratings.map((rating) => (
                  <ScoreRow key={rating.label} rating={rating} hasFullReview={hasFullReview} />
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle>Score map</CardTitle>
              </CardHeader>
              <CardContent>
                {hasFullReview ? <RadarChart ratings={review.ratings} /> : <PendingScoreMap ratings={review.ratings} />}
              </CardContent>
            </Card>
          </section>

          <section id="facts" className="scroll-mt-24 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoMetric label="External score" value={review.externalScore} />
            <InfoMetric label="Company / entity" value={review.companyEntity} />
            <InfoMetric label="Payout range" value={review.payoutRange} />
            <InfoMetric label="Withdrawal time" value={review.withdrawalTime} />
          </section>

          <section id="safety" className="scroll-mt-24 grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-5">
              <Card className="shadow-xs">
                <CardHeader>
                  <CardTitle>Verification matrix</CardTitle>
                  <p className="text-sm text-muted-foreground">What is confirmed, disputed, or still weakly sourced.</p>
                </CardHeader>
                <CardContent>
                  <VerificationMatrix checks={review.safetyChecks} />
                </CardContent>
              </Card>

              <Card id="conditions" className="scroll-mt-24 shadow-xs">
                <CardHeader>
                  <CardTitle>Trading conditions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <PlainFact label="Minimum deposit" value={broker.minDeposit} />
                    <PlainFact label="Minimum trade" value={review.minimumTrade} />
                    <PlainFact label="Demo account" value={broker.demoAccount} />
                    <PlainFact label="Account currencies" value={review.accountCurrencies} />
                    <PlainFact label="Assets" value={broker.assets} />
                    <PlainFact label="Platform" value={review.platform} />
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <h2 className="text-base font-semibold">Payments and withdrawals</h2>
                    <div className="flex flex-wrap gap-2">
                      {review.paymentMethods.map((method) => (
                        <Badge key={method} variant="secondary" className="max-w-full whitespace-normal text-left leading-5">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-5">
              <Card className="shadow-xs">
                <CardHeader>
                  <CardTitle>Pros and cons</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <ReviewList title="Confirmed positives" items={review.pros} type="pro" />
                  <Separator />
                  <ReviewList title="Main concerns" items={review.cons} type="con" />
                </CardContent>
              </Card>

              <Card className="border-amber-300/50 bg-amber-50/70 shadow-none dark:bg-amber-400/10">
                <CardContent className="flex gap-3 py-4">
                  <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
                  <p className="text-sm leading-6 text-amber-950 dark:text-amber-100">
                    Not investment advice. Binary and digital options can result in full loss of the trade amount and may
                    be restricted in your jurisdiction.
                  </p>
                </CardContent>
              </Card>
            </aside>
          </section>

          <section id="timeline" className="scroll-mt-24 grid gap-5 xl:grid-cols-[0.85fr_1fr]">
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle>Review timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewTimeline events={review.timeline} />
              </CardContent>
            </Card>

            <Card id="faq" className="scroll-mt-24 shadow-xs">
              <CardHeader>
                <CardTitle>FAQ</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewFaq faqs={review.faqs} />
              </CardContent>
            </Card>
          </section>

          <Card id="sources" className="scroll-mt-24 shadow-xs">
            <CardHeader>
              <CardTitle>Sources</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {broker.sources.map((source) => (
                <a
                  key={`${source.publisher}-${source.title}`}
                  href={source.url}
                  className="flex items-start justify-between gap-3 rounded-md border p-3 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  rel="nofollow"
                  target="_blank"
                >
                  <span>
                    <span className="block font-medium">{source.title}</span>
                    <span className="block text-sm text-muted-foreground">
                      {source.publisher} · accessed {formatDate(source.accessedAt)}
                    </span>
                  </span>
                  <ExternalLinkIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

function BrokerLogo({ broker }: { broker: Broker }) {
  if (broker.slug === "quotex") {
    return (
      <div className="flex h-28 items-center justify-center overflow-hidden rounded-md bg-black ring-1 ring-border sm:h-32">
        <img src="/brokers/quotex-logo.png" alt="Quotex logo" className="size-full object-cover" />
      </div>
    )
  }

  return (
    <div className="flex h-24 items-center justify-center rounded-md bg-muted px-5 text-4xl font-black tracking-tight text-foreground sm:h-28 sm:text-5xl">
      {broker.name.toLowerCase()}
    </div>
  )
}

function ReviewNavigation({
  broker,
  review,
  hasFullReview,
}: {
  broker: Broker
  review: BrokerReview
  hasFullReview: boolean
}) {
  const items = [
    { href: "#scores", label: "Scores" },
    { href: "#facts", label: "Key facts" },
    { href: "#safety", label: "Safety" },
    { href: "#conditions", label: "Conditions" },
    { href: "#timeline", label: "Timeline" },
    { href: "#faq", label: "FAQ" },
    { href: "#sources", label: "Sources" },
  ]

  return (
    <aside className="hidden xl:block">
      <Card className="sticky top-24 gap-4 shadow-xs">
        <CardContent className="space-y-4 pt-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Review navigation</p>
            <nav className="mt-3 grid gap-1" aria-label={`${broker.name} review sections`}>
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <Separator />

          <div className="rounded-md border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Editorial score</p>
            {hasFullReview ? (
              <div className="mt-1 flex items-end gap-1">
                <span className="text-3xl font-semibold">{review.overallScore.toFixed(1)}</span>
                <span className="pb-1 text-xs text-muted-foreground">/ 5</span>
              </div>
            ) : (
              <p className="mt-1 text-2xl font-semibold">Pending</p>
            )}
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{review.scoreLabel}</p>
          </div>

          <div className="grid gap-2 text-xs">
            <span className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Last verified</span>
              <span className="font-medium">{formatDate(broker.lastVerifiedAt)}</span>
            </span>
            <span className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Trust score</span>
              <span className="font-medium">{hasFullReview ? `${review.trustScore}/100` : "Pending"}</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}

function QuickFact({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "warning" }) {
  return (
    <div className="grid gap-1 rounded-md border px-3 py-2 text-sm">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`break-words font-medium leading-5 ${tone === "warning" ? "text-amber-700 dark:text-amber-300" : ""}`}>{value}</span>
    </div>
  )
}

function ScoreCard({
  label,
  value,
  suffix,
  tone = "default",
  compact = false,
}: {
  label: string
  value: string
  suffix?: string
  tone?: "default" | "warning" | "danger"
  compact?: boolean
}) {
  const toneClass =
    tone === "danger"
      ? "border-destructive/30 bg-destructive/5"
      : tone === "warning"
        ? "border-amber-300/60 bg-amber-50/70 dark:bg-amber-400/10"
        : "bg-card"

  return (
    <div className={`rounded-md border px-3 py-2 ${toneClass}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 flex items-end gap-1">
        <span className={`${compact ? "text-base leading-7" : "text-2xl"} font-semibold`}>{value}</span>
        {suffix ? <span className="pb-1 text-xs text-muted-foreground">{suffix}</span> : null}
      </p>
    </div>
  )
}

function StatusTile({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string
  value: string
  icon: ReactNode
  tone?: "default" | "warning"
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm">
      <span className={`flex size-8 shrink-0 items-center justify-center rounded-md ${tone === "warning" ? "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300" : "bg-primary/10 text-primary"}`}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className="block break-words font-medium leading-snug">{value}</span>
      </span>
    </div>
  )
}

function VerdictItem({ text, type }: { text: string; type: "neutral" | "warning" | "danger" }) {
  const Icon = type === "danger" ? XCircleIcon : type === "warning" ? AlertTriangleIcon : CheckCircle2Icon
  const color = type === "danger" ? "text-destructive" : type === "warning" ? "text-amber-600" : "text-primary"

  return (
    <li className="flex items-start gap-2">
      <Icon className={`mt-1 size-4 shrink-0 ${color}`} aria-hidden="true" />
      <span>{text}</span>
    </li>
  )
}

function ScoreRow({ rating, hasFullReview }: { rating: BrokerReview["ratings"][number]; hasFullReview: boolean }) {
  return (
    <div className="grid gap-3 border-b pb-3 last:border-0 last:pb-0 sm:grid-cols-[170px_1fr_78px] sm:items-center">
      <div>
        <p className="font-medium">{rating.label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hasFullReview ? `${rating.score.toFixed(1)} / 5` : rating.note}</p>
      </div>
      {hasFullReview ? (
        <>
          <div className="h-2 rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(4, (rating.score / 5) * 100)}%` }} />
          </div>
          <StarRating score={rating.score} compact />
        </>
      ) : (
        <>
          <div className="h-2 rounded-full bg-muted">
            <div className="h-2 w-8 rounded-full bg-muted-foreground/25" />
          </div>
          <Badge variant="muted">Pending</Badge>
        </>
      )}
    </div>
  )
}

function RadarChart({ ratings }: { ratings: BrokerReview["ratings"] }) {
  const size = 320
  const center = size / 2
  const radius = 104
  const rings = [0.25, 0.5, 0.75, 1]
  const axisPoints = ratings.map((_, index) => polarPoint(center, radius, index, ratings.length, 1))
  const dataPoints = ratings.map((rating, index) => polarPoint(center, radius, index, ratings.length, rating.score / 5))
  const polygon = dataPoints.map((point) => `${point.x},${point.y}`).join(" ")

  return (
    <div className="mx-auto max-w-[380px] pb-1">
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Broker review radar chart" className="h-auto w-full">
        {rings.map((ring) => (
          <polygon
            key={ring}
            points={ratings.map((_, index) => {
              const point = polarPoint(center, radius, index, ratings.length, ring)
              return `${point.x},${point.y}`
            }).join(" ")}
            fill="none"
            stroke="currentColor"
            className="text-border"
            strokeWidth="1"
          />
        ))}
        {axisPoints.map((point, index) => (
          <line key={ratings[index].label} x1={center} y1={center} x2={point.x} y2={point.y} stroke="currentColor" className="text-border" strokeWidth="1" />
        ))}
        <polygon points={polygon} className="fill-primary/20 stroke-primary" strokeWidth="3" />
        {dataPoints.map((point, index) => (
          <circle key={ratings[index].label} cx={point.x} cy={point.y} r="5" className="fill-background stroke-primary" strokeWidth="3" />
        ))}
        {axisPoints.map((point, index) => {
          const labelPoint = polarPoint(center, radius + 34, index, ratings.length, 1)
          const isLeft = labelPoint.x < center - 10
          const isRight = labelPoint.x > center + 10
          const safeX = isLeft ? 12 : isRight ? size - 12 : labelPoint.x
          const textAnchor = isLeft ? "start" : isRight ? "end" : "middle"

          return (
            <text
              key={ratings[index].label}
              x={safeX}
              y={labelPoint.y}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              className="fill-muted-foreground text-[12px] font-medium"
            >
              {ratings[index].label}
            </text>
          )
        })}
      </svg>
      <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
        {ratings.map((rating) => (
          <div key={rating.label} className="flex items-center justify-between rounded-md border px-2 py-1">
            <span>{rating.label}</span>
            <span className="font-medium text-foreground">{rating.score.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PendingScoreMap({ ratings }: { ratings: BrokerReview["ratings"] }) {
  return (
    <div className="space-y-4">
      <div className="flex min-h-[260px] items-center justify-center rounded-md border bg-muted/20 p-5 text-center">
        <div className="max-w-xs">
          <div className="mx-auto flex size-12 items-center justify-center rounded-md bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
            <AlertTriangleIcon className="size-5" aria-hidden="true" />
          </div>
          <p className="mt-3 font-semibold">Score map pending</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            We show radar charts only after the review has enough verified category data.
          </p>
        </div>
      </div>
      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
        {ratings.map((rating) => (
          <div key={rating.label} className="flex items-center justify-between rounded-md border px-2 py-1">
            <span>{rating.label}</span>
            <span className="font-medium text-muted-foreground">Pending</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function polarPoint(center: number, radius: number, index: number, total: number, scale: number) {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / total

  return {
    x: center + Math.cos(angle) * radius * scale,
    y: center + Math.sin(angle) * radius * scale,
  }
}

function StarRating({ score, compact = false }: { score: number; compact?: boolean }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${score.toFixed(1)} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index + 1 <= Math.round(score)

        return (
          <StarIcon
            key={index}
            className={`${compact ? "size-4" : "size-5"} ${filled ? "fill-primary text-primary" : "text-muted-foreground/35"}`}
            aria-hidden="true"
          />
        )
      })}
    </div>
  )
}

function InfoMetric({ label, value }: { label: string; value: string }) {
  return (
    <Card className="gap-3 shadow-xs">
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="break-words text-sm font-medium leading-6">{value}</p>
      </CardContent>
    </Card>
  )
}

function VerificationMatrix({ checks }: { checks: BrokerReview["safetyChecks"] }) {
  return (
    <div className="overflow-hidden rounded-md border">
      {checks.map((check) => {
        const meta = getCheckStatusMeta(check.status)

        return (
          <div
            key={check.label}
            className="grid gap-3 border-b p-3 last:border-b-0 md:grid-cols-[190px_120px_minmax(0,1fr)] md:items-start"
          >
            <div className="flex items-center gap-2">
              <span className={`flex size-7 shrink-0 items-center justify-center rounded-md ${meta.tileClass}`}>
                {meta.icon}
              </span>
              <span className="font-medium">{check.label}</span>
            </div>
            <Badge variant={meta.badgeVariant}>{meta.label}</Badge>
            <p className="text-sm leading-6 text-muted-foreground">{check.detail}</p>
          </div>
        )
      })}
    </div>
  )
}

function getCheckStatusMeta(status: BrokerReview["safetyChecks"][number]["status"]) {
  if (status === "pass") {
    return {
      label: "Verified",
      badgeVariant: "success" as const,
      tileClass: "bg-primary/10 text-primary",
      icon: <CheckCircle2Icon className="size-4" aria-hidden="true" />,
    }
  }

  if (status === "fail") {
    return {
      label: "Failed",
      badgeVariant: "destructive" as const,
      tileClass: "bg-destructive/10 text-destructive",
      icon: <XCircleIcon className="size-4" aria-hidden="true" />,
    }
  }

  return (
    {
      label: "Watch",
      badgeVariant: "warning" as const,
      tileClass: "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
      icon: <AlertTriangleIcon className="size-4" aria-hidden="true" />,
    }
  )
}

function PlainFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border bg-muted/20 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-medium leading-6">{value}</p>
    </div>
  )
}

function ReviewList({ title, items, type }: { title: string; items: string[]; type: "pro" | "con" }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{title}</p>
      {items.map((item) => (
        <ReviewListItem key={item} type={type} text={item} />
      ))}
    </div>
  )
}

function ReviewListItem({ type, text }: { type: "pro" | "con"; text: string }) {
  const Icon = type === "pro" ? CheckCircle2Icon : XCircleIcon

  return (
    <div className="flex items-start gap-2 text-sm leading-6">
      <Icon className={`mt-1 size-4 shrink-0 ${type === "pro" ? "text-primary" : "text-destructive"}`} aria-hidden="true" />
      <span>{text}</span>
    </div>
  )
}

function ReviewTimeline({ events }: { events: BrokerReview["timeline"] }) {
  return (
    <div className="space-y-0">
      {events.map((event) => (
        <div key={`${event.year}-${event.title}`} className="grid gap-3 pb-4 last:pb-0 sm:grid-cols-[92px_1fr]">
          <span className="text-sm font-semibold">{event.year}</span>
          <div className="relative border-l pl-4">
            <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full border-2 border-background bg-primary" />
            <p className="font-medium">{event.title}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{event.detail}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ReviewFaq({ faqs }: { faqs: BrokerReview["faqs"] }) {
  return (
    <div className="overflow-hidden rounded-md border">
      {faqs.map((faq, index) => (
        <details key={faq.question} className="group border-b last:border-b-0" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-4 py-3 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
            <span>{faq.question}</span>
            <span className="text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </summary>
          <p className="px-4 pb-4 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
        </details>
      ))}
    </div>
  )
}

function scoreOutOfTen(score: number) {
  return Math.round(score * 2).toString()
}

function summarizeMinimumDeposit(minDeposit: string) {
  return minDeposit.split(";")[0].trim()
}

function createFallbackReview(broker: Broker): BrokerReview {
  const hasMinimumDeposit = broker.minDeposit !== "Needs verification"
  const hasDemoAccount = broker.demoAccount !== "Needs verification"
  const sourceStatus = broker.sourceConfidence === "official_basics" ? "pass" : "warning"
  const sourceDetail =
    broker.sourceConfidence === "official_basics"
      ? "At least one official source is available for basic product or account facts."
      : broker.sourceConfidence === "partial"
        ? "Some source material exists, but the trail is not strong enough for a full editorial score."
        : "Only a thin source trail is available. Treat commercial and regulatory claims as unverified."

  return {
    overallScore: 0,
    trustScore: 0,
    externalScore: "External score not normalized yet",
    scoreLabel: "Research profile",
    ratingSummary: broker.summary,
    verdict:
      "This page is a research profile, not a completed broker review. Facts are shown with source status, while unresolved claims remain in the verification queue.",
    minimumTrade: "Needs verification",
    payoutRange: "Needs verification",
    withdrawalTime: "Needs verification",
    platform: broker.platformType,
    regulation: "Regulation review pending",
    companyEntity: broker.legalName,
    tradeableSymbols: broker.assets,
    accountCurrencies: "Needs verification",
    paymentMethods: ["Needs verification"],
    pros: broker.keyNotes,
    cons: ["Regulatory and commercial claims need a stronger source trail"],
    ratings: [
      { label: "Regulation", score: 0, note: "Pending regulatory source pass." },
      { label: "Fees", score: 0, note: "Pending account-cost verification." },
      { label: "Platform", score: 0, note: "Pending platform review." },
      { label: "Markets", score: 0, note: "Pending instrument coverage check." },
      { label: "Payments", score: 0, note: "Pending deposit and withdrawal evidence." },
      { label: "Support", score: 0, note: "Pending support and complaint review." },
    ],
    safetyChecks: [
      { label: "Source trail", status: sourceStatus, detail: sourceDetail },
      {
        label: "Minimum deposit",
        status: hasMinimumDeposit ? "pass" : "warning",
        detail: hasMinimumDeposit
          ? `Current profile records ${broker.minDeposit}; re-check account screens before treating it as stable.`
          : "Minimum deposit has not been verified from a reliable source yet.",
      },
      {
        label: "Demo account",
        status: hasDemoAccount ? "pass" : "warning",
        detail: hasDemoAccount
          ? `Current profile records demo account status as: ${broker.demoAccount}.`
          : "Demo account availability needs source confirmation.",
      },
      {
        label: "Regulation",
        status: "warning",
        detail: "Regulatory status needs a manual pass against official registers and country restrictions.",
      },
      {
        label: "Country availability",
        status: "warning",
        detail: "Restricted regions are not fully normalized. Check the broker terms and local rules before publishing country pages.",
      },
    ],
    timeline: [
      {
        year: "Now",
        title: "Research profile created",
        detail: "Basic broker fields and primary source links are available for editorial review.",
      },
      {
        year: "Next",
        title: "Regulatory verification",
        detail: "Check official registers, entity names, country restrictions, and warning-list records.",
      },
      {
        year: "Next",
        title: "Trading terms evidence",
        detail: "Verify deposit minimums, payment methods, withdrawal rules, platform claims, and user-risk disclosures.",
      },
    ],
    faqs: [
      {
        question: `Is ${broker.name} fully reviewed?`,
        answer:
          "Not yet. This page is a structured research profile and should not be treated as a completed recommendation or ranked review.",
      },
      {
        question: `Does ${broker.name} have a verified score?`,
        answer:
          "No. The editorial score is pending until regulation, payments, product terms, and source quality are checked in more detail.",
      },
      {
        question: `Can this profile be used for comparison pages?`,
        answer:
          "Yes, but only with visible needs-verification labels. Do not publish unsupported commercial claims as confirmed facts.",
      },
    ],
  }
}

function createReviewSchema(broker: Broker, review: BrokerReview, hasFullReview: boolean) {
  if (!hasFullReview) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${broker.name} broker research profile`,
      description: review.verdict,
      dateModified: broker.lastVerifiedAt,
      author: {
        "@type": "Organization",
        name: "TBO Broker Directory",
      },
      about: {
        "@type": "FinancialProduct",
        name: broker.name,
        category: broker.verticals.map((vertical) => verticalLabels[vertical]).join(", "),
        url: broker.officialUrl,
      },
      mainEntity: review.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "FinancialProduct",
      name: broker.name,
      category: broker.verticals.map((vertical) => verticalLabels[vertical]).join(", "),
      url: broker.officialUrl,
    },
    name: `${broker.name} broker review`,
    reviewBody: review.verdict,
    dateModified: broker.lastVerifiedAt,
    author: {
      "@type": "Organization",
      name: "TBO Broker Directory",
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.overallScore,
      bestRating: 5,
      worstRating: 1,
    },
    mainEntity: review.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
