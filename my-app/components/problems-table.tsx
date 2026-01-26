"use client"

import Link from "next/link"
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

interface ProblemsTableProps {
  problems: Problem[]
}

export function ProblemsTable({ problems }: ProblemsTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 text-center">Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Tags</TableHead>
            <TableHead className="w-24">Difficulty</TableHead>
            <TableHead className="hidden sm:table-cell w-28 text-right">Acceptance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem, idx) => (
            <TableRow
              key={problem.id}
              className={cn(
                "group transition-colors hover:bg-muted/40 focus-within:bg-muted/40",
                idx % 2 === 0 ? "bg-card" : "bg-secondary/30"
              )}
            >
              <TableCell className="text-center">
                {problem.status === "solved" ? (
                  <CheckCircle2 className="h-5 w-5 mx-auto text-easy" />
                ) : problem.status === "attempted" ? (
                  <Clock className="h-5 w-5 mx-auto text-medium" />
                ) : (
                  <Circle className="h-5 w-5 mx-auto text-muted-foreground/50" />
                )}
              </TableCell>
              <TableCell>
                <Link
                  href={`/problem/${problem.slug}`}
                  className="font-medium text-foreground transition-colors hover:text-primary group-hover:underline underline-offset-4 decoration-border/70"
                >
                  {problem.id}. {problem.title}
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-wrap gap-1.5">
                  {problem.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {problem.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      +{problem.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <DifficultyBadge difficulty={problem.difficulty} />
              </TableCell>
              <TableCell className="hidden sm:table-cell text-right text-muted-foreground">
                {problem.acceptance.toFixed(1)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
