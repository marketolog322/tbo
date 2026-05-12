import { AlertTriangleIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

type DisclosureProps = {
  compact?: boolean
}

export function AffiliateDisclosure({ compact = false }: DisclosureProps) {
  return (
    <Card className="border-amber-300/50 bg-amber-50/70 shadow-none dark:bg-amber-400/10">
      <CardContent className={compact ? "flex gap-3 py-3" : "flex gap-3 py-4"}>
        <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
        <p className="text-sm leading-6 text-amber-950 dark:text-amber-100">
          This site may earn compensation when readers apply through marked partner links. Compensation does not decide
          inclusion or review conclusions; verification date and sources are shown on each review page.
        </p>
      </CardContent>
    </Card>
  )
}
