import { Badge } from "@/components/ui/badge"
import type { Broker, RiskLevel, SourceConfidence } from "@/lib/brokers"

export function RiskBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  if (riskLevel === "elevated") {
    return <Badge variant="warning">Elevated risk</Badge>
  }

  if (riskLevel === "very_high") {
    return <Badge variant="destructive">Very high risk</Badge>
  }

  return <Badge variant="warning">High risk</Badge>
}

export function ReviewBadge({ broker }: { broker: Broker }) {
  if (broker.reviewStatus === "needs_verification") {
    return <Badge variant="warning">Noindex-ready</Badge>
  }

  if (broker.reviewStatus === "watchlist") {
    return <Badge variant="warning">Watchlist</Badge>
  }

  return <Badge variant="success">Tracked</Badge>
}

export function SourceBadge({ sourceConfidence }: { sourceConfidence: SourceConfidence }) {
  if (sourceConfidence === "official_basics") {
    return <Badge variant="success">Official basics</Badge>
  }

  if (sourceConfidence === "partial") {
    return <Badge variant="secondary">Partial source trail</Badge>
  }

  return <Badge variant="warning">Needs verification</Badge>
}
