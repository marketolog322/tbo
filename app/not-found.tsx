import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center px-4 py-12 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Page not found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This broker or affiliate program is not in the MVP dataset yet.
          </p>
          <Button asChild>
            <Link href="/brokers">Back to broker directory</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
