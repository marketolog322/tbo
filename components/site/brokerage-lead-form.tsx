"use client"

import { type FormEvent, useState } from "react"
import { CheckCircle2Icon, Loader2Icon, SendIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type LeadFormProps = {
  brokerName: string
  brokerSlug: string
}

type SubmitState = "idle" | "loading" | "success" | "error"

const fieldClassName =
  "border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-24 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"

const labelClassName = "text-xs font-medium uppercase tracking-wide text-muted-foreground"

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

function getUtmPayload() {
  const params = new URLSearchParams(window.location.search)
  const payload: Record<string, string> = {}

  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const value = params.get(key)
    if (value) {
      payload[key] = value
    }
  }

  return payload
}

export function BrokerageLeadForm({ brokerName, brokerSlug }: LeadFormProps) {
  const [status, setStatus] = useState<SubmitState>("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")
    setMessage("")

    const form = event.currentTarget
    const formData = new FormData(form)
    const utmPayload = getUtmPayload()
    const payload = {
      first_name: readFormValue(formData, "first_name"),
      email: readFormValue(formData, "email"),
      phone: readFormValue(formData, "phone"),
      tg: readFormValue(formData, "tg"),
      company_name: readFormValue(formData, "company_name"),
      comment: readFormValue(formData, "comment"),
      terms_agree: formData.get("terms_agree") === "on",
      broker_name: brokerName,
      broker_slug: brokerSlug,
      page_path: window.location.pathname,
      source_url: window.location.href,
      ...utmPayload,
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = (await response.json().catch(() => null)) as { message?: string; success?: boolean } | null

      if (!response.ok || result?.success === false) {
        throw new Error(result?.message ?? "Could not send the request.")
      }

      const dataLayer = (window as Window & { dataLayer?: Record<string, unknown>[] }).dataLayer

      dataLayer?.push({
        event: "lead_submit",
        form_id: "clone_script_page",
        broker_slug: brokerSlug,
        utm_source: utmPayload.utm_source,
        utm_campaign: utmPayload.utm_campaign,
      })

      form.reset()
      setStatus("success")
      setMessage("Thanks. Your request has been sent. We will contact you shortly.")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Could not send the request.")
    }
  }

  return (
    <Card id="lead-form" className="scroll-mt-24 border-primary/20 shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SendIcon className="size-4 text-primary" aria-hidden="true" />
          Request launch quote
        </CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Share your contact details and project context. The request goes straight to our CRM for follow-up.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name" htmlFor="lead-first-name" required>
              <Input id="lead-first-name" name="first_name" autoComplete="name" placeholder="Your name" required />
            </Field>
            <Field label="Email" htmlFor="lead-email" required>
              <Input id="lead-email" name="email" type="email" autoComplete="email" placeholder="name@company.com" required />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Phone" htmlFor="lead-phone" required>
              <Input id="lead-phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 555 000 0000" required />
            </Field>
            <Field label="Telegram / messenger" htmlFor="lead-messenger">
              <Input id="lead-messenger" name="tg" placeholder="@username" />
            </Field>
          </div>

          <Field label="Company or current business" htmlFor="lead-company">
            <Input id="lead-company" name="company_name" placeholder="Brokerage, affiliate team, fintech project..." />
          </Field>

          <Field label="Project notes" htmlFor="lead-notes">
            <textarea
              id="lead-notes"
              name="comment"
              className={fieldClassName}
              placeholder="Target regions, PSPs, apps, CRM needs, launch timeline..."
            />
          </Field>

          <label className="flex items-start gap-2 text-sm leading-6">
            <input
              name="terms_agree"
              type="checkbox"
              required
              className="border-input mt-1 size-4 rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            />
            <span className="text-muted-foreground">
              I agree to be contacted about brokerage platform setup and understand this is not legal, investment, or
              licensing advice.
            </span>
          </label>

          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? <Loader2Icon className="animate-spin" aria-hidden="true" /> : <SendIcon aria-hidden="true" />}
            Send request
          </Button>

          {message ? (
            <div
              className={cn(
                "flex items-start gap-2 rounded-md border px-3 py-2 text-sm leading-6",
                status === "success"
                  ? "border-primary/20 bg-primary/5 text-foreground"
                  : "border-destructive/30 bg-destructive/5 text-destructive"
              )}
              role="status"
              aria-live="polite"
            >
              {status === "success" ? <CheckCircle2Icon className="mt-1 size-4 shrink-0" aria-hidden="true" /> : null}
              <span>{message}</span>
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className={labelClassName} htmlFor={htmlFor}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </label>
      {children}
    </div>
  )
}
