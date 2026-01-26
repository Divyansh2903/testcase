export type Difficulty = "easy" | "medium" | "hard"

export type ProblemStatus = "solved" | "attempted" | "unsolved"

export interface Problem {
  id: string
  title: string
  slug: string
  difficulty: Difficulty
  tags: string[]
  description: string
  examples: {
    input: string
    output: string
    explanation?: string
  }[]
  constraints: string[]
  starterCode: {
    javascript: string
    python: string
    cpp: string
  }
  testCases: {
    input: string
    expectedOutput: string
  }[]
  acceptance: number
  submissions: number
  status?: ProblemStatus
}

export interface User {
  id: string
  name: string
  email: string
  solved: number
  streak: number
  rank: number
  avatar?: string
}
