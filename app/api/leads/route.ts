import { NextResponse } from "next/server"

const DEFAULT_FORMS_API_URL = "https://quadcode.foach.site"
const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const

type LeadBody = Record<string, unknown>

function readString(body: LeadBody, key: string, maxLength = 1200) {
  const value = body[key]

  if (typeof value !== "string") {
    return ""
  }

  return value.trim().slice(0, maxLength)
}

function readBoolean(body: LeadBody, key: string) {
  return body[key] === true || body[key] === "true" || body[key] === "on"
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function compactPayload(payload: Record<string, string | boolean>) {
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== ""))
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LeadBody | null

  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Invalid lead payload." }, { status: 400 })
  }

  const firstName = readString(body, "first_name", 120)
  const email = readString(body, "email", 180)
  const phone = readString(body, "phone", 80)
  const termsAgree = readBoolean(body, "terms_agree")

  if (!firstName || !email || !phone || !termsAgree) {
    return NextResponse.json(
      { message: "Name, email, phone, and consent are required." },
      { status: 400 }
    )
  }

  if (!isEmail(email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 })
  }

  const companyName = readString(body, "company_name", 180)
  const telegram = readString(body, "tg", 120)
  const brokerName = readString(body, "broker_name", 120)
  const brokerSlug = readString(body, "broker_slug", 120)
  const sourceUrl = readString(body, "source_url", 500)
  const pagePath = readString(body, "page_path", 220)
  const shortBio = readString(body, "short_bio", 900)

  const contextLines = [
    shortBio,
    brokerName ? `Broker template: ${brokerName}` : "",
    brokerSlug ? `Broker slug: ${brokerSlug}` : "",
    pagePath ? `Page: ${pagePath}` : "",
  ].filter(Boolean)

  const payload = compactPayload({
    first_name: firstName,
    email,
    phone,
    tg: telegram,
    company_name: companyName,
    short_bio: contextLines.join("\n"),
    terms_agree: true,
    source_url: sourceUrl,
    form_id: "clone_script_page",
    ...Object.fromEntries(UTM_FIELDS.map((field) => [field, readString(body, field, 180)])),
  })

  const formsApiUrl = process.env.FORMS_API_URL ?? DEFAULT_FORMS_API_URL
  const endpoint = new URL("/api/notPopup", formsApiUrl)

  try {
    const crmResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    const responseText = await crmResponse.text()
    const responseJson = responseText ? JSON.parse(responseText) : { success: crmResponse.ok }

    if (crmResponse.ok || crmResponse.status === 422) {
      return NextResponse.json(responseJson, { status: crmResponse.status })
    }

    return NextResponse.json(
      { message: "CRM rejected the lead request.", details: responseJson },
      { status: 502 }
    )
  } catch {
    return NextResponse.json({ message: "Unable to submit the lead right now." }, { status: 502 })
  }
}
