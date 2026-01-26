"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Difficulty, ProblemStatus } from "@/lib/types"

interface ProblemFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  difficulties: Difficulty[]
  onDifficultyChange: (difficulties: Difficulty[]) => void
  statuses: ProblemStatus[]
  onStatusChange: (statuses: ProblemStatus[]) => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  allTags: string[]
}

export function ProblemFilters({
  search,
  onSearchChange,
  difficulties,
  onDifficultyChange,
  statuses,
  onStatusChange,
  selectedTags,
  onTagsChange,
  allTags,
}: ProblemFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const toggleDifficulty = (difficulty: Difficulty) => {
    if (difficulties.includes(difficulty)) {
      onDifficultyChange(difficulties.filter((d) => d !== difficulty))
    } else {
      onDifficultyChange([...difficulties, difficulty])
    }
  }

  const toggleStatus = (status: ProblemStatus) => {
    if (statuses.includes(status)) {
      onStatusChange(statuses.filter((s) => s !== status))
    } else {
      onStatusChange([...statuses, status])
    }
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    onSearchChange("")
    onDifficultyChange([])
    onStatusChange([])
    onTagsChange([])
  }

  const hasActiveFilters =
    search || difficulties.length > 0 || statuses.length > 0 || selectedTags.length > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-secondary/60 border-border focus-visible:bg-background transition-colors"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {difficulties.length + statuses.length + selectedTags.length + (search ? 1 : 0)}
            </Badge>
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} size="icon">
            <X className="h-4 w-4" />
            <span className="sr-only">Clear filters</span>
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="grid gap-6 p-4 sm:p-5 rounded-lg border border-border bg-card shadow-sm sm:grid-cols-3">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Difficulty</h4>
            <div className="space-y-2">
              {(["easy", "medium", "hard"] as Difficulty[]).map((difficulty) => (
                <div key={difficulty} className="flex items-center space-x-2">
                  <Checkbox
                    id={`difficulty-${difficulty}`}
                    checked={difficulties.includes(difficulty)}
                    onCheckedChange={() => toggleDifficulty(difficulty)}
                  />
                  <Label
                    htmlFor={`difficulty-${difficulty}`}
                    className="text-sm capitalize cursor-pointer"
                  >
                    {difficulty}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Status</h4>
            <div className="space-y-2">
              {(["solved", "attempted", "unsolved"] as ProblemStatus[]).map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={statuses.includes(status)}
                    onCheckedChange={() => toggleStatus(status)}
                  />
                  <Label
                    htmlFor={`status-${status}`}
                    className="text-sm capitalize cursor-pointer"
                  >
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Tags</h4>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
