import { headers } from "next/headers"
import { problems as localProblems, allTags as localAllTags } from "@/lib/data"
import { isDBloaded } from "@/lib/config"
import { getProblemsListServer } from "@/lib/problems-server"
import { Navbar } from "@/components/navbar"
import { ProblemsPageClient } from "./problems-client"

export default async function ProblemsPage() {
  let initialProblems = localProblems
  let allTags = localAllTags
  let initialError: string | null = null

  if (isDBloaded) {
    try {
      const headersList = await headers()
      const cookieHeader = headersList.get("cookie")
      initialProblems = await getProblemsListServer(cookieHeader)
      allTags = Array.from(new Set(initialProblems.flatMap((p) => p.tags))).sort()
    } catch (err) {
      initialError = err instanceof Error ? err.message : "Failed to load problems"
      initialProblems = []
      allTags = []
    }
  }

  return (
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
  )
}
