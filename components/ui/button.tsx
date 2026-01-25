import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/helpers"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        primary:
          "rounded-full border border-white/20 bg-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-white transition enabled:hover:bg-white/20",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm transition hover:border-white/20 justify-start",
        secondary:
          "rounded-full border border-white/20 bg-white/5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition enabled:hover:bg-white/10",
        ghost:
          "text-xs uppercase tracking-[0.2em] text-white/50 transition enabled:hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        menu:
          "text-left text-base text-white/80 transition enabled:hover:text-teal-300 justify-start",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
        none: "",
        menu: "py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
