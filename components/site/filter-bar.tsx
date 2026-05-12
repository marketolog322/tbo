import { SearchIcon, SlidersHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function FilterBar({ compact = false }: { compact?: boolean }) {
  return (
    <form
      className={`grid gap-3 rounded-lg border bg-card p-3 shadow-sm ${compact ? "lg:grid-cols-[1fr_150px_auto]" : "lg:grid-cols-[1fr_180px_180px_auto]"}`}
      role="search"
    >
      <label className="relative block">
        <span className="sr-only">Search brokers</span>
        <SearchIcon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" aria-hidden="true" />
        <Input className="pl-9" name="query" placeholder="Search broker, category, deposit, restriction..." />
      </label>
      <label>
        <span className="sr-only">Market type</span>
        <select
          name="market"
          className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm shadow-xs focus-visible:ring-2 focus-visible:outline-none"
          defaultValue=""
        >
          <option value="">All categories</option>
          <option value="binary-options-brokers">Binary options</option>
          <option value="forex-brokers">Forex</option>
          <option value="crypto-brokers">Crypto</option>
          <option value="cfd-brokers">CFD</option>
          <option value="official_basics">Official basics</option>
          <option value="needs_verification">Needs verification</option>
        </select>
      </label>
      {!compact && (
        <label>
        <span className="sr-only">Region</span>
          <select
            name="region"
            className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm shadow-xs focus-visible:ring-2 focus-visible:outline-none"
            defaultValue=""
          >
            <option value="">All regions</option>
            <option>Global</option>
            <option>LATAM</option>
            <option>South Africa</option>
            <option>India</option>
          </select>
        </label>
      )}
      <Button type="submit">
        <SlidersHorizontalIcon aria-hidden="true" />
        Filter
      </Button>
    </form>
  )
}
