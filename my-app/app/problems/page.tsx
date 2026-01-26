"use client"

import { useState, useMemo } from "react"

import { problems, allTags } from "@/lib/data"
import type { Difficulty, ProblemStatus } from "@/lib/types"
import { Navbar } from "../../components/navbar"
import { StatsCards } from "../../components/stats-cards"
import { ProblemsTable } from "../../components/problems-table"
import { ProblemFilters } from "../../components/problem-filters"

export default function ProblemsPage() {
  const [search, setSearch] = useState("")
  const [difficulties, setDifficulties] = useState<Difficulty[]>([])
  const [statuses, setStatuses] = useState<ProblemStatus[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          problem.title.toLowerCase().includes(searchLower) ||
          problem.id.includes(search) ||
          problem.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }

      // Difficulty filter
      if (difficulties.length > 0 && !difficulties.includes(problem.difficulty)) {
        return false
      }

      // Status filter
      if (statuses.length > 0) {
        const problemStatus = problem.status || "unsolved"
        if (!statuses.includes(problemStatus)) return false
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some((tag) => problem.tags.includes(tag))
        if (!hasMatchingTag) return false
      }

      return true
    })
  }, [search, difficulties, statuses, selectedTags])

  const solvedCount = problems.filter((p) => p.status === "solved").length

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

        <div className="space-y-6">
          <StatsCards
            totalSolved={solvedCount}
            totalProblems={problems.length}
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
      </main>
    </div>
  )
}
