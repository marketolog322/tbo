import { NextResponse } from "next/server"

const DEFAULT_FORMS_API_URL = "https://group.quadcode.com"
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

function appendIfPresent(payload: URLSearchParams, key: string, value: string) {
  if (value) {
    payload.set(key, value)
  }
}

function parseCrmResponse(responseText: string) {
  if (!responseText) {
    return null
  }

  try {
    return JSON.parse(responseText) as unknown
  } catch {
    return responseText
  }
}

function isCrmRejection(result: unknown) {
  return (
    typeof result === "object" &&
    result !== null &&
    "success" in result &&
    (result as { success?: unknown }).success === false
  )
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
  const comment = readString(body, "comment", 1200) || readString(body, "short_bio", 900)

  const contextLines = [
    comment,
    companyName ? `Company / business: ${companyName}` : "",
    brokerName ? `Broker reference: ${brokerName}` : "",
    brokerSlug ? `Broker slug: ${brokerSlug}` : "",
    pagePath ? `Page: ${pagePath}` : "",
    sourceUrl ? `Source URL: ${sourceUrl}` : "",
    ...UTM_FIELDS.map((field) => {
      const value = readString(body, field, 180)
      return value ? `${field}: ${value}` : ""
    }),
  ].filter(Boolean)

  const payload = new URLSearchParams()

  payload.set("first_name", firstName)
  payload.set("email", email)
  payload.set("phone", phone)
  payload.set("terms_agree", "on")
  appendIfPresent(payload, "tg", telegram)
  appendIfPresent(payload, "comment", contextLines.join("\n"))

  const formsApiUrl = process.env.FORMS_API_URL ?? DEFAULT_FORMS_API_URL
  const endpoint = new URL("/api/notPopup", formsApiUrl)

  try {
    const crmResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: payload.toString(),
      cache: "no-store",
    })

    const responseText = await crmResponse.text()
    const crmResult = parseCrmResponse(responseText)

    if (!crmResponse.ok || isCrmRejection(crmResult)) {
      return NextResponse.json(
        { message: "CRM rejected the lead request. Please check the form fields and try again." },
        { status: crmResponse.status === 422 ? 422 : 502 }
      )
    }

    return NextResponse.json({ success: true, message: "Request sent." })
  } catch {
    return NextResponse.json({ message: "Unable to submit the lead right now." }, { status: 502 })
  }
}
