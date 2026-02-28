import { headers } from "next/headers"
import { problems as localProblems, allTags as localAllTags } from "@/lib/data"
import { isDBloaded } from "@/lib/config"
import { getProblemsListServer } from "@/lib/problems-server"
import { ProblemsPageShell } from "./problems-page-shell"

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
    <ProblemsPageShell
      initialProblems={initialProblems}
      allTags={allTags}
      initialError={initialError}
    />
  )
}
