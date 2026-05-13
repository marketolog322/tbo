import type { Metadata } from "next"

import "./globals.css"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader, TrustStrip } from "@/components/site/site-header"
import { getSiteUrl } from "@/lib/site-url"

export const metadata: Metadata = {
  title: {
    default: "TBO Broker Directory | Source-backed broker reviews",
    template: "%s | TBO Broker Directory",
  },
  description:
    "A Shadcn-style broker directory for comparing broker reviews, categories, geo restrictions, verification dates, and source-backed evidence.",
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <TrustStrip />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
