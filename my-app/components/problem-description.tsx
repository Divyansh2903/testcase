import { DifficultyBadge } from "@/components/difficulty-badge"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Problem } from "@/lib/types"

interface ProblemDescriptionProps {
  problem: Problem
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-xl font-semibold">
              {problem.id}. {problem.title}
            </h1>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
          <div className="flex flex-wrap gap-2">
            {problem.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div className="prose prose-invert prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
            {problem.description}
          </div>
        </div>

        <div className="space-y-4">
          {problem.examples.map((example, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-sm font-medium">Example {index + 1}:</h3>
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2 font-mono text-sm min-w-0 overflow-x-auto break-words">
                <div className="min-w-0">
                  <span className="text-muted-foreground">Input: </span>
                  <span className="text-foreground break-all">{example.input}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-muted-foreground">Output: </span>
                  <span className="text-foreground break-all">{example.output}</span>
                </div>
                {example.explanation && (
                  <div className="text-muted-foreground text-xs pt-1 min-w-0 break-words">
                    <span className="font-semibold">Explanation: </span>
                    {example.explanation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Constraints:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {problem.constraints.map((constraint, index) => (
              <li key={index} className="font-mono text-xs">
                {constraint}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-6 text-xs text-muted-foreground pt-4 border-t border-border">
          <span>Acceptance: {problem.acceptance}%</span>
          <span>Submissions: {problem.submissions.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
