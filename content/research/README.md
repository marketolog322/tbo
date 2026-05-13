# Broker Research Pipeline

This folder is the staging layer between web research and public broker pages.

Raw scraped output is intentionally ignored by Git under `content/research/runs/` and `content/research/latest/`.
Commit only curated source records, config, and editorial notes that are safe to publish.

## Run

```bash
npm run research:brokers -- --dry-run
npm run research:brokers -- --broker quotex --limit 6
npm run research:report
TAVILY_API_KEY=... FIRECRAWL_API_KEY=... npm run research:brokers
```

## Workflow

1. Search official, regulator, database, and affiliate sources.
2. Scrape the strongest URLs into markdown snippets.
3. Extract candidate facts with source URLs and confidence labels.
4. Generate an editorial queue with `npm run research:report`.
5. Review the JSON/report manually before promoting any claim into `lib/brokers.ts`.
6. Keep unsupported claims as `needs_verification`.

## Promotion Rules

- Do not publish a rating, payout, license, country restriction, or safety claim without a visible source.
- Prefer official sources for product/account facts.
- Prefer regulator or government sources for warnings.
- Treat broker databases and review sites as partial evidence, not final proof.
- Do not auto-overwrite public content from scraped data.
