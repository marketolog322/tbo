import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Broker, formatDate, verticalLabels } from "@/lib/brokers"
import { ReviewBadge, RiskBadge, SourceBadge } from "@/components/site/broker-status"

type BrokerTableProps = {
  brokers: Broker[]
}

export function BrokerTable({ brokers }: BrokerTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-64">Broker</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Deposit / demo</TableHead>
          <TableHead>Restrictions</TableHead>
          <TableHead>Evidence</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {brokers.map((broker) => (
          <TableRow key={broker.slug}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="size-9 rounded-md">
                  <AvatarFallback className="bg-primary/10 text-primary rounded-md text-xs">
                    {broker.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <Link href={`/brokers/${broker.slug}`} className="font-medium hover:text-primary">
                    {broker.name}
                  </Link>
                  <p className="text-muted-foreground mt-1 max-w-72 truncate text-xs">{broker.legalName}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex max-w-56 flex-wrap gap-1.5">
                {broker.verticals.map((vertical) => (
                  <Badge key={vertical} variant="muted">
                    {verticalLabels[vertical]}
                  </Badge>
                ))}
                <Badge variant="secondary">{broker.platformType}</Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1 text-sm">
                <p>{broker.minDeposit}</p>
                <p className="text-muted-foreground">Demo: {broker.demoAccount}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="max-w-64 space-y-1 text-sm">
                <p>{broker.restrictedRegions.slice(0, 2).join(", ")}</p>
                <p className="text-muted-foreground">
                  {broker.restrictedRegions.length > 2 ? `+${broker.restrictedRegions.length - 2} more` : "Review before publishing"}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col items-start gap-1.5">
                <ReviewBadge broker={broker} />
                <RiskBadge riskLevel={broker.riskLevel} />
                <SourceBadge sourceConfidence={broker.sourceConfidence} />
                <span className="text-muted-foreground text-xs">{formatDate(broker.lastVerifiedAt)}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button asChild variant="outline" size="sm">
                <Link href={`/brokers/${broker.slug}`}>
                  Open
                  <ArrowUpRightIcon aria-hidden="true" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
