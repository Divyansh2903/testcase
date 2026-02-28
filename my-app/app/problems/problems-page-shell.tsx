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

        <main className="container max-w-7xl mx-auto py-8">
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
        </main>
      </div>
    </AuthGuard>
  )
}
