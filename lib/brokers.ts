export type BrokerStatus = "tracked" | "needs_verification" | "watchlist"
export type RiskLevel = "elevated" | "high" | "very_high"
export type SourceConfidence = "official_basics" | "partial" | "needs_verification"
export type VerticalSlug = "binary-options-brokers" | "forex-brokers" | "crypto-brokers" | "cfd-brokers"

export type Source = {
  title: string
  publisher: string
  url: string
  accessedAt: string
  type?: "official" | "regulator" | "database" | "review" | "affiliate"
  confidence?: SourceConfidence
}

export type AffiliateProgram = {
  slug: string
  name: string
  commercialStatus: "listed" | "needs_verification"
  model?: string
  evidenceStatus?: string
  cpaRange: string
  revshareRange: string
  cookieDuration: string
  payoutFrequency: string
  paymentMethods: string[]
  restrictedGeos: string[]
  applicationUrl: string
  trackingNotes?: string[]
  dueDiligenceNotes?: string[]
}

export type CloneScriptProfile = {
  slug: string
  title: string
  pageStatus: "research_template" | "needs_verification"
  positioning: string
  productAngle?: string
  buildScope: string[]
  operatorNotes?: string[]
  riskControls?: string[]
  complianceNotes: string[]
}

export type RatingCriterion = {
  label: string
  score: number
  note: string
}

export type BrokerReview = {
  overallScore: number
  trustScore: number
  externalScore: string
  scoreLabel: string
  ratingSummary: string
  verdict: string
  minimumTrade: string
  payoutRange: string
  withdrawalTime: string
  platform: string
  regulation: string
  companyEntity: string
  tradeableSymbols: string
  accountCurrencies: string
  paymentMethods: string[]
  pros: string[]
  cons: string[]
  ratings: RatingCriterion[]
  safetyChecks: {
    label: string
    status: "pass" | "warning" | "fail"
    detail: string
  }[]
  timeline: {
    year: string
    title: string
    detail: string
  }[]
  faqs: {
    question: string
    answer: string
  }[]
}

export type Broker = {
  slug: string
  name: string
  legalName: string
  summary: string
  founded: string
  headquarters: string
  verticals: VerticalSlug[]
  minDeposit: string
  demoAccount: string
  assets: string
  platformType: string
  restrictedRegions: string[]
  riskLevel: RiskLevel
  reviewStatus: BrokerStatus
  sourceConfidence: SourceConfidence
  lastVerifiedAt: string
  officialUrl: string
  keyNotes: string[]
  affiliateProgram: AffiliateProgram
  cloneScriptProfile: CloneScriptProfile
  review?: BrokerReview
  sources: Source[]
}

export const verticalLabels: Record<VerticalSlug, string> = {
  "binary-options-brokers": "Binary options",
  "forex-brokers": "Forex",
  "crypto-brokers": "Crypto",
  "cfd-brokers": "CFD",
}

export const brokerCategories: {
  slug: VerticalSlug
  label: string
  description: string
  status: "live" | "planned"
}[] = [
  {
    slug: "binary-options-brokers",
    label: "Binary options brokers",
    description: "Fixed-time and digital-options platforms with stricter risk notes.",
    status: "live",
  },
  {
    slug: "forex-brokers",
    label: "Forex brokers",
    description: "FX brokers, spreads, withdrawals, licenses, and country availability.",
    status: "planned",
  },
  {
    slug: "crypto-brokers",
    label: "Crypto brokers",
    description: "Crypto trading venues, product scope, restrictions, and fee evidence.",
    status: "planned",
  },
  {
    slug: "cfd-brokers",
    label: "CFD brokers",
    description: "CFD platforms, leverage notes, assets, and entity verification.",
    status: "planned",
  },
]

export const sourceConfidenceLabels: Record<SourceConfidence, string> = {
  official_basics: "Official basics",
  partial: "Partial source trail",
  needs_verification: "Needs verification",
}

export const brokers: Broker[] = [
  {
    slug: "quotex",
    name: "Quotex",
    legalName: "Quotex",
    summary:
      "Digital-options platform tracked for minimum deposit, product scope, country restrictions, and source freshness.",
    founded: "2019",
    headquarters: "Not clearly verified",
    verticals: ["binary-options-brokers"],
    minDeposit: "$10",
    demoAccount: "Available",
    assets: "Digital options on currencies, crypto, commodities, and indices",
    platformType: "Digital options",
    restrictedRegions: ["United States", "Canada", "Hong Kong", "EEA checks required"],
    riskLevel: "high",
    reviewStatus: "tracked",
    sourceConfidence: "official_basics",
    lastVerifiedAt: "2026-05-13",
    officialUrl: "https://qxbroker.com/en/faq",
    keyNotes: ["Minimum deposit appears in official FAQ", "Regulatory entity requires manual verification"],
    affiliateProgram: {
      slug: "quotex",
      name: "Quotex affiliate program",
      commercialStatus: "listed",
      model: "RevShare / turnover share",
      evidenceStatus: "Affiliate terms page found; entity and geo acceptance still need compliance review.",
      cpaRange: "Needs verification",
      revshareRange: "50%-80% revenue share; 2%-5% turnover share reported by affiliate terms",
      cookieDuration: "Needs verification",
      payoutFrequency: "Weekly payments reported in affiliate terms",
      paymentMethods: ["Billing details required in affiliate dashboard", "Specific payout rails need login verification"],
      restrictedGeos: ["United States", "Canada", "Hong Kong"],
      applicationUrl: "https://quotex.dev/en/affiliate-programs/",
      trackingNotes: [
        "Affiliate level appears to reset monthly based on referred trader deposit activity.",
        "First payout appears gated by an initial FTD requirement in the affiliate terms.",
        "Turnover-share commissions are capped by company profit in the terms language.",
      ],
      dueDiligenceNotes: [
        "Do not promote in restricted jurisdictions or with guaranteed-return language.",
        "Validate the current partner domain before sending traffic.",
        "Keep the broker-risk review linked next to any commercial page.",
      ],
    },
    cloneScriptProfile: createCloneScriptProfile("quotex", "Quotex"),
    review: createQuotexReview(),
    sources: [
      {
        title: "FAQ and account funding information",
        publisher: "QxBroker",
        url: "https://qxbroker.com/en/faq",
        accessedAt: "2026-05-12",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Affiliate program terms and commission models",
        publisher: "Quotex Affiliate",
        url: "https://quotex.dev/en/affiliate-programs/",
        accessedAt: "2026-05-12",
        type: "affiliate",
        confidence: "partial",
      },
      {
        title: "Quotex regulation status",
        publisher: "Traders Union",
        url: "https://tradersunion.com/brokers/binary/view/quotex/rules-and-regulations/",
        accessedAt: "2026-05-12",
        type: "review",
        confidence: "partial",
      },
      {
        title: "Quotex available and restricted countries",
        publisher: "Traders Union",
        url: "https://tradersunion.com/brokers/binary/view/quotex/which-countries-accept/",
        accessedAt: "2026-05-12",
        type: "review",
        confidence: "partial",
      },
      {
        title: "Quotex broker profile and WikiFX score",
        publisher: "WikiFX",
        url: "https://www.wikifx.com/en/dealer/2675855266.html",
        accessedAt: "2026-05-12",
        type: "database",
        confidence: "partial",
      },
      {
        title: "Quotex added to warning list",
        publisher: "Financial Commission",
        url: "https://financialcommission.org/2021/07/14/scam-alert-quotex-added-to-warning-list/",
        accessedAt: "2026-05-12",
        type: "regulator",
        confidence: "partial",
      },
      {
        title: "CVM warning on Maxbit LLC / Quotex brand",
        publisher: "Comissão de Valores Mobiliários",
        url: "https://www.gov.br/cvm/pt-br/assuntos/noticias/2025/cvm-alerta-para-atuacao-irregular-de-maxbit-llc",
        accessedAt: "2026-05-12",
        type: "regulator",
        confidence: "partial",
      },
    ],
  },
  {
    slug: "pocket-option",
    name: "Pocket Option",
    legalName: "Pocket Option",
    summary:
      "High-visibility quick-trading brand with official account/payment pages and regulator warning records that require prominent risk treatment.",
    founded: "2017",
    headquarters: "Costa Rica entity reported by third-party databases",
    verticals: ["binary-options-brokers"],
    minDeposit: "$5; method and country can vary",
    demoAccount: "$50,000 virtual demo balance reported by official blog",
    assets: "Quick-trading assets across currencies, crypto, commodities, stocks, and indices; exact list varies",
    platformType: "Quick trading / binary options",
    restrictedRegions: ["United States", "United Kingdom", "EEA checks required", "Warning-list markets"],
    riskLevel: "very_high",
    reviewStatus: "tracked",
    sourceConfidence: "official_basics",
    lastVerifiedAt: "2026-05-13",
    officialUrl: "https://pocketoption.com/blog/en/interesting/trading-platforms/what-is-the-minimum-deposit-in-pocket-option/",
    keyNotes: [
      "Official blog reports $5 minimum deposit, with method/country variation",
      "Official demo-account article reports a $50,000 virtual balance",
      "FCA warning says PocketOption is not authorised in the UK",
      "CFTC RED List record names Pocketoption in relation to binary options offered to US customers without CFTC registration",
    ],
    affiliateProgram: {
      slug: "pocket-option",
      name: "Pocket Option affiliate program",
      commercialStatus: "listed",
      model: "RevShare / first-deposit style partner offers",
      evidenceStatus: "Pocket Partners / DataMotion pages found; regulatory suitability remains high-risk.",
      cpaRange: "Country and offer dependent; needs dashboard verification",
      revshareRange: "Up to 80% revenue share reported by Pocket Partners/DataMotion materials",
      cookieDuration: "Needs verification",
      payoutFrequency: "24/7 payout language appears on DataMotion partner page",
      paymentMethods: ["Partner payout methods shown after affiliate login", "Specific rails need account verification"],
      restrictedGeos: ["United States checks required", "EEA checks required", "Warning-list markets need block rules"],
      applicationUrl: "https://datamotion.partners/en",
      trackingNotes: [
        "Official partner materials emphasize realtime statistics, promo codes, and custom creatives.",
        "Public pages discuss first-deposit style earnings but do not expose a stable public CPA table.",
        "Treat any country payout calculator as marketing material until verified inside the partner dashboard.",
      ],
      dueDiligenceNotes: [
        "Avoid traffic from markets where binary options or the broker are restricted.",
        "Keep withdrawal-complaint and no-tier-one-license warnings visible on affiliate content.",
        "Require documented sub-affiliate, bonus, and negative-balance terms before paid traffic.",
      ],
    },
    cloneScriptProfile: createCloneScriptProfile("pocket-option", "Pocket Option"),
    review: createPocketOptionReview(),
    sources: [
      {
        title: "Minimum deposit article",
        publisher: "Pocket Option",
        url: "https://pocketoption.com/blog/en/interesting/trading-platforms/what-is-the-minimum-deposit-in-pocket-option/",
        accessedAt: "2026-05-11",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Demo account article",
        publisher: "Pocket Option",
        url: "https://pocketoption.com/blog/en/interesting/trading-platforms/pocket-option-demo-account/",
        accessedAt: "2026-05-11",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Payment policy",
        publisher: "Pocket Option",
        url: "https://pocketoption.com/en/payment-policy/",
        accessedAt: "2026-05-11",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Payment methods overview",
        publisher: "Pocket Option",
        url: "https://pocketoption.com/blog/en/platform-update/pocket-option-payment-methods-overview/",
        accessedAt: "2026-05-13",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Withdrawal timing article",
        publisher: "Pocket Option",
        url: "https://pocketoption.com/blog/en/knowledge-base/learning/how-long-does-pocket-option-withdrawal-take/",
        accessedAt: "2026-05-13",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "PocketOption unauthorized firm warning",
        publisher: "Financial Conduct Authority",
        url: "https://www.fca.org.uk/news/warnings/pocketoption",
        accessedAt: "2026-05-13",
        type: "regulator",
        confidence: "official_basics",
      },
      {
        title: "CFTC RED List record",
        publisher: "Commodity Futures Trading Commission",
        url: "https://www.cftc.gov/REDlist/node/241216",
        accessedAt: "2026-05-13",
        type: "regulator",
        confidence: "official_basics",
      },
      {
        title: "Pocket Option official affiliate program",
        publisher: "DataMotion Partners",
        url: "https://datamotion.partners/en",
        accessedAt: "2026-05-12",
        type: "affiliate",
        confidence: "partial",
      },
      {
        title: "PocketOption broker profile",
        publisher: "WikiFX",
        url: "https://www.wikifx.com/en/dealer/1401985321.html",
        accessedAt: "2026-05-11",
        type: "database",
        confidence: "partial",
      },
      {
        title: "Pocket Option review and risk report",
        publisher: "WikiFX",
        url: "https://www.wikifx.com/en/newsdetail/202601262764816748.html",
        accessedAt: "2026-05-11",
        type: "review",
        confidence: "partial",
      },
      {
        title: "Pocket Option red-flag broker review",
        publisher: "BrokersView",
        url: "https://www.brokersview.com/brokers/pocket-option",
        accessedAt: "2026-05-11",
        type: "database",
        confidence: "partial",
      },
    ],
  },
  {
    slug: "iq-option",
    name: "IQ Option",
    legalName: "IQ Option Europe Ltd. / group entities",
    summary:
      "Established trading platform with clearer company-history and EEA license references than most binary-options competitors.",
    founded: "2013",
    headquarters: "Cyprus entity for EEA",
    verticals: ["binary-options-brokers"],
    minDeposit: "$10",
    demoAccount: "Available",
    assets: "Options/CFD-style trading products vary by region",
    platformType: "Trading platform with options history",
    restrictedRegions: ["United States", "Region-specific product restrictions"],
    riskLevel: "elevated",
    reviewStatus: "tracked",
    sourceConfidence: "official_basics",
    lastVerifiedAt: "2026-05-13",
    officialUrl: "https://blog.iqoption.com/en/is-iq-option-legit-5-criteria-for-evaluating-trustworthiness/",
    keyNotes: [
      "Official article references 2013 launch",
      "CySEC register lists IQOption Europe Ltd with licence number 247/14",
      "Official download page lists web, desktop, iOS, and Android app routes",
    ],
    affiliateProgram: {
      slug: "iq-option",
      name: "IQ Option affiliate program",
      commercialStatus: "listed",
      model: "RevShare + CPA offer family",
      evidenceStatus: "Official affiliate agreement found; offer availability and country eligibility still vary.",
      cpaRange: "CPA model mentioned in official agreement; exact rates need offer-level verification",
      revshareRange: "50% revenue share, or 40% per trader separately, per official agreement",
      cookieDuration: "Needs verification",
      payoutFrequency: "Twice monthly, within 3 business days after the 10th and 25th; $10 minimum payout",
      paymentMethods: ["Preferred online payment system", "Specific rails require affiliate account verification"],
      restrictedGeos: ["United States", "Bangladesh", "Iran", "North Korea", "Latvia", "Region-specific restrictions"],
      applicationUrl: "https://affiliate.iqoption.com/en/scheme",
      trackingNotes: [
        "Official affiliate page describes tagging users to a unique affiliate ID.",
        "Revenue share is tied to client trading activity while clients remain active.",
        "Official affiliate agreement should be checked before publishing exact CPA or payment-rail claims.",
      ],
      dueDiligenceNotes: [
        "Check whether traffic is routed to the EEA CySEC entity or another group entity.",
        "Do not make blanket regulation claims for non-EEA users.",
        "Verify allowed products and countries before running binary-options keywords.",
      ],
    },
    cloneScriptProfile: createCloneScriptProfile("iq-option", "IQ Option", "multi-asset web and mobile trading platform"),
    review: createIqOptionReview(),
    sources: [
      {
        title: "Trustworthiness and company criteria",
        publisher: "IQ Option Blog",
        url: "https://blog.iqoption.com/en/is-iq-option-legit-5-criteria-for-evaluating-trustworthiness/",
        accessedAt: "2026-05-12",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Safety and regulation by entity",
        publisher: "IQ Option Official Blog",
        url: "https://blog.iqoption.com/en/is-iq-option-safe-everything-you-need-to-know-in-2026/",
        accessedAt: "2026-05-12",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Affiliate program scheme",
        publisher: "IQ Option Affiliate",
        url: "https://affiliate.iqoption.com/en/scheme",
        accessedAt: "2026-05-12",
        type: "affiliate",
        confidence: "official_basics",
      },
      {
        title: "IQOption Europe Ltd CySEC register record",
        publisher: "Cyprus Securities and Exchange Commission",
        url: "https://www.cysec.gov.cy/en-GB/entities/investment-firms/cypriot/40647/",
        accessedAt: "2026-05-13",
        type: "regulator",
        confidence: "official_basics",
      },
      {
        title: "Demo trading account",
        publisher: "IQ Option",
        url: "https://iqoption.com/en/demo-trading",
        accessedAt: "2026-05-13",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Platform and app downloads",
        publisher: "IQ Option",
        url: "https://iqoption.com/en/download",
        accessedAt: "2026-05-13",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Affiliate agreement",
        publisher: "IQ Option Affiliate",
        url: "https://affiliate.iqoption.com/en/agreement",
        accessedAt: "2026-05-13",
        type: "affiliate",
        confidence: "official_basics",
      },
      {
        title: "IQ Option broker profile",
        publisher: "WikiFX",
        url: "https://www.wikifx.com/en/dealer/9941528702.html",
        accessedAt: "2026-05-12",
        type: "database",
        confidence: "partial",
      },
    ],
  },
  {
    slug: "olymp-trade",
    name: "Olymp Trade",
    legalName: "Olymp Trade",
    summary:
      "Long-running fixed-time trading brand. Official support materials confirm low deposit thresholds; entity details need regional review.",
    founded: "2014",
    headquarters: "Needs verification by region",
    verticals: ["binary-options-brokers"],
    minDeposit: "$10 / €10",
    demoAccount: "Available",
    assets: "Fixed-time trades and market assets vary by jurisdiction",
    platformType: "Fixed-time trades",
    restrictedRegions: ["United States checks required", "EEA checks required"],
    riskLevel: "high",
    reviewStatus: "tracked",
    sourceConfidence: "official_basics",
    lastVerifiedAt: "2026-05-12",
    officialUrl: "https://olymptrade.com/pages/about/support",
    keyNotes: ["Official support FAQ confirms deposit threshold", "Regional availability should be reviewed before SEO expansion"],
    affiliateProgram: {
      slug: "olymp-trade",
      name: "Olymp Trade affiliate program",
      commercialStatus: "needs_verification",
      model: "Partner / traffic referral model",
      evidenceStatus: "No stable official public commission table confirmed in this pass.",
      cpaRange: "Needs verification",
      revshareRange: "Needs verification",
      cookieDuration: "Needs verification",
      payoutFrequency: "Needs verification",
      paymentMethods: ["Needs verification"],
      restrictedGeos: ["United States checks required", "EEA checks required", "CySEC warning markets need caution"],
      applicationUrl: "https://olymptrade.com/pages/about/support",
      trackingNotes: [
        "Commercial terms should be verified in a partner dashboard or signed terms before publication.",
        "Support/FAQ pages confirm product basics, not affiliate economics.",
      ],
      dueDiligenceNotes: [
        "Keep affiliate content conservative until a public partner source is confirmed.",
        "Do not imply top-tier regulation; surface warning-list and offshore-license concerns.",
      ],
    },
    cloneScriptProfile: createCloneScriptProfile("olymp-trade", "Olymp Trade", "fixed-time trading and forex-style product suite"),
    review: createOlympTradeReview(),
    sources: [
      {
        title: "Support FAQ",
        publisher: "Olymp Trade",
        url: "https://olymptrade.com/pages/about/support",
        accessedAt: "2026-05-12",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Trading FAQ",
        publisher: "Olymptrade",
        url: "https://olymptrade.com/pages/about/faq",
        accessedAt: "2026-05-12",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Olymp Trade broker profile and complaint count",
        publisher: "WikiFX",
        url: "https://www.wikifx.com/en/dealer/7211454707.html",
        accessedAt: "2026-05-12",
        type: "database",
        confidence: "partial",
      },
      {
        title: "Olymp Trade broker risk review",
        publisher: "BrokersView",
        url: "https://www.brokersview.com/brokers/olymp-trade",
        accessedAt: "2026-05-12",
        type: "database",
        confidence: "partial",
      },
    ],
  },
  {
    slug: "binomo",
    name: "Binomo",
    legalName: "Binomo",
    summary:
      "Fixed-time trading brand with official educational material referencing demo access and low starting deposit.",
    founded: "2014",
    headquarters: "Needs verification",
    verticals: ["binary-options-brokers"],
    minDeposit: "$10",
    demoAccount: "Available",
    assets: "Fixed-time trading assets",
    platformType: "Fixed-time trades",
    restrictedRegions: ["United States checks required", "EEA checks required"],
    riskLevel: "high",
    reviewStatus: "tracked",
    sourceConfidence: "official_basics",
    lastVerifiedAt: "2026-05-12",
    officialUrl: "https://blog.binomo.com/about-binomo/",
    keyNotes: ["Official blog source references $10 minimum deposit", "Regulatory and country availability require manual verification"],
    affiliateProgram: {
      slug: "binomo",
      name: "Binomo affiliate program",
      commercialStatus: "listed",
      model: "Affiliate Top / partner traffic model",
      evidenceStatus: "Official help center confirms the program exists; public rates come from lower-confidence partner pages.",
      cpaRange: "CPA/CPL referenced by third-party/partner pages; exact rates need program login verification",
      revshareRange: "Up to 70% appears on partner marketing pages; needs official contract verification",
      cookieDuration: "Needs verification",
      payoutFrequency: "Weekly/twice-monthly claims appear on partner pages; needs contract verification",
      paymentMethods: ["Skrill/WebMoney mentioned by partner pages", "Exact payout rails need Affiliate Top verification"],
      restrictedGeos: ["United States checks required", "EEA checks required", "CNMV/CySEC/CVM warning markets"],
      applicationUrl: "https://helpcenter.binomo4.com/hc/en-us/articles/360046325233-What-is-the-Binomo-affiliate-program",
      trackingNotes: [
        "Official help center says Binomo is managed through Affiliate Top and pays based on trader activity.",
        "Rate tables should remain needs-verification until confirmed in Affiliate Top or signed terms.",
        "Referral program and affiliate program are separate flows and should not be mixed in copy.",
      ],
      dueDiligenceNotes: [
        "Show country restrictions next to any affiliate page.",
        "Avoid claiming regulation from Financial Commission as if it were a state financial regulator.",
        "Keep withdrawal/blocked-account warning evidence visible.",
      ],
    },
    cloneScriptProfile: createCloneScriptProfile("binomo", "Binomo", "fixed-time trading platform with demo-first onboarding"),
    review: createBinomoReview(),
    sources: [
      {
        title: "About Binomo",
        publisher: "Binomo Blog",
        url: "https://blog.binomo.com/about-binomo/",
        accessedAt: "2026-05-12",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "What is a demo account?",
        publisher: "Binomo Help Center",
        url: "https://helpcenter.binomo4.com/hc/en-us/articles/4407442649619-What-s-a-demo-account",
        accessedAt: "2026-05-12",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "What is the Binomo affiliate program?",
        publisher: "Binomo Help Center",
        url: "https://helpcenter.binomo4.com/hc/en-us/articles/360046325233-What-is-the-Binomo-affiliate-program",
        accessedAt: "2026-05-12",
        type: "affiliate",
        confidence: "official_basics",
      },
      {
        title: "Binomo broker profile",
        publisher: "BrokersView",
        url: "https://www.brokersview.com/brokers/binomo",
        accessedAt: "2026-05-12",
        type: "database",
        confidence: "partial",
      },
      {
        title: "Binomo review and warning summary",
        publisher: "WikiFX",
        url: "https://www.wikifx.com/en/newsdetail/202602216904802418.html",
        accessedAt: "2026-05-12",
        type: "review",
        confidence: "partial",
      },
    ],
  },
  {
    slug: "deriv",
    name: "Deriv",
    legalName: "Deriv group entities",
    summary:
      "Options and derivatives platform with comparatively strong official documentation for regulation, product types, payment methods, apps, and partner terms.",
    founded: "1999",
    headquarters: "Group entities by region",
    verticals: ["binary-options-brokers"],
    minDeposit: "Low entry; method-dependent",
    demoAccount: "Available",
    assets: "Options on forex, synthetic indices, stocks, commodities, and crypto where available",
    platformType: "Options and derivatives",
    restrictedRegions: ["United States", "Canada", "Hong Kong", "Region-specific restrictions"],
    riskLevel: "elevated",
    reviewStatus: "tracked",
    sourceConfidence: "official_basics",
    lastVerifiedAt: "2026-05-13",
    officialUrl: "https://trade.deriv.com/trade/options/digital-options",
    keyNotes: [
      "Official regulatory page lists multiple Deriv entities and jurisdictions",
      "Official payment-methods page documents method-dependent deposits and withdrawals",
      "Deriv GO and partner commission documentation are available from official Deriv pages",
    ],
    affiliateProgram: {
      slug: "deriv",
      name: "Deriv affiliate program",
      commercialStatus: "listed",
      model: "Partner / affiliate / IB",
      cpaRange: "$100 CPA per qualified EU referral, excluding Spain and Portugal, per partner-academy page",
      evidenceStatus: "Official partner and partner-academy pages found with public options, CFD, revenue-share, turnover, and CPA language.",
      revshareRange: "Revenue share 30%-45%; turnover commission also available",
      cookieDuration: "Needs verification",
      payoutFrequency: "Monthly payouts from the 15th; minimum payout depends on rail",
      paymentMethods: ["Neteller minimum payout $10", "Cryptocurrency minimum payout $500", "Other rails need Partner Hub verification"],
      restrictedGeos: ["United States", "Canada", "Hong Kong"],
      applicationUrl: "https://deriv.com/partners",
      trackingNotes: [
        "Official partner page separates CFD and options earnings.",
        "Options earnings reference Deriv Trader, Deriv Bot, Deriv GO, SmartTrader, and Deriv API-built apps.",
        "Country availability and entity routing must be checked before traffic launch.",
      ],
      dueDiligenceNotes: [
        "Deriv is better documented than most peers, but derivatives/options risk disclosure is still required.",
        "Do not market synthetic indices or options into restricted jurisdictions.",
        "Validate entity, partner agreement, and payout method before publishing offer rates.",
      ],
    },
    cloneScriptProfile: createCloneScriptProfile("deriv", "Deriv", "options, multipliers, synthetic-indices, and CFD platform"),
    review: createDerivReview(),
    sources: [
      {
        title: "Options product page",
        publisher: "Deriv",
        url: "https://trade.deriv.com/trade/options/digital-options",
        accessedAt: "2026-05-12",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Regulatory information",
        publisher: "Deriv",
        url: "https://deriv.com/regulatory",
        accessedAt: "2026-05-13",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Payment methods",
        publisher: "Deriv",
        url: "https://deriv.com/payment-methods",
        accessedAt: "2026-05-13",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Deposits and withdrawals help centre",
        publisher: "Deriv",
        url: "https://deriv.com/help-centre/deposits-and-withdrawals",
        accessedAt: "2026-05-12",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Help Centre",
        publisher: "Deriv",
        url: "https://deriv.com/help-centre",
        accessedAt: "2026-05-12",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Deriv GO mobile app",
        publisher: "Deriv",
        url: "https://deriv.com/trading-platforms/deriv-go",
        accessedAt: "2026-05-13",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "Partner program",
        publisher: "Deriv",
        url: "https://deriv.com/partners",
        accessedAt: "2026-05-12",
        type: "affiliate",
        confidence: "official_basics",
      },
      {
        title: "Commission plans",
        publisher: "Deriv Partners Academy",
        url: "https://partners-academy.deriv.com/articles/deriv-commission-plans",
        accessedAt: "2026-05-13",
        type: "affiliate",
        confidence: "official_basics",
      },
    ],
  },
  {
    slug: "expertoption",
    name: "ExpertOption",
    legalName: "ExpertOption",
    summary:
      "Binary-options brand with official FAQ material for account funding basics; wider compliance details remain verification items.",
    founded: "2014",
    headquarters: "Needs verification",
    verticals: ["binary-options-brokers"],
    minDeposit: "$10",
    demoAccount: "Available",
    assets: "Binary options / digital trading assets",
    platformType: "Binary options",
    restrictedRegions: ["United States checks required", "EEA checks required"],
    riskLevel: "very_high",
    reviewStatus: "tracked",
    sourceConfidence: "partial",
    lastVerifiedAt: "2026-05-12",
    officialUrl: "https://ru.expertoption.com/trade/faq/",
    keyNotes: ["Official FAQ confirms $10 deposit/withdrawal basics", "English source trail should be strengthened"],
    affiliateProgram: {
      slug: "expertoption",
      name: "ExpertOption affiliate program",
      commercialStatus: "needs_verification",
      model: "Partner / traffic referral model",
      evidenceStatus: "No reliable official public commission table confirmed; broker FAQ only supports account basics.",
      cpaRange: "Needs verification",
      revshareRange: "Needs verification",
      cookieDuration: "Needs verification",
      payoutFrequency: "Needs verification",
      paymentMethods: ["Needs verification"],
      restrictedGeos: ["Needs verification"],
      applicationUrl: "https://ru.expertoption.com/trade/faq/",
      trackingNotes: [
        "Affiliate economics should be treated as unavailable until an official partner page or signed terms are confirmed.",
        "Broker FAQ confirms funding and verification basics, not partner payouts.",
      ],
      dueDiligenceNotes: [
        "Do not publish CPA/revshare claims from mirror or unofficial pages without corroboration.",
        "Surface the no-tier-one-license and post-deposit verification concerns on affiliate pages.",
      ],
    },
    cloneScriptProfile: createCloneScriptProfile("expertoption", "ExpertOption", "binary-options trading platform with deposit-gated verification"),
    review: createExpertOptionReview(),
    sources: [
      {
        title: "Trading FAQ",
        publisher: "ExpertOption",
        url: "https://ru.expertoption.com/trade/faq/",
        accessedAt: "2026-05-12",
        type: "official",
        confidence: "official_basics",
      },
      {
        title: "English FAQ mirror",
        publisher: "ExpertOption",
        url: "https://www.expertoption.money/trade/faq/",
        accessedAt: "2026-05-12",
        type: "official",
        confidence: "partial",
      },
    ],
  },
  {
    slug: "binarium",
    name: "Binarium",
    legalName: "Binarium",
    summary:
      "Binary-options brand kept in research-only coverage because official product claims are thin and the FCA has published an unauthorized-firm warning.",
    founded: "Needs verification",
    headquarters: "Needs verification",
    verticals: ["binary-options-brokers"],
    minDeposit: "$5 reported by third-party databases; official confirmation weak",
    demoAccount: "Demo account reported by third-party databases; official confirmation weak",
    assets: "Currencies, options and related assets reported by third-party databases; verify in account",
    platformType: "Binary options",
    restrictedRegions: ["United Kingdom warning", "Needs country-by-country verification"],
    riskLevel: "very_high",
    reviewStatus: "needs_verification",
    sourceConfidence: "partial",
    lastVerifiedAt: "2026-05-13",
    officialUrl: "https://binarium.com/",
    keyNotes: [
      "Requested for inclusion",
      "FCA warning says Binarium is not authorised or registered in the UK",
      "Do not publish commercial claims until official product, entity, and withdrawal terms are stronger",
    ],
    affiliateProgram: {
      slug: "binarium",
      name: "Binarium affiliate program",
      commercialStatus: "needs_verification",
      model: "Unverified partner/referral model",
      evidenceStatus: "No reliable official affiliate program source confirmed; multiple mirror-like pages found.",
      cpaRange: "Needs verification",
      revshareRange: "Needs verification",
      cookieDuration: "Needs verification",
      payoutFrequency: "Needs verification",
      paymentMethods: ["Needs verification"],
      restrictedGeos: ["Needs verification"],
      applicationUrl: "https://binarium.com/",
      trackingNotes: [
        "Do not publish affiliate rates until an official partner domain is confirmed.",
        "Treat mirror/blog affiliate pages as low-confidence evidence.",
      ],
      dueDiligenceNotes: [
        "CySEC/FCA/WikiFX/BrokersView risk signals make this a research-only affiliate page.",
        "Keep page no-promo in tone and avoid traffic-driving copy.",
        "Require domain/entity verification before adding any commercial CTA.",
      ],
    },
    cloneScriptProfile: createCloneScriptProfile("binarium", "Binarium", "binary-options account-tier platform reference"),
    review: createBinariumReview(),
    sources: [
      {
        title: "Official website",
        publisher: "Binarium",
        url: "https://binarium.com/",
        accessedAt: "2026-05-12",
        type: "official",
        confidence: "needs_verification",
      },
      {
        title: "Binarium unauthorized firm warning",
        publisher: "Financial Conduct Authority",
        url: "https://www.fca.org.uk/news/warnings/binarium",
        accessedAt: "2026-05-13",
        type: "regulator",
        confidence: "official_basics",
      },
      {
        title: "Binarium broker profile and warning records",
        publisher: "WikiFX",
        url: "https://www.wikifx.com/en/dealer/4861455002.html",
        accessedAt: "2026-05-12",
        type: "database",
        confidence: "partial",
      },
      {
        title: "Binarium broker profile",
        publisher: "BrokersView",
        url: "https://www.brokersview.com/brokers/binarium",
        accessedAt: "2026-05-12",
        type: "database",
        confidence: "partial",
      },
    ],
  },
]

export const featuredRegions = ["Global", "Brazil", "India", "South Africa", "LATAM"]

export function normalizeBrokerSlug(slug: string) {
  return decodeURIComponent(slug).trim().toLowerCase().replace(/\/+$/, "")
}

export function getBroker(slug: string) {
  const normalizedSlug = normalizeBrokerSlug(slug)

  return brokers.find((broker) => broker.slug === normalizedSlug)
}

export function getAffiliateProgram(slug: string) {
  const broker = getBroker(slug)

  return broker ? { broker, program: broker.affiliateProgram } : undefined
}

export function getCloneScriptProfile(slug: string) {
  const broker = getBroker(slug)

  return broker ? { broker, profile: broker.cloneScriptProfile } : undefined
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00Z`))
}

export function getVerifiedBasicsCount() {
  return brokers.filter((broker) => broker.sourceConfidence === "official_basics").length
}

export function getVerificationQueueCount() {
  return brokers.filter((broker) => broker.reviewStatus !== "tracked" || broker.sourceConfidence === "needs_verification").length
}

function createCloneScriptProfile(slug: string, brokerName: string, productAngle = "binary-options style trading room"): CloneScriptProfile {
  return {
    slug,
    title: `Build a brokerage with ${brokerName} clone script`,
    pageStatus: "research_template",
    positioning:
      "A research page for teams comparing white-label trading platform requirements, not a recommendation to copy branding, impersonate a broker, or bypass licensing.",
    productAngle,
    buildScope: [
      "Trading room UX and instrument list model",
      "KYC, payments, and withdrawal workflow requirements",
      "Risk warnings, regional restrictions, and audit logs",
      "Admin console, affiliate tracking, and content operations",
    ],
    operatorNotes: [
      "Use the broker as a product reference only; build a distinct brand, domain, and legal entity.",
      "Document deposit, withdrawal, bonus, and trade-settlement rules before traffic launch.",
      "Separate marketing funnels from compliance approval so high-risk geos can be blocked early.",
    ],
    riskControls: [
      "Geo blocking and country-level product restrictions",
      "KYC and source-of-funds checks before withdrawals",
      "Bonus abuse, duplicate-account, and payment-risk monitoring",
      "Audit logs for pricing, quotes, trade settlement, and account changes",
    ],
    complianceNotes: [
      "Do not reuse protected brand assets, logos, or misleading domain names.",
      "Treat payments, trading, and bonus mechanics as regulated workflows.",
      "Confirm licensing, disclosures, and jurisdiction rules before launch.",
    ],
  }
}

function createQuotexReview(): BrokerReview {
  return {
    overallScore: 2.1,
    trustScore: 23,
    externalScore: "WikiFX lists Quotex around 1.5/10 in recent broker profile pages",
    scoreLabel: "High-risk / source-limited",
    ratingSummary:
      "Quotex has a low entry threshold and simple proprietary web platform, but its review score is held down by missing tier-one regulation, warning-list records, restricted-market concerns, and withdrawal-complaint risk reported by third-party databases.",
    verdict:
      "Quotex should be treated as a high-risk digital-options venue, not as a regulated broker. The strongest verified facts are product basics from the official FAQ; regulatory protection and dispute-resolution coverage remain the main weaknesses.",
    minimumTrade: "$1 reported by industry reviews; verify in account before funding",
    payoutRange: "Official FAQ says profit can be up to 98% of investment; payout varies by asset and time",
    withdrawalTime: "Official FAQ states withdrawals average 1-5 days after request receipt",
    platform: "Proprietary web platform; no download required according to official FAQ",
    regulation: "No confirmed tier-one license; third-party sources report no FCA/CySEC/ASIC-style supervision",
    companyEntity: "ON SPOT LLC GROUP / prior Maxbit LLC references appear across third-party records",
    tradeableSymbols: "Underlying assets include currency pairs, securities, commodities/metals and indices per official FAQ",
    accountCurrencies: "USD by default; profile-level currency switching mentioned in the official FAQ",
    paymentMethods: ["Cards and online payment methods", "Crypto withdrawals from $50", "Methods vary by account region"],
    pros: [
      "$10 minimum deposit is stated in official FAQ",
      "Demo account is described as free for practicing digital options",
      "Browser-based platform does not require desktop/mobile installation",
      "Clear product mechanics: fixed potential profit/loss before trade execution",
    ],
    cons: [
      "No confirmed tier-one regulation or statutory compensation protection",
      "Binary/digital options are restricted in several major jurisdictions",
      "Third-party databases report warnings and unresolved withdrawal/account complaints",
      "Proprietary platform means pricing and execution transparency require extra scrutiny",
    ],
    ratings: [
      {
        label: "Regulation",
        score: 0.8,
        note: "No verified top-tier license found; warning-list records materially reduce the safety score.",
      },
      {
        label: "Fees",
        score: 3.8,
        note: "$10 minimum deposit and $1 trade size are competitive, but full fee transparency is limited.",
      },
      {
        label: "Platform",
        score: 3.4,
        note: "Web platform is simple and accessible, but proprietary execution limits independent transparency.",
      },
      {
        label: "Markets",
        score: 3.1,
        note: "Official FAQ lists major underlying asset classes, but live asset count varies by region/session.",
      },
      {
        label: "Payments",
        score: 2.2,
        note: "Official FAQ gives clear minimums and timelines, while external complaint sources flag withdrawal risk.",
      },
      {
        label: "Support",
        score: 1.9,
        note: "Support and dispute-resolution confidence is limited by warning-list and complaint records.",
      },
    ],
    safetyChecks: [
      {
        label: "Official product basics",
        status: "pass",
        detail: "FAQ confirms digital-options mechanics, asset categories, demo usage, minimum deposit and withdrawals.",
      },
      {
        label: "Tier-one regulation",
        status: "fail",
        detail: "No FCA, CySEC, ASIC, CFTC or equivalent supervision is verified in the gathered sources.",
      },
      {
        label: "Restricted jurisdictions",
        status: "warning",
        detail: "USA, Canada, EEA/EU, Hong Kong and several other markets require special caution or are reported restricted.",
      },
      {
        label: "User complaint risk",
        status: "warning",
        detail: "WikiFX and other broker databases report unresolved complaints around withdrawals/account access.",
      },
    ],
    timeline: [
      {
        year: "2019",
        title: "Platform launch claim",
        detail: "Quotex-related sources commonly describe the platform as launched around 2019.",
      },
      {
        year: "2021",
        title: "Financial Commission warning",
        detail: "Financial Commission placed Quotex/Quotex LTD on its warning list.",
      },
      {
        year: "2023",
        title: "European warnings reported",
        detail: "Broker-watch sources report CMVM and CONSOB warnings around Quotex/related entities.",
      },
      {
        year: "2025-2026",
        title: "More country-level scrutiny",
        detail: "Recent sources report additional concerns around restricted countries and unauthorized operations.",
      },
    ],
    faqs: [
      {
        question: "Is Quotex regulated?",
        answer:
          "We did not verify a tier-one financial license for Quotex. Traders Union and WikiFX describe Quotex as lacking major-regulator oversight, so the page labels regulation as a major risk area.",
      },
      {
        question: "What is the minimum deposit on Quotex?",
        answer:
          "The official QxBroker FAQ states a minimum deposit of 10 US dollars. Users should still check the account screen because payment methods and regional rules can change.",
      },
      {
        question: "Does Quotex offer a demo account?",
        answer:
          "The official FAQ describes a free training account for practicing digital options and testing strategies without cash.",
      },
      {
        question: "Can users in the USA or EEA use Quotex?",
        answer:
          "Third-party country guides and regulatory summaries report that Quotex is restricted or unavailable in the USA, Canada, EEA/EU countries, Hong Kong and other high-compliance regions.",
      },
      {
        question: "Is this review investment advice?",
        answer:
          "No. The page is a source-backed broker review and risk summary. It does not recommend opening an account or placing trades.",
      },
    ],
  }
}

function createPocketOptionReview(): BrokerReview {
  return {
    overallScore: 1.9,
    trustScore: 18,
    externalScore: "FCA and CFTC records now provide stronger regulator-backed warning evidence than review databases alone",
    scoreLabel: "Very high-risk / source-limited",
    ratingSummary:
      "Pocket Option has official material for low minimum deposit, demo access, payment methods, and withdrawal timing, but regulator records are now the dominant review signal: the FCA warns the firm is not authorised in the UK, and the CFTC RED List names Pocketoption in relation to binary options offered to US customers without CFTC registration.",
    verdict:
      "Pocket Option should be treated as a very high-risk quick-trading venue. Account-basics pages are easy to find, but UK and US regulator records mean country eligibility, investor protection, and withdrawal expectations need prominent caution before any user considers funding.",
    minimumTrade: "Needs account-screen verification; do not infer from deposit minimum",
    payoutRange: "Needs verification from current account screens and product terms",
    withdrawalTime: "Official materials discuss method-dependent withdrawals; older payment-policy language also references processing within five business days after request acceptance",
    platform: "Proprietary/self-developed web platform reported by third-party broker databases",
    regulation:
      "FCA warning says PocketOption is not authorised in the UK; CFTC RED List record says Pocketoption is not registered with the CFTC while offering binary options to US customers",
    companyEntity: "PocketOption / entity details vary by source and should be checked against current terms before publishing legal claims",
    tradeableSymbols:
      "Official and third-party materials reference currencies, commodities, stocks, cryptocurrencies, and indices; live availability varies by region/session",
    accountCurrencies: "Needs verification in account dashboard",
    paymentMethods: [
      "Official payment-methods articles reference cards, bank rails, e-wallets, cryptocurrencies, and local systems",
      "Withdrawals and availability are method, country, and verification dependent",
      "Minimum/maximum withdrawal amounts still need dashboard-level checks",
    ],
    pros: [
      "Official blog reports a low $5 minimum deposit, with payment method and country variation",
      "Official demo article reports a $50,000 virtual demo balance",
      "Official payment policy documents same-source withdrawal rules and five-business-day processing language",
      "Large public footprint makes third-party complaint and risk signals easier to monitor",
    ],
    cons: [
      "FCA warns PocketOption is not authorised and users lack UK ombudsman/FSCS protection",
      "CFTC RED List record says Pocketoption is not registered with the CFTC while offering binary options to US customers",
      "Third-party sources still report low broker scores and unresolved complaints",
      "Withdrawal and account-access complaints require strong caution before funding",
    ],
    ratings: [
      {
        label: "Regulation",
        score: 0.6,
        note: "No tier-one license verified; third-party sources report warnings and no valid forex license.",
      },
      {
        label: "Fees",
        score: 3.2,
        note: "Low deposit threshold is documented, but full fee and payout transparency needs account-screen checks.",
      },
      {
        label: "Platform",
        score: 2.8,
        note: "Proprietary platform is accessible, but independent execution transparency is limited.",
      },
      {
        label: "Markets",
        score: 2.7,
        note: "Broad asset classes are referenced, but current tradable availability requires dashboard verification.",
      },
      {
        label: "Payments",
        score: 1.8,
        note: "Payment policy is documented, while complaint sources flag withdrawal and account-access risk.",
      },
      {
        label: "Support",
        score: 1.6,
        note: "Support confidence is reduced by third-party complaint patterns around withdrawals and blocked accounts.",
      },
    ],
    safetyChecks: [
      {
        label: "Official account basics",
        status: "pass",
        detail: "Official Pocket Option blog pages document minimum deposit and demo-account basics.",
      },
      {
        label: "Tier-one regulation",
        status: "fail",
        detail: "FCA warning and CFTC RED List records are now attached to the profile; no tier-one authorization is verified.",
      },
      {
        label: "Regulator warnings",
        status: "fail",
        detail: "FCA and CFTC source records are stronger than review-site claims and should be shown prominently on the page.",
      },
      {
        label: "Payment terms",
        status: "warning",
        detail: "Official payment policy describes withdrawal rules, but method limits and account outcomes vary by dashboard and user status.",
      },
      {
        label: "Complaint risk",
        status: "warning",
        detail: "WikiFX and broker-risk databases report unresolved complaints around withdrawals and account access.",
      },
      {
        label: "Country availability",
        status: "warning",
        detail: "Restricted-market and warning-list records need country-by-country checks before publishing geo pages.",
      },
    ],
    timeline: [
      {
        year: "2017",
        title: "Launch year claimed",
        detail: "Official Pocket Option blog material describes the platform as operating since 2017.",
      },
      {
        year: "2021",
        title: "FCA warning published",
        detail: "The FCA warning page says PocketOption is not authorised and may be targeting people in the UK.",
      },
      {
        year: "2022",
        title: "CFTC RED List record",
        detail: "The CFTC RED List names Pocketoption in relation to binary options offered to US customers without CFTC registration.",
      },
      {
        year: "2025",
        title: "Official basics pages updated",
        detail: "Official blog pages were updated with minimum-deposit and demo-account information.",
      },
      {
        year: "2026",
        title: "Third-party warning signals",
        detail: "Recent broker databases and risk articles report low scores, no valid forex license, and complaint exposure.",
      },
    ],
    faqs: [
      {
        question: "Is Pocket Option fully regulated?",
        answer:
          "No tier-one authorization is verified in this review. The FCA warns PocketOption is not authorised in the UK, and the CFTC RED List record says Pocketoption is not registered with the CFTC while offering binary options to US customers.",
      },
      {
        question: "What is the minimum deposit on Pocket Option?",
        answer:
          "An official Pocket Option blog page reports a minimum deposit from $5, while noting that payment method and country can change the exact threshold.",
      },
      {
        question: "Does Pocket Option offer a demo account?",
        answer:
          "Yes. An official Pocket Option demo-account article reports a $50,000 virtual balance for practice.",
      },
      {
        question: "How fast are withdrawals on Pocket Option?",
        answer:
          "The official payment policy states that withdrawals are processed within five business days after the withdrawal order is accepted, but method limits and verification status matter.",
      },
      {
        question: "Is this review investment advice?",
        answer:
          "No. This is a source-backed broker review and risk summary. It does not recommend opening an account or placing trades.",
      },
    ],
  }
}

function createIqOptionReview(): BrokerReview {
  return {
    overallScore: 3.2,
    trustScore: 64,
    externalScore: "CySEC register lists IQOption Europe Ltd under licence 247/14; non-EEA entity routing remains separate",
    scoreLabel: "Mixed / entity-dependent",
    ratingSummary:
      "IQ Option has a stronger source trail than most binary-options brands because official materials identify a 2013 launch and the CySEC register lists IQOption Europe Ltd under licence 247/14. The score stays mixed because protections depend on the entity and region, and non-EEA users need a separate entity check.",
    verdict:
      "IQ Option is the most entity-sensitive profile in this group: EEA users may see a regulated CySEC entity, while non-EEA users need to verify the exact contracting company and product permissions before funding.",
    minimumTrade: "$1 commonly reported by broker databases; verify in the live account",
    payoutRange: "Product-dependent; not treated as a fixed public guarantee",
    withdrawalTime: "Needs method-level verification in the account and current terms",
    platform: "Proprietary web, desktop, iOS, and Android platform routes documented by official download page",
    regulation: "CySEC register lists IQOption Europe Ltd with licence number 247/14; non-EEA entity protection differs",
    companyEntity: "IQOption Europe Ltd for EEA source record; non-EEA routing must be checked separately",
    tradeableSymbols: "300+ instruments reported by WikiFX; exact product set varies by region",
    accountCurrencies: "Needs account-screen verification by country",
    paymentMethods: ["Cards, e-wallets and local rails may be available", "Available methods vary by country", "Withdrawal terms need account-level confirmation"],
    pros: [
      "Official materials reference a 2013 operating history",
      "CySEC register lists IQOption Europe Ltd with licence number 247/14",
      "Official IQ Option pages document demo and platform/app download routes",
      "$10 minimum deposit appears across official/review sources",
      "Affiliate program and broker materials have a larger public source trail than most peers",
    ],
    cons: [
      "Entity routing changes the protection level for non-EEA users",
      "Third-party databases flag complaint volume and withdrawal/support issues",
      "Product availability and leverage/options rules vary by jurisdiction",
      "Public fee and withdrawal details are not as clean as the regulation headline",
    ],
    ratings: [
      { label: "Regulation", score: 3.4, note: "Strong for EEA entity, weaker and entity-dependent outside the EEA." },
      { label: "Fees", score: 3.2, note: "$10 deposit is clear; wider fee and withdrawal-cost evidence needs current account checks." },
      { label: "Platform", score: 4.0, note: "Mature proprietary web/mobile stack with broad recognition." },
      { label: "Markets", score: 3.7, note: "Large instrument set is reported, but product access depends on region and entity." },
      { label: "Payments", score: 3.0, note: "Payment availability is broad but method-level withdrawal timing needs verification." },
      { label: "Support", score: 2.7, note: "Public footprint is large, while complaint databases reduce support confidence." },
    ],
    safetyChecks: [
      {
        label: "EEA license",
        status: "pass",
        detail: "CySEC's register lists IQOption Europe Ltd with licence number 247/14 and a 30 July 2014 licence date.",
      },
      {
        label: "Apps and demo",
        status: "pass",
        detail: "Official IQ Option pages provide demo-trading and download routes for web, desktop, iOS, and Android access.",
      },
      {
        label: "Entity routing",
        status: "warning",
        detail: "Non-EEA users may contract with a different group entity, so investor protection cannot be generalized.",
      },
      {
        label: "Complaint profile",
        status: "warning",
        detail: "WikiFX reports a high complaint count, especially around withdrawals and support.",
      },
      {
        label: "Restricted countries",
        status: "warning",
        detail: "USA, Canada and other restricted markets require explicit country checks before publishing geo pages.",
      },
    ],
    timeline: [
      { year: "2013", title: "Launch year", detail: "Official IQ Option materials describe the brand as operating since 2013." },
      { year: "2014", title: "CySEC licence date", detail: "CySEC register lists IQOption Europe Ltd with licence number 247/14 and licence date 30 July 2014." },
      { year: "2025-2026", title: "Source refresh", detail: "Recent official/blog and WikiFX records keep entity-dependent regulation and complaints as active review areas." },
    ],
    faqs: [
      {
        question: "Is IQ Option regulated?",
        answer:
          "The CySEC register lists IQOption Europe Ltd with licence number 247/14. Users outside the EEA should verify the exact contracting entity because protections and product permissions can differ.",
      },
      {
        question: "Does IQ Option have mobile apps?",
        answer:
          "IQ Option's official download page lists iOS and Android app routes, plus desktop and web access. App availability can still depend on country and app-store rules.",
      },
      {
        question: "What is the minimum deposit on IQ Option?",
        answer:
          "The current profile uses $10 as the verified baseline from official and third-party source trails, but account screens should be checked before funding.",
      },
      {
        question: "Why is the score not higher if CySEC is listed?",
        answer:
          "Because the regulation is entity-specific, while non-EEA routing, product restrictions, complaint volume, and withdrawal details still require caution.",
      },
    ],
  }
}

function createOlympTradeReview(): BrokerReview {
  return {
    overallScore: 2.5,
    trustScore: 36,
    externalScore: "WikiFX/BrokersView report offshore-license and warning-list concerns",
    scoreLabel: "High-risk / offshore-regulation concerns",
    ratingSummary:
      "Olymp Trade has official support pages for deposits, withdrawals, demo access and support channels. The main weakness is regulatory confidence: public broker databases and warning reports treat the platform as high risk despite the clear account-basics trail.",
    verdict:
      "Olymp Trade is a high-risk fixed-time trading profile. Product basics are easier to source than regulation quality, so the page should separate confirmed account terms from unresolved licensing and warning-list concerns.",
    minimumTrade: "$1 / €1 reported by Olymp Trade wiki/support-style materials; verify in account",
    payoutRange: "Needs account/product verification; do not treat marketing profitability as stable",
    withdrawalTime: "Minimum withdrawal $10/€10 in support FAQ; processing timing needs current method check",
    platform: "Proprietary web/mobile trading platform",
    regulation: "Offshore/self-regulatory claims need caution; no verified tier-one regulator in gathered sources",
    companyEntity: "Aollikus Limited / regional entities reported by broker databases; verify contract entity",
    tradeableSymbols: "Fixed-time trades, forex-style instruments and platform extensions vary by region",
    accountCurrencies: "USD/EUR basics appear in support FAQ; local currency handling needs account check",
    paymentMethods: ["Payment methods shown in platform terminal", "Minimum deposit and withdrawal $10/€10", "Bonus and withdrawal rules require terms review"],
    pros: [
      "Official support page confirms $10/€10 minimum deposit",
      "Official support page confirms $10/€10 minimum withdrawal",
      "24/7 support messaging and email contact are described publicly",
      "Demo/live account flow is explained in official FAQ material",
    ],
    cons: [
      "No verified tier-one regulator found in this pass",
      "Third-party broker databases report warning-list and complaint risk",
      "Bonus and withdrawal mechanics can create user-confusion risk",
      "Country availability and entity routing need manual checks",
    ],
    ratings: [
      { label: "Regulation", score: 1.4, note: "Offshore and warning-list concerns dominate the safety review." },
      { label: "Fees", score: 3.1, note: "Low minimum deposit/withdrawal is visible, but full product cost evidence is limited." },
      { label: "Platform", score: 3.4, note: "Established proprietary platform with clear support materials." },
      { label: "Markets", score: 2.8, note: "Market coverage is visible but region/product availability needs verification." },
      { label: "Payments", score: 2.5, note: "Minimums are sourced; payout timing and country methods need account-level checks." },
      { label: "Support", score: 2.8, note: "Support channels are documented, but complaint records reduce confidence." },
    ],
    safetyChecks: [
      { label: "Official basics", status: "pass", detail: "Support/FAQ pages confirm deposit, withdrawal and support basics." },
      { label: "Tier-one regulation", status: "fail", detail: "No FCA/CySEC/ASIC-style authorization was verified for current user-facing operations." },
      { label: "Warning records", status: "warning", detail: "BrokersView and WikiFX report warning-list or offshore-license concerns." },
      { label: "Bonus terms", status: "warning", detail: "Bonus and turnover mechanics should be reviewed before funding or affiliate promotion." },
    ],
    timeline: [
      { year: "2014", title: "Brand launch claim", detail: "Olymptrade materials list the brand as active since 2014." },
      { year: "2024", title: "Warning-list reports", detail: "Broker databases report CySEC warning references around Olymp Trade services." },
      { year: "2026", title: "Review update", detail: "Official support and broker-database sources were added to keep the page source-dated." },
    ],
    faqs: [
      {
        question: "What is the minimum deposit on Olymp Trade?",
        answer: "Olymptrade support pages state a minimum deposit of $10 or €10.",
      },
      {
        question: "Is Olymp Trade tier-one regulated?",
        answer:
          "We did not verify tier-one supervision. Third-party databases report offshore-license and warning-list concerns, so this profile is labeled high risk.",
      },
      {
        question: "Does Olymp Trade offer support?",
        answer:
          "Its support page describes 24/7 chat, email support, and phone hotline availability, but support quality should still be weighed against complaint records.",
      },
    ],
  }
}

function createBinomoReview(): BrokerReview {
  return {
    overallScore: 2.2,
    trustScore: 31,
    externalScore: "WikiFX/BrokersView report low scores, warning records and withdrawal/account complaints",
    scoreLabel: "High-risk / warning-list profile",
    ratingSummary:
      "Binomo has official materials for a $10 deposit baseline, demo account and safety features such as 2FA. The score remains low because broker databases report no valid mainstream regulation, warning records and withdrawal/account-blocking complaints.",
    verdict:
      "Binomo should be reviewed as a high-risk fixed-time trading venue. The useful facts are account basics and demo access; regulation and complaint risk are the main user decision points.",
    minimumTrade: "Needs current account-screen verification",
    payoutRange: "Official marketing mentions high profitability; this review does not treat it as a stable expected payout",
    withdrawalTime: "Needs method-level verification; third-party records flag withdrawal complaints",
    platform: "Proprietary web/mobile platform",
    regulation: "Financial Commission membership appears in official copy, but no verified state-tier broker license was confirmed",
    companyEntity: "Dolphin Corp LLC / related entities reported in public sources; verify contract entity",
    tradeableSymbols: "70+ assets are stated in official marketing; exact live asset list needs account verification",
    accountCurrencies: "Needs account-screen verification",
    paymentMethods: ["Cards and local methods need account verification", "Crypto/payment rails may vary by region", "Withdrawal rules need terms review"],
    pros: [
      "Official/brand sources reference a $10 minimum deposit",
      "Binomo help center explains a $10,000 demo account",
      "Official site mentions 2FA and payment-card data protection controls",
      "Affiliate program existence is confirmed in Binomo help center",
    ],
    cons: [
      "No verified tier-one broker license found in this pass",
      "CNMV/CySEC/CVM-style warning reports appear in broker databases",
      "Third-party databases report blocked-account and withdrawal complaints",
      "Financial Commission membership is not the same as state financial supervision",
    ],
    ratings: [
      { label: "Regulation", score: 1.0, note: "Warning records and lack of mainstream authorization heavily reduce the score." },
      { label: "Fees", score: 3.0, note: "$10 deposit baseline is visible, but wider fees and payout mechanics need verification." },
      { label: "Platform", score: 3.0, note: "Demo-first proprietary platform is documented, but execution transparency is limited." },
      { label: "Markets", score: 2.5, note: "70+ asset marketing needs live account validation." },
      { label: "Payments", score: 1.8, note: "Withdrawal complaint patterns materially reduce confidence." },
      { label: "Support", score: 2.2, note: "Support is advertised, but complaint databases lower trust." },
    ],
    safetyChecks: [
      { label: "Demo account", status: "pass", detail: "Binomo help center describes a $10,000 demo account after signup." },
      { label: "State regulation", status: "fail", detail: "No verified top-tier state financial regulator was confirmed for this pass." },
      { label: "Warning records", status: "warning", detail: "Broker databases cite CNMV, CySEC and CVM warning references." },
      { label: "Withdrawal risk", status: "warning", detail: "WikiFX/BrokersView report withdrawal and blocked-account complaint patterns." },
    ],
    timeline: [
      { year: "2014", title: "Launch year commonly reported", detail: "Public Binomo materials and broker databases commonly describe a long-running fixed-time trading brand." },
      { year: "2019-2025", title: "Regulator warnings reported", detail: "Third-party databases cite warnings from several financial authorities." },
      { year: "2026", title: "Source update", detail: "Official help-center and broker-database records were added for structured review coverage." },
    ],
    faqs: [
      {
        question: "What is the Binomo minimum deposit?",
        answer: "Official/brand materials reference a $10 minimum deposit. Users should still verify the live account screen and local payment method.",
      },
      {
        question: "Does Binomo have a demo account?",
        answer: "Yes. Binomo help-center material describes a $10,000 demo account after signup.",
      },
      {
        question: "Is Financial Commission membership the same as broker regulation?",
        answer:
          "No. It may provide dispute-resolution framing, but it is not equivalent to authorization by a state financial regulator such as FCA, CySEC or ASIC.",
      },
    ],
  }
}

function createDerivReview(): BrokerReview {
  return {
    overallScore: 3.7,
    trustScore: 72,
    externalScore: "Official Deriv pages document multiple entities, payment methods, app routes, and partner commission plans",
    scoreLabel: "Better documented / still high-risk products",
    ratingSummary:
      "Deriv has the strongest documentation trail in this binary-options group: official pages explain regulatory entities, digital options, payment methods, app routes, and partner commission plans. The score is limited by derivative-product risk and entity/country restrictions.",
    verdict:
      "Deriv is a comparatively better-documented options/derivatives platform, but it is still not a low-risk product. Users need to verify entity routing, country availability, contract type and payment method before funding.",
    minimumTrade: "Digital options can be opened with less than USD 1 according to Deriv product page",
    payoutRange: "Fixed payout for correct digital-options predictions; varies by contract and market",
    withdrawalTime: "Deriv payment page shows method-dependent timing; many methods are instant or up to one working day, with PSP/bank timing added",
    platform: "Deriv Trader, Deriv Bot, Deriv GO, SmartTrader, MT5/cTrader availability by product and country",
    regulation: "Official regulatory page lists multiple entities including Malta, BVI, Vanuatu, Labuan, Mauritius, Cayman and UAE records; user entity still matters",
    companyEntity: "Deriv group entities by region",
    tradeableSymbols: "Digital options, CFDs, derived indices, forex, stocks, stock indices, commodities, crypto and ETFs where available",
    accountCurrencies: "USD/EUR/GBP/AUD minimums appear in payment docs; account currencies vary by region",
    paymentMethods: ["Cards", "E-wallets", "Crypto wallets", "Mobile payments", "Online banking", "Vouchers and regional methods where available"],
    pros: [
      "Official digital-options page explains capped-risk mechanics",
      "Deposits/withdrawals help center lists payment methods and processing expectations",
      "Lowest e-wallet deposit/withdrawal range is documented as 5-10 USD/EUR/GBP/AUD",
      "Official regulatory page links multiple entity and licence records",
      "Official partner-academy page explains revenue share, turnover commission, and CPA plans",
    ],
    cons: [
      "Options, multipliers and CFDs remain high-risk derivative products",
      "Country availability and contract types vary",
      "Entity routing must be verified for legal protection and complaints",
      "Bonus turnover and withdrawal-verification rules require careful reading",
    ],
    ratings: [
      { label: "Regulation", score: 3.6, note: "Better entity transparency than peers, but protections vary by jurisdiction." },
      { label: "Fees", score: 3.7, note: "Low entry and method-level payment documentation are visible." },
      { label: "Platform", score: 4.2, note: "Multiple proprietary and trading-platform options are documented." },
      { label: "Markets", score: 4.1, note: "Broad product coverage including digital options, CFDs and derived indices." },
      { label: "Payments", score: 4.0, note: "Payment methods, limits and 24-hour internal processing language are documented." },
      { label: "Support", score: 3.5, note: "Help center coverage is strong; user support quality still needs ongoing monitoring." },
    ],
    safetyChecks: [
      { label: "Official docs", status: "pass", detail: "Product, regulatory, payment-methods, app, and partner-program pages were found and source-dated." },
      { label: "Payment clarity", status: "pass", detail: "Deriv explains payment methods and method-dependent processing timing on an official payment page." },
      { label: "Entity records", status: "pass", detail: "Deriv's regulatory page links entity records for BVI, Vanuatu, Labuan, Mauritius, Malta, Cayman, UAE and SVG routing." },
      { label: "Entity routing", status: "warning", detail: "Users still need to verify the exact legal entity and country restrictions." },
      { label: "Derivative risk", status: "warning", detail: "Digital options and CFDs can cause full loss of stake or margin losses." },
    ],
    timeline: [
      { year: "1999", title: "Long operating history", detail: "Deriv group roots are commonly traced to the Binary.com era." },
      { year: "2020s", title: "Multi-platform expansion", detail: "Deriv documents Deriv Trader, Deriv Bot, Deriv GO, SmartTrader and API-linked partner flows." },
      { year: "2026", title: "Review refresh", detail: "Official regulatory, payment-methods, app, product and partner pages were added to the current profile." },
    ],
    faqs: [
      {
        question: "Does Deriv offer digital options?",
        answer:
          "Yes. Deriv's digital-options page explains fixed-payout contracts where risk is limited to the initial stake.",
      },
      {
        question: "What is the minimum deposit on Deriv?",
        answer:
          "Deriv's payment pages show method-dependent minimums and timing. The exact deposit route can vary by country, currency, and payment provider.",
      },
      {
        question: "Is Deriv regulated?",
        answer:
          "Deriv publishes a regulatory page with multiple group entities and jurisdictions. This is stronger documentation than most peers, but users still need to verify which entity their account uses.",
      },
      {
        question: "Is Deriv low risk?",
        answer:
          "No. The documentation is stronger than many peers, but options, multipliers and CFDs are still high-risk products and country/entity rules matter.",
      },
    ],
  }
}

function createExpertOptionReview(): BrokerReview {
  return {
    overallScore: 1.8,
    trustScore: 22,
    externalScore: "Official FAQ confirms funding basics; wider regulatory source trail remains thin",
    scoreLabel: "Very high-risk / thin source trail",
    ratingSummary:
      "ExpertOption has official FAQ material confirming $10 minimum deposits/withdrawals and post-deposit verification requirements. The review remains very high risk because reliable regulation, affiliate economics, country coverage and complaint-source evidence are limited.",
    verdict:
      "ExpertOption is a thin-source, very high-risk binary-options profile. The account funding basics are source-backed, but regulatory protection and withdrawal reliability need much stronger evidence.",
    minimumTrade: "Needs account-screen verification",
    payoutRange: "Needs account/product verification",
    withdrawalTime: "Minimum withdrawal is $10 or equivalent; processing timing needs current terms",
    platform: "Proprietary binary-options trading platform",
    regulation: "No verified tier-one regulation found in this pass",
    companyEntity: "ExpertOption; legal entity needs current terms verification",
    tradeableSymbols: "Binary options / digital trading assets; exact list needs account verification",
    accountCurrencies: "Local-currency equivalents mentioned in FAQ; exact account currencies need verification",
    paymentMethods: ["Cards may require statement verification", "Payment methods vary by region", "Withdrawal rails need account verification"],
    pros: [
      "Official FAQ confirms $10 minimum deposit and withdrawal",
      "Official FAQ explains identity-document verification requirements",
      "Card deposits may trigger card-statement verification, which is at least disclosed",
    ],
    cons: [
      "No confirmed tier-one broker license in the gathered sources",
      "Verification is described as post-deposit, which can surprise users",
      "Affiliate program evidence remains weak",
      "Payment timing, asset list and country restrictions need more source work",
    ],
    ratings: [
      { label: "Regulation", score: 0.7, note: "No verified mainstream license found." },
      { label: "Fees", score: 2.7, note: "$10 funding baseline is clear, but full costs and payout mechanics are not." },
      { label: "Platform", score: 2.5, note: "Proprietary platform with limited independent transparency." },
      { label: "Markets", score: 2.0, note: "Asset scope is not well sourced in this pass." },
      { label: "Payments", score: 1.8, note: "Minimums are documented; timing and withdrawal reliability need better evidence." },
      { label: "Support", score: 1.8, note: "Support and dispute-resolution confidence remain low." },
    ],
    safetyChecks: [
      { label: "Funding basics", status: "pass", detail: "Official FAQ confirms $10 minimum deposit and withdrawal." },
      { label: "Verification flow", status: "warning", detail: "FAQ says verification happens after deposit and may require ID/card documents." },
      { label: "Tier-one regulation", status: "fail", detail: "No credible FCA/CySEC/ASIC-style license was verified in this pass." },
      { label: "Affiliate evidence", status: "warning", detail: "No reliable official public partner terms were confirmed." },
    ],
    timeline: [
      { year: "2014", title: "Launch year commonly reported", detail: "Public broker summaries commonly place ExpertOption around 2014." },
      { year: "2026", title: "FAQ source refresh", detail: "Official FAQ pages were used for minimum deposit, withdrawal and verification facts." },
      { year: "Next", title: "Regulatory pass needed", detail: "Entity, warning-list and country-availability checks remain priority items." },
    ],
    faqs: [
      {
        question: "What is the ExpertOption minimum deposit?",
        answer: "The official FAQ states minimum deposit and withdrawal are $10 or the equivalent in local currency.",
      },
      {
        question: "When does ExpertOption verify accounts?",
        answer:
          "The FAQ says users need to make a deposit first and then provide identity documents; card deposits may require a card statement.",
      },
      {
        question: "Is ExpertOption fully regulated?",
        answer:
          "We did not verify a tier-one license in this pass, so regulation is treated as a major unresolved risk.",
      },
    ],
  }
}

function createBinariumReview(): BrokerReview {
  return {
    overallScore: 1.3,
    trustScore: 10,
    externalScore: "FCA warning now provides regulator-backed evidence that Binarium is not authorised in the UK",
    scoreLabel: "Very high-risk / research-only",
    ratingSummary:
      "Binarium is included because users asked for coverage, not because the source trail is strong. The strongest current source is the FCA warning page, which says Binarium is not authorised or registered in the UK. Official commercial and payment claims still need stronger confirmation.",
    verdict:
      "Binarium should remain a research-only profile. The FCA warning is strong enough to publish as a risk signal, while product, deposit, withdrawal, app, and affiliate claims should stay conservative until reliable official sources are confirmed.",
    minimumTrade: "Needs verification",
    payoutRange: "Needs verification",
    withdrawalTime: "Needs verification; third-party records report withdrawal concerns",
    platform: "Binarium app/platform reported by third-party databases",
    regulation: "FCA warning says Binarium is not authorised or registered in the UK; no valid mainstream authorization is verified",
    companyEntity: "Binarium Limited / SVG registration reported by third-party databases; not treated as regulatory authorization",
    tradeableSymbols: "Currencies, futures/options and related assets reported by databases; official confirmation weak",
    accountCurrencies: "Needs verification",
    paymentMethods: ["Visa/Mastercard and crypto are reported by databases", "Official/current payment rails need direct verification", "Withdrawal limits need account/terms checks"],
    pros: [
      "Public source trail is sufficient to explain why the broker is high risk",
      "FCA warning provides a strong official risk signal for UK users",
      "Third-party databases provide entity and minimum-deposit leads for further verification",
    ],
    cons: [
      "Official facts are thin and commercial claims are weakly supported",
      "No verified tier-one or recognized broker license found",
      "FCA warning says users would not have UK ombudsman or FSCS protection",
      "Affiliate program sources look mirror-like and should not be trusted without confirmation",
    ],
    ratings: [
      { label: "Regulation", score: 0.3, note: "Warning records and no valid mainstream license dominate the review." },
      { label: "Fees", score: 1.2, note: "Minimum deposit is database-reported, not strongly official." },
      { label: "Platform", score: 1.5, note: "Platform claims exist, but official product evidence is weak." },
      { label: "Markets", score: 1.2, note: "Asset coverage is not source-clean enough for strong claims." },
      { label: "Payments", score: 0.9, note: "Withdrawal concerns and weak official terms keep this very low." },
      { label: "Support", score: 0.8, note: "Support confidence is poor due to warning and complaint signals." },
    ],
    safetyChecks: [
      { label: "Official basics", status: "warning", detail: "Official website exists, but reliable product-term extraction remains weak." },
      { label: "Regulation", status: "fail", detail: "FCA warning says Binarium is not authorised or registered in the UK." },
      { label: "Affiliate claims", status: "fail", detail: "Affiliate pages found in search look low-confidence and should not be treated as official." },
      { label: "Withdrawal risk", status: "warning", detail: "Third-party sources report blocked-withdrawal/account-risk patterns." },
    ],
    timeline: [
      { year: "2012", title: "Launch year reported by databases", detail: "WikiFX-style sources report Binarium as operating since around 2012, but official confirmation needs improvement." },
      { year: "2025", title: "FCA warning published", detail: "FCA warning page says Binarium is not authorised or registered in the UK and lacks UK ombudsman/FSCS protection." },
      { year: "2026", title: "Additional warning signals", detail: "WikiFX/BrokersView-style records remain partial evidence for further checking, not official product proof." },
    ],
    faqs: [
      {
        question: "Why is Binarium still included?",
        answer:
          "Because users search for it and asked for coverage. The page is intentionally conservative so risky or weak claims are visible instead of hidden.",
      },
      {
        question: "Is Binarium authorised in the UK?",
        answer:
          "The FCA warning page says Binarium is not authorised or registered in the UK and that users would not have access to the Financial Ombudsman Service or FSCS protection.",
      },
      {
        question: "What is the Binarium minimum deposit?",
        answer:
          "Some third-party databases report $5, but this review marks the claim as weak until a reliable official source confirms the current amount.",
      },
      {
        question: "Should affiliate claims for Binarium be used?",
        answer:
          "Not yet. The affiliate sources found in this pass are not reliable enough to publish commercial rates as verified.",
      },
    ],
  }
}
