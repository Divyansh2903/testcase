"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { DifficultyBadge } from "@/components/difficulty-badge"
import type { Problem } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { displayAcceptance } from "@/lib/acceptance"

interface ProblemsTableProps {
  problems: Problem[]
}

const rowTransition = "transition-[background-color,transform] duration-250 ease-out"

export function ProblemsTable({ problems }: ProblemsTableProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card overflow-hidden",
        "shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_4px_12px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.2),0_4px_12px_-2px_rgba(0,0,0,0.15)]",
        "animate-in fade-in duration-400",
        mounted ? "opacity-100" : "opacity-0"
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border/80 border-b">
            <TableHead className="w-12 text-center py-3.5">Status</TableHead>
            <TableHead className="py-3.5">Title</TableHead>
            <TableHead className="hidden md:table-cell py-3.5">Tags</TableHead>
            <TableHead className="w-24 py-3.5">Difficulty</TableHead>
            <TableHead className="hidden sm:table-cell w-28 text-right py-3.5">Acceptance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem, idx) => {
            const acceptance = displayAcceptance(problem)
            return (
              <TableRow
                key={problem.id}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/problem/${problem.slug}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    router.push(`/problem/${problem.slug}`)
                  }
                }}
                className={cn(
                  "group border-border/80 cursor-pointer",
                  rowTransition,
                  "hover:bg-muted/60 focus-within:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset",
                  idx % 2 === 0 ? "bg-card" : "bg-secondary/20",
                  problem.status === "solved" && "bg-easy/5 border-l-4 border-l-easy"
                )}
              >
                <TableCell className="text-center py-3.5">
                  {problem.status === "solved" ? (
                    <CheckCircle2 className="h-5 w-5 mx-auto text-easy transition-transform duration-200 ease-out group-hover:scale-110" />
                  ) : problem.status === "attempted" ? (
                    <Clock className="h-5 w-5 mx-auto text-medium transition-transform duration-200 ease-out group-hover:scale-110" />
                  ) : (
                    <Circle className="h-5 w-5 mx-auto text-muted-foreground/50 transition-transform duration-200 ease-out group-hover:scale-110" />
                  )}
                </TableCell>
                <TableCell className="py-3.5">
                  <Link
                    href={`/problem/${problem.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "font-medium text-foreground underline-offset-4 decoration-border/70",
                      "transition-colors duration-150 ease-out hover:text-primary group-hover:underline"
                    )}
                  >
                    {problem.title}
                  </Link>
                </TableCell>
                <TableCell className="hidden md:table-cell py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {problem.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs font-normal transition-transform duration-200 ease-out group-hover:scale-105"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {problem.tags.length > 2 && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal transition-transform duration-200 ease-out group-hover:scale-105"
                      >
                        +{problem.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-3.5">
                  <DifficultyBadge
                    difficulty={problem.difficulty}
                    className="transition-transform duration-200 ease-out group-hover:scale-105 inline-block"
                  />
                </TableCell>
                <TableCell className="hidden sm:table-cell text-right py-3.5">
                  <span className="text-muted-foreground transition-[filter] duration-200 ease-out group-hover:brightness-110">
                    {acceptance.toFixed(1)}%
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
