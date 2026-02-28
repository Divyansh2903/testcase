"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div
      key={pathname}
      className={cn(
        "animate-in fade-in duration-300 ease-out",
        "min-h-full"
      )}
    >
      {children}
    </div>
  )
}
