import Link from "next/link"
import { ArrowUpRightIcon, CalendarCheckIcon, ExternalLinkIcon, ShieldAlertIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Broker, formatDate, verticalLabels } from "@/lib/brokers"
import { ReviewBadge, RiskBadge, SourceBadge } from "@/components/site/broker-status"

type BrokerCardProps = {
  broker: Broker
}

export function BrokerCard({ broker }: BrokerCardProps) {
  return (
    <Card className="h-full justify-between shadow-xs">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">
              <Link href={`/brokers/${broker.slug}`} className="hover:text-primary">
                {broker.name}
              </Link>
            </CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              {broker.platformType} · Founded {broker.founded}
            </p>
          </div>
          <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-md">
            <ShieldAlertIcon className="size-4" aria-hidden="true" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {broker.verticals.map((vertical) => (
            <Badge key={vertical} variant="muted">
              {verticalLabels[vertical]}
            </Badge>
          ))}
          <RiskBadge riskLevel={broker.riskLevel} />
          <SourceBadge sourceConfidence={broker.sourceConfidence} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6">{broker.summary}</p>
        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Min deposit</dt>
            <dd className="font-medium">{broker.minDeposit}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Demo</dt>
            <dd className="font-medium">{broker.demoAccount}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Review</dt>
            <dd className="font-medium">
              <ReviewBadge broker={broker} />
            </dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="justify-between gap-3 border-t pt-4">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <CalendarCheckIcon className="size-3.5" aria-hidden="true" />
          Verified {formatDate(broker.lastVerifiedAt)}
        </span>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="ghost">
            <a href={broker.officialUrl} rel="nofollow" target="_blank">
              Source
              <ExternalLinkIcon aria-hidden="true" />
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={`/brokers/${broker.slug}`}>
              Review
              <ArrowUpRightIcon aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
