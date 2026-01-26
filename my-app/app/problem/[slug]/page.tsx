"use client"

import { useState, use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Play, Send, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CodeEditor } from "@/components/code-editor"
import { ProblemDescription } from "@/components/problem-description"
import { TestResults, type TestResult } from "@/components/test-results"
import { problems } from "@/lib/data"
import { cn } from "@/lib/utils"

type Language = "javascript" | "python" | "cpp"

export default function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const problem = problems.find((p) => p.slug === slug)

  const [language, setLanguage] = useState<Language>("javascript")
  const [code, setCode] = useState(problem?.starterCode.javascript || "")
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [activeTab, setActiveTab] = useState("testcase")
  const [isRunning, setIsRunning] = useState(false)
  const [panelWidth, setPanelWidth] = useState(45)

  if (!problem) {
    notFound()
  }

  // Initialize test results from problem test cases
  useState(() => {
    setTestResults(
      problem.testCases.map((tc, index) => ({
        id: index + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        status: "idle" as const,
      }))
    )
  })

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setCode(problem.starterCode[newLanguage])
  }

  const handleReset = () => {
    setCode(problem.starterCode[language])
    setTestResults(
      problem.testCases.map((tc, index) => ({
        id: index + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        status: "idle" as const,
      }))
    )
  }

  const handleRun = async () => {
    setIsRunning(true)
    setActiveTab("result")

    // Simulate running tests
    setTestResults((prev) =>
      prev.map((t) => ({ ...t, status: "running" as const }))
    )

    // Simulate test execution with delays
    for (let i = 0; i < testResults.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500))
      setTestResults((prev) =>
        prev.map((t, index) =>
          index === i
            ? {
              ...t,
              status: Math.random() > 0.3 ? "passed" : "failed",
              actualOutput:
                Math.random() > 0.3 ? t.expectedOutput : "[0,2]",
              runtime: Math.floor(Math.random() * 50) + 10,
            }
            : t
        )
      )
    }

    setIsRunning(false)
  }

  const handleSubmit = async () => {
    setIsRunning(true)
    setActiveTab("result")

    // Simulate submission
    setTestResults((prev) =>
      prev.map((t) => ({ ...t, status: "running" as const }))
    )

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const allPassed = Math.random() > 0.4
    setTestResults((prev) =>
      prev.map((t) => ({
        ...t,
        status: allPassed ? "passed" : Math.random() > 0.5 ? "passed" : "failed",
        actualOutput: allPassed ? t.expectedOutput : Math.random() > 0.5 ? t.expectedOutput : "[1,0]",
        runtime: Math.floor(Math.random() * 100) + 50,
      }))
    )

    setIsRunning(false)
  }

  // Find adjacent problems
  const currentIndex = problems.findIndex((p) => p.slug === slug)
  const prevProblem = currentIndex > 0 ? problems[currentIndex - 1] : null
  const nextProblem = currentIndex < problems.length - 1 ? problems[currentIndex + 1] : null

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-12 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Problems
            </Button>
          </Link>

          <div className="flex items-center gap-1">
            {prevProblem && (
              <Link href={`/problem/${prevProblem.slug}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <span className="text-sm text-muted-foreground px-2">
              {problem.id} / {problems.length}
            </span>
            {nextProblem && (
              <Link href={`/problem/${nextProblem.slug}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
            className="gap-1.5 bg-transparent"
          >
            <Play className="h-3.5 w-3.5" />
            Run
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isRunning}
            className="gap-1.5 bg-easy hover:bg-easy/90 text-easy-foreground"
          >
            <Send className="h-3.5 w-3.5" />
            Submit
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Problem Description Panel */}
        <div
          className="border-r border-border bg-card overflow-hidden"
          style={{ width: `${panelWidth}%` }}
        >
          <ProblemDescription problem={problem} />
        </div>

        {/* Resize Handle */}
        <div
          className="w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors"
          onMouseDown={(e) => {
            e.preventDefault()
            const startX = e.clientX
            const startWidth = panelWidth

            const handleMouseMove = (e: MouseEvent) => {
              const delta = e.clientX - startX
              const newWidth = startWidth + (delta / window.innerWidth) * 100
              setPanelWidth(Math.max(25, Math.min(70, newWidth)))
            }

            const handleMouseUp = () => {
              document.removeEventListener("mousemove", handleMouseMove)
              document.removeEventListener("mouseup", handleMouseUp)
            }

            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
          }}
        />

        {/* Code Editor Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-card">
            <Select value={language} onValueChange={(v) => handleLanguageChange(v as Language)}>
              <SelectTrigger className="w-36 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 text-xs text-muted-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              className="h-full"
            />
          </div>

          {/* Test Results */}
          <div className="h-[200px]">
            <TestResults
              results={testResults.length > 0 ? testResults : problem.testCases.map((tc, i) => ({
                id: i + 1,
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                status: "idle" as const,
              }))}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
