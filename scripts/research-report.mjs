#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const TODAY = new Date().toISOString().slice(0, 10)
const args = parseArgs(process.argv.slice(2))
const runDir = path.resolve(ROOT, String(args.run ?? `content/research/runs/${TODAY}`))
const outPath = path.resolve(ROOT, String(args.out ?? `content/research/reports/${TODAY}.md`))

const brokerFiles = await getBrokerResearchFiles(runDir)

if (brokerFiles.length === 0) {
  console.error(`No broker research JSON files found in ${path.relative(ROOT, runDir)}.`)
  console.error("Run `npm run research:brokers` first, or pass --run path/to/run.")
  process.exit(1)
}

const reports = []

for (const file of brokerFiles) {
  const research = JSON.parse(await fs.readFile(file, "utf8"))
  reports.push(createBrokerReport(research))
}

await fs.mkdir(path.dirname(outPath), { recursive: true })
await fs.writeFile(outPath, renderReport(reports), "utf8")

console.log(`Report written to ${path.relative(ROOT, outPath)}`)

async function getBrokerResearchFiles(directory) {
  let entries

  try {
    entries = await fs.readdir(directory, { withFileTypes: true })
  } catch {
    return []
  }

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json") && entry.name !== "index.json")
    .map((entry) => path.join(directory, entry.name))
    .sort()
}

function createBrokerReport(research) {
  const sourceCounts = countBy(research.sources ?? [], "type")
  const usefulFacts = scoreFacts(research.candidateFacts ?? [])
  const actions = usefulFacts.slice(0, 10).map((fact) => ({
    priority: getPriority(fact),
    page: getTargetPage(fact.field),
    field: fact.field,
    action: getAction(fact),
    source: fact.sourceUrl,
    publisher: fact.publisher,
    confidence: fact.confidence,
  }))

  return {
    slug: research.slug,
    name: research.name,
    generatedAt: research.generatedAt,
    providers: research.providers,
    policy: research.policy,
    sourceCounts,
    sourceCount: research.sources?.length ?? 0,
    candidateFactCount: research.candidateFacts?.length ?? 0,
    gaps: research.gaps ?? [],
    actions,
  }
}

function renderReport(reports) {
  const lines = [
    `# Broker Research Report - ${TODAY}`,
    "",
    "This report is generated from research staging JSON. It is an editorial queue, not an autopublish instruction.",
    "",
    "## Summary",
    "",
    `- Brokers reviewed: ${reports.length}`,
    `- High-priority actions: ${reports.flatMap((report) => report.actions).filter((action) => action.priority === "HIGH").length}`,
    `- Verification gaps: ${reports.flatMap((report) => report.gaps).length}`,
    "",
  ]

  for (const report of reports) {
    lines.push(`## ${report.name}`)
    lines.push("")
    lines.push(`- Sources found: ${report.sourceCount}`)
    lines.push(`- Candidate facts: ${report.candidateFactCount}`)
    lines.push(`- Source mix: ${formatSourceCounts(report.sourceCounts)}`)
    if (report.providers) {
      lines.push(`- Providers: search ${report.providers.search}; scrape ${report.providers.scrape}`)
    }
    lines.push("")

    if (report.actions.length > 0) {
      lines.push("### Editorial Queue")
      lines.push("")

      for (const action of report.actions) {
        lines.push(
          `- ${action.priority} / ${action.action} / ${action.page}: ${humanize(action.field)} from ${action.publisher} (${action.confidence})`
        )
        lines.push(`  Source: ${action.source}`)
      }

      lines.push("")
    }

    if (report.gaps.length > 0) {
      lines.push("### Gaps")
      lines.push("")
      for (const gap of report.gaps) {
        lines.push(`- ${gap}`)
      }
      lines.push("")
    }
  }

  lines.push("## Rules")
  lines.push("")
  lines.push("- Official broker pages can support product/account facts, but not safety claims.")
  lines.push("- Regulator and government pages get priority for authorization/warning claims.")
  lines.push("- Broker databases and reviews stay partial evidence unless cross-checked.")
  lines.push("- No claim should be promoted into public pages without a source URL and confidence label.")
  lines.push("")

  return `${lines.join("\n")}\n`
}

function scoreFacts(facts) {
  return facts
    .map((fact) => ({ ...fact, score: getFactScore(fact) }))
    .filter((fact) => fact.score > 0)
    .sort((a, b) => b.score - a.score)
}

function getFactScore(fact) {
  const field = String(fact.field ?? "")
  const sourceType = String(fact.sourceType ?? "")
  const confidence = String(fact.confidence ?? "")

  let score = 0

  if (["regulation", "warning", "restricted_regions"].includes(field)) score += 10
  if (["minimum_deposit", "withdrawal", "payment_methods", "demo_account", "affiliate_program", "apps"].includes(field)) {
    score += 7
  }
  if (sourceType === "regulator") score += 6
  if (sourceType === "official") score += 5
  if (sourceType === "affiliate") score += 3
  if (sourceType === "database") score += 2
  if (confidence === "official") score += 3
  if (confidence === "needs_verification") score -= 2

  return score
}

function getPriority(fact) {
  const score = fact.score ?? getFactScore(fact)

  if (score >= 15) return "HIGH"
  if (score >= 9) return "MEDIUM"
  return "LOW"
}

function getAction(fact) {
  if (fact.confidence === "needs_verification") return "verify"
  if (fact.sourceType === "regulator" || fact.field === "warning") return "update"
  return "add"
}

function getTargetPage(field) {
  if (field === "affiliate_program") return "affiliate_program"
  if (field === "apps" || field === "payment_methods") return "broker_review + clone_script"
  return "broker_review"
}

function formatSourceCounts(counts) {
  const entries = Object.entries(counts)

  if (entries.length === 0) {
    return "none"
  }

  return entries.map(([key, count]) => `${key}: ${count}`).join(", ")
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] ?? "unknown"
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

function humanize(value) {
  return String(value).replaceAll("_", " ")
}

function parseArgs(argv) {
  const parsed = {}

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index]

    if (!item.startsWith("--")) {
      continue
    }

    const key = item.slice(2)
    const next = argv[index + 1]

    if (!next || next.startsWith("--")) {
      parsed[key] = true
    } else {
      parsed[key] = next
      index += 1
    }
  }

  return parsed
}
