import { cn } from "@/lib/utils"
import type { Difficulty } from "@/lib/types"

interface DifficultyBadgeProps {
  difficulty: Difficulty
  className?: string
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        {
          "bg-easy/15 text-easy": difficulty === "easy",
          "bg-medium/15 text-medium": difficulty === "medium",
          "bg-hard/15 text-hard": difficulty === "hard",
        },
        className
      )}
    >
      {difficulty}
    </span>
  )
}
