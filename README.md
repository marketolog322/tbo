# Broker Directory

Shadcn-style broker directory, aggregator, and review MVP built with Next.js, React 19, TypeScript 5, and Tailwind CSS 4.

## Scripts

- `npm install` installs dependencies.
- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm run research:brokers` runs the broker research pipeline.
- `npm run research:report` generates an editorial queue from the latest research run.

## Environment

- `FORMS_API_URL` points lead forms to the CRM form API. Default for local work is `https://group.quadcode.com`.
- `NEXT_PUBLIC_SITE_URL` sets canonical URLs and sitemap host.
- `TAVILY_API_KEY` enables source discovery for broker research.
- `FIRECRAWL_API_KEY` enables page scraping for broker research.
- `APIFY_API_TOKEN` is reserved for future crawl actors.

## Structure

- `app/` contains public routes for the homepage, broker directory, broker review pages, and affiliate program pages.
- `components/ui/` contains local shadcn-style primitives.
- `components/site/` contains product-specific broker directory components.
- `lib/brokers.ts` contains mock structured data shaped for later database-backed PSEO pages.
- `content/research/` contains the broker research config and ignored raw research runs.

## Notes

Affiliate links use disclosure copy and should use `rel="sponsored nofollow"` when replaced with real partner URLs. Sensitive pages or unclear claims should remain noindex-ready until human review.
