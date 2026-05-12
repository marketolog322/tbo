import type { ReactNode } from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

type MetricCardProps = {
  icon: ReactNode
  value: string
  label: string
  detail: string
}

export function MetricCard({ icon, value, label, detail }: MetricCardProps) {
  return (
    <Card className="gap-4">
      <CardHeader className="flex-row items-center gap-3">
        <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">{icon}</div>
        <span className="text-2xl font-semibold">{value}</span>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="font-medium">{label}</p>
        <p className="text-muted-foreground text-sm">{detail}</p>
      </CardContent>
    </Card>
  )
}
