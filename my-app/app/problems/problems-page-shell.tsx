"use client";

import { Navbar } from "@/components/navbar"
import { AuthGuard } from "@/components/auth-guard"
import { ProblemsPageClient } from "./problems-client"
import type { Problem } from "@/lib/types"

interface ProblemsPageShellProps {
  initialProblems: Problem[]
  allTags: string[]
  initialError: string | null
}

export function ProblemsPageShell({
  initialProblems,
  allTags,
  initialError,
}: ProblemsPageShellProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="relative container max-w-7xl mx-auto py-8">
          <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,var(--primary)/0.06),transparent] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,var(--primary)/0.08),transparent]" aria-hidden />
          <div className="relative z-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Problems</h1>
              <p className="text-muted-foreground">
                Master data structures and algorithms with our curated problem sets
              </p>
            </div>

            <ProblemsPageClient
            initialProblems={initialProblems}
            allTags={allTags}
            initialError={initialError}
            />
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
