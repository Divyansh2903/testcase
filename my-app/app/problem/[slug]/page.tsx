"use client"

import { useState, use, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
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
import { problems as localProblems } from "@/lib/data"
import { isDBloaded } from "@/lib/config"
import {
  problemsApi,
  submissionApi,
  mapBackendProblemToDetail,
  type SubmissionLanguage,
} from "@/lib/api"
import type { Problem } from "@/lib/types"

const JUDGE0_ID_TO_KEY: Record<number, "javascript" | "python" | "cpp"> = {
  63: "javascript",
  71: "python",
  54: "cpp",
}
const SUPPORTED_LANG_IDS = [63, 71, 54]

export default function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slugOrId = use(params).slug

  const problemQuery = useQuery({
    queryKey: ["problem", slugOrId],
    queryFn: async () => {
      const data = await problemsApi.getById(slugOrId)
      return data ? mapBackendProblemToDetail(data) : null
    },
    enabled: isDBloaded,
  })

  const problemFromDb = problemQuery.data
  const loading = isDBloaded && problemQuery.isLoading
  const fetchError = problemQuery.isError
    ? (problemQuery.error instanceof Error ? problemQuery.error.message : "Failed to load problem")
    : null
  const problem = isDBloaded ? problemFromDb ?? null : localProblems.find((p) => p.slug === slugOrId) ?? null

  const [languageKey, setLanguageKey] = useState<"javascript" | "python" | "cpp">("javascript")
  const [languageId, setLanguageId] = useState<number>(63)
  const [languages, setLanguages] = useState<SubmissionLanguage[]>([])
  const [code, setCode] = useState("")
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [activeTab, setActiveTab] = useState("testcase")
  const [isRunning, setIsRunning] = useState(false)
  const [panelWidth, setPanelWidth] = useState(45)

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[languageKey])
      setTestResults(
        problem.testCases.map((tc, index) => ({
          id: index + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          status: "idle" as const,
        }))
      )
    }
  }, [problem, languageKey])

  useEffect(() => {
    if (!isDBloaded || !problem) return
    submissionApi.getLanguages().then((list) => {
      const filtered = list.filter((l) => SUPPORTED_LANG_IDS.includes(l.id))
      setLanguages(filtered)
      if (filtered.length && !filtered.some((l) => l.id === languageId)) {
        const first = filtered[0]
        setLanguageId(first.id)
        setLanguageKey(JUDGE0_ID_TO_KEY[first.id] ?? "javascript")
        setCode(problem.starterCode[JUDGE0_ID_TO_KEY[first.id] ?? "javascript"])
      }
    })
  }, [isDBloaded, problem])

  if (!isDBloaded && !problem) notFound()
  if (isDBloaded && !loading && !problem) notFound()
  if (isDBloaded && fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">{fetchError}</p>
          <Button asChild variant="outline">
            <Link href="/problems">Back to Problems</Link>
          </Button>
        </div>
      </div>
    )
  }
  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    )
  }

  const handleLanguageChangeLocal = (newKey: "javascript" | "python" | "cpp") => {
    setLanguageKey(newKey)
    setCode(problem.starterCode[newKey])
  }

  const handleLanguageChangeDb = (id: number) => {
    const key = JUDGE0_ID_TO_KEY[id] ?? "javascript"
    setLanguageId(id)
    setLanguageKey(key)
    setCode(problem.starterCode[key])
  }

  const handleReset = () => {
    setCode(problem.starterCode[languageKey])
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
    setTestResults((prev) => prev.map((t) => ({ ...t, status: "running" as const })))
    for (let i = 0; i < testResults.length; i++) {
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 500))
      setTestResults((prev) =>
        prev.map((t, index) =>
          index === i
            ? {
                ...t,
                status: Math.random() > 0.3 ? "passed" : "failed",
                actualOutput: Math.random() > 0.3 ? t.expectedOutput : "[0,2]",
                runtime: Math.floor(Math.random() * 50) + 10,
              }
            : t
        )
      )
    }
    setIsRunning(false)
  }

  const handleSubmit = async () => {
    if (isDBloaded) {
      setIsRunning(true)
      setActiveTab("result")
      setTestResults((prev) => prev.map((t) => ({ ...t, status: "running" as const })))
      try {
        const submissionId = await submissionApi.submit(problem.id, code, languageId)
        let result = await submissionApi.pollResult(submissionId)
        while (result.status === "processing") {
          await new Promise((r) => setTimeout(r, 800))
          result = await submissionApi.pollResult(submissionId)
        }
        const subs = result.submissions as { stdout: string | null; status_id: number }[]
        setTestResults((prev) =>
          prev.map((t, i) => {
            const s = subs[i]
            const passed = s?.status_id === 3
            return {
              ...t,
              status: passed ? "passed" : "failed",
              actualOutput: s?.stdout ?? undefined,
              runtime: undefined,
            }
          })
        )
      } catch (err) {
        setTestResults((prev) =>
          prev.map((t) => ({ ...t, status: "error" as const }))
        )
      } finally {
        setIsRunning(false)
      }
    } else {
      setIsRunning(true)
      setActiveTab("result")
      setTestResults((prev) => prev.map((t) => ({ ...t, status: "running" as const })))
      await new Promise((r) => setTimeout(r, 1500))
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
  }

  const currentIndex = localProblems.findIndex((p) => p.slug === slugOrId)
  const prevProblem = !isDBloaded && currentIndex > 0 ? localProblems[currentIndex - 1] : null
  const nextProblem =
    !isDBloaded && currentIndex >= 0 && currentIndex < localProblems.length - 1
      ? localProblems[currentIndex + 1]
      : null

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between px-4 h-12 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Link href="/problems">
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
              {problem.id} {!isDBloaded && `/ ${localProblems.length}`}
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

      <div className="flex-1 flex overflow-hidden">
        <div
          className="border-r border-border bg-card overflow-hidden"
          style={{ width: `${panelWidth}%` }}
        >
          <ProblemDescription problem={problem} />
        </div>

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

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-card">
            {isDBloaded && languages.length > 0 ? (
              <Select
                value={String(languageId)}
                onValueChange={(v) => handleLanguageChangeDb(Number(v))}
              >
                <SelectTrigger className="w-40 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.id} value={String(lang.id)}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select
                value={languageKey}
                onValueChange={(v) => handleLanguageChangeLocal(v as "javascript" | "python" | "cpp")}
              >
                <SelectTrigger className="w-36 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
            )}

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

          <div className="flex-1 overflow-hidden">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={languageKey}
              className="h-full"
            />
          </div>

          <div className="h-[200px]">
            <TestResults
              results={
                testResults.length > 0
                  ? testResults
                  : problem.testCases.map((tc, i) => ({
                      id: i + 1,
                      input: tc.input,
                      expectedOutput: tc.expectedOutput,
                      status: "idle" as const,
                    }))
              }
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
