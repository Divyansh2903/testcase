"use client"

import { useState, useMemo } from "react"
import type { Difficulty, ProblemStatus } from "@/lib/types"
import type { Problem } from "@/lib/types"
import { StatsCards } from "@/components/stats-cards"
import { ProblemsTable } from "@/components/problems-table"
import { ProblemFilters } from "@/components/problem-filters"

interface ProblemsPageClientProps {
  initialProblems: Problem[]
  allTags: string[]
  initialError?: string | null
}

export function ProblemsPageClient({
  initialProblems,
  allTags,
  initialError = null,
}: ProblemsPageClientProps) {
  const [search, setSearch] = useState("")
  const [difficulties, setDifficulties] = useState<Difficulty[]>([])
  const [statuses, setStatuses] = useState<ProblemStatus[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredProblems = useMemo(() => {
    return initialProblems.filter((problem) => {
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          problem.title.toLowerCase().includes(searchLower) ||
          problem.id.includes(search) ||
          problem.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }
      if (difficulties.length > 0 && !difficulties.includes(problem.difficulty)) {
        return false
      }
      if (statuses.length > 0) {
        const problemStatus = problem.status || "unsolved"
        if (!statuses.includes(problemStatus)) return false
      }
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some((tag) => problem.tags.includes(tag))
        if (!hasMatchingTag) return false
      }
      return true
    })
  }, [search, difficulties, statuses, selectedTags, initialProblems])

  const solvedCount = initialProblems.filter((p) => p.status === "solved").length

  return (
    <>
      {initialError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {initialError}
        </div>
      )}

      <div className="space-y-6">
        <StatsCards
          totalSolved={solvedCount}
          totalProblems={initialProblems.length}
          streak={7}
          rank={15423}
        />

        <ProblemFilters
          search={search}
          onSearchChange={setSearch}
          difficulties={difficulties}
          onDifficultyChange={setDifficulties}
          statuses={statuses}
          onStatusChange={setStatuses}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          allTags={allTags}
        />

        <ProblemsTable problems={filteredProblems} />

        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No problems found matching your filters.</p>
          </div>
        )}
      </div>
    </>
  )
}
