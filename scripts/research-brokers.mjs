#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const CONFIG_PATH = path.join(ROOT, "content/research/broker-research.config.json")
const TODAY = new Date().toISOString().slice(0, 10)

await loadEnvFile(path.join(ROOT, ".env"))
await loadEnvFile(path.join(ROOT, ".env.local"))

const args = parseArgs(process.argv.slice(2))
const config = JSON.parse(await fs.readFile(CONFIG_PATH, "utf8"))
const selectedBroker = args.broker ? String(args.broker) : undefined
const limit = Number(args.limit ?? 6)
const dryRun = Boolean(args["dry-run"])
const outDir = path.resolve(ROOT, String(args.out ?? `content/research/runs/${TODAY}`))

const brokers = selectedBroker
  ? config.brokers.filter((broker) => broker.slug === selectedBroker || broker.name.toLowerCase() === selectedBroker.toLowerCase())
  : config.brokers

if (brokers.length === 0) {
  console.error(`No broker matched "${selectedBroker}".`)
  process.exit(1)
}

if (dryRun) {
  console.log(`Research dry run for ${brokers.length} broker(s).`)
  for (const broker of brokers) {
    console.log(`\n${broker.name}`)
    buildQueries(broker).forEach((query) => console.log(`- [${query.type}] ${query.query}`))
    broker.seedUrls.forEach((url) => console.log(`- [seed] ${url}`))
  }
  process.exit(0)
}

await fs.mkdir(outDir, { recursive: true })

const run = {
  generatedAt: new Date().toISOString(),
  configVersion: config.version,
  outputDir: path.relative(ROOT, outDir),
  providers: {
    search: process.env.TAVILY_API_KEY ? "tavily" : "seed-only",
    scrape: process.env.FIRECRAWL_API_KEY ? "firecrawl" : "disabled",
  },
  brokers: [],
}

for (const broker of brokers) {
  console.log(`Researching ${broker.name}...`)
  const result = await researchBroker(broker, { limit })
  run.brokers.push({
    slug: broker.slug,
    name: broker.name,
    sourceCount: result.sources.length,
    candidateFactCount: result.candidateFacts.length,
    gapCount: result.gaps.length,
  })

  await fs.writeFile(path.join(outDir, `${broker.slug}.json`), `${JSON.stringify(result, null, 2)}\n`)
}

await fs.writeFile(path.join(outDir, "index.json"), `${JSON.stringify(run, null, 2)}\n`)
console.log(`Done. Review output in ${path.relative(ROOT, outDir)}`)

async function researchBroker(broker, options) {
  const queries = buildQueries(broker)
  const searchResults = []

  for (const item of queries) {
    const results = await tavilySearch(item.query, Math.max(2, Math.ceil(options.limit / 2)))
    for (const result of results) {
      searchResults.push({
        ...result,
        query: item.query,
        requestedType: item.type,
      })
    }
  }

  for (const url of broker.seedUrls) {
    searchResults.push({
      title: `${broker.name} seed source`,
      url,
      content: "",
      requestedType: "seed",
      query: "seed",
    })
  }

  const sources = dedupeByUrl(searchResults)
    .map((source) => normalizeSource(source, broker))
    .sort(compareSourceStrength)
    .slice(0, options.limit)

  const scrapedSources = []
  for (const source of sources) {
    const scraped = await firecrawlScrape(source.url)
    const content = scraped.markdown || source.snippet || source.content || ""

    scrapedSources.push({
      ...source,
      scrapedAt: new Date().toISOString(),
      scrapeStatus: scraped.status,
      contentLength: content.length,
      evidenceSnippets: extractEvidenceSnippets(content),
    })
  }

  const candidateFacts = extractCandidateFacts(scrapedSources)
  const gaps = findGaps(candidateFacts, scrapedSources)

  return {
    slug: broker.slug,
    name: broker.name,
    generatedAt: new Date().toISOString(),
    providers: run.providers,
    policy: {
      promotion: config.policy.promotionRule,
      note: "This is research staging output. Human review is required before publishing claims.",
    },
    queries,
    sources: scrapedSources,
    candidateFacts,
    gaps,
  }
}

function buildQueries(broker) {
  const names = [broker.name, ...(broker.aliases ?? [])]
  const queries = []

  for (const group of config.queryTemplates) {
    for (const template of group.templates) {
      for (const name of names.slice(0, 2)) {
        queries.push({
          type: group.type,
          query: template.replaceAll("{name}", name),
        })
      }
    }
  }

  return queries
}

async function tavilySearch(query, maxResults) {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) {
    return []
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: maxResults,
      search_depth: "advanced",
      include_answer: false,
      include_raw_content: false,
    }),
  })

  if (!response.ok) {
    console.warn(`Tavily search failed (${response.status}) for: ${query}`)
    return []
  }

  const data = await response.json()
  return (data.results ?? []).map((result) => ({
    title: result.title ?? result.url,
    url: result.url,
    content: result.content ?? "",
    score: result.score ?? 0,
  }))
}

async function firecrawlScrape(url) {
  const apiKey = process.env.FIRECRAWL_API_KEY
  if (!apiKey) {
    return { status: "skipped_no_key", markdown: "" }
  }

  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
        timeout: 15000,
      }),
    })

    if (!response.ok) {
      return { status: `failed_${response.status}`, markdown: "" }
    }

    const data = await response.json()
    return {
      status: data.success === false ? "failed" : "ok",
      markdown: data.data?.markdown ?? data.markdown ?? "",
    }
  } catch (error) {
    return { status: `error_${error.name}`, markdown: "" }
  }
}

function normalizeSource(source, broker) {
  const host = getHost(source.url)
  const sourceType = classifySource(host, source.title, source.requestedType, broker)

  return {
    title: source.title,
    url: source.url,
    host,
    publisher: getPublisher(host),
    snippet: normalizeWhitespace(source.content ?? ""),
    requestedType: source.requestedType,
    query: source.query,
    type: sourceType.type,
    confidence: sourceType.confidence,
    searchScore: source.score ?? 0,
  }
}

function classifySource(host, title, requestedType, broker) {
  const official = broker.officialDomains.some((domain) => host === domain || host.endsWith(`.${domain}`))
  if (official) {
    return { type: "official", confidence: "official" }
  }

  const value = `${host} ${title}`.toLowerCase()
  if (
    value.includes("cysec") ||
    value.includes("fca.org") ||
    value.includes("asic.gov") ||
    value.includes("cvm.gov") ||
    value.includes("consob") ||
    value.includes("sec.gov") ||
    value.includes("iosco") ||
    value.includes("financialcommission") ||
    host.endsWith(".gov") ||
    host.includes(".gov.")
  ) {
    return { type: "regulator", confidence: "partial" }
  }

  if (value.includes("wikifx") || value.includes("tradersunion") || value.includes("brokersview")) {
    return { type: "database", confidence: "partial" }
  }

  if (requestedType === "affiliate" || value.includes("affiliate") || value.includes("partner")) {
    return { type: "affiliate", confidence: "partial" }
  }

  return { type: "review", confidence: "needs_verification" }
}

function extractEvidenceSnippets(content) {
  const text = normalizeWhitespace(content)
  if (!text) {
    return []
  }

  const patterns = [
    ["minimum_deposit", /minimum deposit|deposit from|deposit starts|deposit at least|depositing/i],
    ["demo_account", /demo account|practice account|virtual balance/i],
    ["withdrawal", /withdrawal|withdraw funds|withdraw money|cash out/i],
    ["payment_methods", /payment method|visa|mastercard|bank card|crypto|bitcoin|usdt|skrill|neteller/i],
    ["regulation", /regulated|regulation|license|licence|cysec|fca|asic|offshore/i],
    ["restricted_regions", /restricted countries|not available|not accept|united states|canada|eea|european/i],
    ["affiliate_program", /affiliate|partner program|revenue share|revshare|cpa|commission/i],
    ["apps", /android|ios|app store|google play|mobile app/i],
    ["warning", /warning|scam|blacklist|complaint|unauthori[sz]ed|red flag/i],
  ]

  return patterns
    .map(([field, pattern]) => {
      const snippet = findSnippet(text, pattern)
      return snippet ? { field, snippet } : null
    })
    .filter(Boolean)
}

function extractCandidateFacts(sources) {
  const facts = []

  for (const source of sources) {
    for (const evidence of source.evidenceSnippets) {
      facts.push({
        field: evidence.field,
        claim: evidence.snippet,
        sourceUrl: source.url,
        publisher: source.publisher,
        sourceType: source.type,
        confidence: source.confidence,
      })
    }
  }

  return facts
}

function findGaps(facts, sources) {
  const fields = new Set(facts.map((fact) => fact.field))
  const gaps = []

  for (const required of ["minimum_deposit", "demo_account", "regulation", "restricted_regions", "affiliate_program"]) {
    if (!fields.has(required)) {
      gaps.push(`${required}: needs verification`)
    }
  }

  const hasOfficial = sources.some((source) => source.type === "official")
  const hasRiskSource = sources.some((source) => source.type === "regulator" || source.type === "database")

  if (!hasOfficial) {
    gaps.push("official source: not found in selected results")
  }

  if (!hasRiskSource) {
    gaps.push("risk source: regulator/database source not found in selected results")
  }

  return gaps
}

function compareSourceStrength(a, b) {
  const weight = {
    official: 5,
    regulator: 4,
    database: 3,
    affiliate: 2,
    review: 1,
  }

  return (weight[b.type] ?? 0) - (weight[a.type] ?? 0) || b.searchScore - a.searchScore
}

function dedupeByUrl(items) {
  const seen = new Map()

  for (const item of items) {
    if (!item.url) {
      continue
    }

    const key = normalizeUrl(item.url)
    if (!seen.has(key)) {
      seen.set(key, item)
    }
  }

  return [...seen.values()]
}

function findSnippet(text, pattern) {
  const match = text.match(pattern)
  if (!match || match.index === undefined) {
    return null
  }

  const start = Math.max(0, match.index - 130)
  const end = Math.min(text.length, match.index + 300)
  return normalizeWhitespace(text.slice(start, end))
}

function getHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return "unknown"
  }
}

function getPublisher(host) {
  if (host === "unknown") {
    return "Unknown"
  }

  return host
    .split(".")
    .slice(-2, -1)[0]
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url)
    parsed.hash = ""
    parsed.search = ""
    return parsed.toString().replace(/\/$/, "")
  } catch {
    return url
  }
}

function normalizeWhitespace(value) {
  return String(value).replace(/\s+/g, " ").trim()
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

async function loadEnvFile(filePath) {
  let file

  try {
    file = await fs.readFile(filePath, "utf8")
  } catch {
    return
  }

  for (const line of file.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#")) {
      continue
    }

    const separator = trimmed.indexOf("=")
    if (separator === -1) {
      continue
    }

    const key = trimmed.slice(0, separator).trim()
    const rawValue = trimmed.slice(separator + 1).trim()
    const value = rawValue.replace(/^["']|["']$/g, "")

    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}
