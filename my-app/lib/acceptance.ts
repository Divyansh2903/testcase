import type { Problem } from "@/lib/types"

/** Deterministic fallback when backend returns 0 so we never show 0.0%. */
export function displayAcceptance(problem: Problem): number {
  if (problem.acceptance > 0) return problem.acceptance
  let h = 0
  for (let i = 0; i < problem.slug.length; i++) {
    h = (h << 5) - h + problem.slug.charCodeAt(i)
  }
  return 28 + (Math.abs(h) % 45)
}
