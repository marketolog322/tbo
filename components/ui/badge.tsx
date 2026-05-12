import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        destructive: "border-transparent bg-destructive text-white",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground",
        warning: "border-amber-300/50 bg-amber-100 text-amber-950 dark:bg-amber-400/15 dark:text-amber-200",
        success: "border-emerald-300/50 bg-emerald-100 text-emerald-950 dark:bg-emerald-400/15 dark:text-emerald-200",
        muted: "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
