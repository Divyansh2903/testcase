"use client"

import { useState, use, useEffect, useRef } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Play, Send, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
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
import { AuthGuard } from "@/components/auth-guard"
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
  const queryClient = useQueryClient()

  const problemQuery = useQuery({
    queryKey: ["problem", slugOrId],
    queryFn: async () => {
      const data = await problemsApi.getById(slugOrId)
      return data ? mapBackendProblemToDetail(data) : null
    },
    enabled: isDBloaded,
    refetchOnMount: "always",
    staleTime: 0,
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
  const codeByLanguageRef = useRef<Partial<Record<"javascript" | "python" | "cpp", string>>>({})
  const codeByLanguageLoadedRef = useRef(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [activeTab, setActiveTab] = useState("testcase")
  const [isRunning, setIsRunning] = useState(false)
  const [panelWidth, setPanelWidth] = useState(45)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const solvedLanguageKeyRef = useRef<"javascript" | "python" | "cpp" | null>(null)

  useEffect(() => {
    if (!problem) return
    setTestResults(
      problem.testCases.map((tc, index) => ({
        id: index + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        status: "idle" as const,
      }))
    )
    const saved = codeByLanguageRef.current[languageKey]
    if (saved !== undefined) {
      setCode(saved)
    } else {
      setCode(problem.starterCode[languageKey])
    }
  }, [problem, languageKey])

  useEffect(() => {
    if (!isDBloaded || !problem || codeByLanguageLoadedRef.current) return
    codeByLanguageLoadedRef.current = true
    const keyMap = JUDGE0_ID_TO_KEY
    async function loadSavedCode() {
      const p = problem
      if (!p) return
      const [byLang, lastAccepted] = await Promise.all([
        submissionApi.getLastByLanguage(p.id),
        submissionApi.getLastAccepted(p.id),
      ])
      if (byLang) {
        const langIds = Object.keys(byLang).map(Number)
        for (const id of langIds) {
          const key = keyMap[id as keyof typeof keyMap]
          if (key && byLang[id]) {
            codeByLanguageRef.current[key] = byLang[id].submittedCode
          }
        }
      }
      if (lastAccepted) {
        const key = keyMap[lastAccepted.languageId as keyof typeof keyMap] ?? "javascript"
        solvedLanguageKeyRef.current = key
        codeByLanguageRef.current[key] = lastAccepted.submittedCode
        setLanguageId(lastAccepted.languageId)
        setLanguageKey(key)
        setCode(lastAccepted.submittedCode)
      } else {
        const key = languageKey
        setCode(codeByLanguageRef.current[key] ?? p.starterCode[key])
      }
    }
    loadSavedCode()
  }, [isDBloaded, problem?.id])

  useEffect(() => {
    solvedLanguageKeyRef.current = null
    codeByLanguageRef.current = {}
    codeByLanguageLoadedRef.current = false
  }, [problem?.id])

  useEffect(() => {
    const p = problem
    if (!isDBloaded || !p) return
    submissionApi.getLanguages().then((list) => {
      const filtered = list.filter((l) => SUPPORTED_LANG_IDS.includes(l.id))
      setLanguages(filtered)
      if (filtered.length && !filtered.some((l) => l.id === languageId)) {
        const first = filtered[0]
        setLanguageId(first.id)
        const key = JUDGE0_ID_TO_KEY[first.id] ?? "javascript"
        setLanguageKey(key)
        const saved = codeByLanguageRef.current[key]
        setCode(saved ?? p.starterCode[key])
      }
    })
  }, [isDBloaded, problem])

  if (!isDBloaded && !problem) notFound()
  if (isDBloaded && !loading && !problem) notFound()
  if (isDBloaded && fetchError) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-2">{fetchError}</p>
            <Button asChild variant="outline">
              <Link href="/problems">Back to Problems</Link>
            </Button>
          </div>
        </div>
      </AuthGuard>
    )
  }
  if (!problem) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center text-muted-foreground">
          Loading…
        </div>
      </AuthGuard>
    )
  }

  const handleLanguageChangeLocal = (newKey: "javascript" | "python" | "cpp") => {
    codeByLanguageRef.current[languageKey] = code
    setLanguageKey(newKey)
    const saved = codeByLanguageRef.current[newKey]
    setCode(saved !== undefined ? saved : problem.starterCode[newKey])
  }

  const handleLanguageChangeDb = (id: number) => {
    const key = JUDGE0_ID_TO_KEY[id] ?? "javascript"
    codeByLanguageRef.current[languageKey] = code
    setLanguageId(id)
    setLanguageKey(key)
    const saved = codeByLanguageRef.current[key]
    setCode(saved !== undefined ? saved : problem.starterCode[key])
  }

  const handleCodeChange = (value: string) => {
    codeByLanguageRef.current[languageKey] = value
    setCode(value)
  }

  const handleReset = () => {
    const starter = problem.starterCode[languageKey]
    codeByLanguageRef.current[languageKey] = starter
    setCode(starter)
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
    const count = problem?.testCases?.length ?? 0
    if (count === 0) return
    setIsRunning(true)
    setActiveTab("result")
    setTestResults((prev) => prev.map((t) => ({ ...t, status: "running" as const })))
    try {
      for (let i = 0; i < count; i++) {
        await new Promise((r) => setTimeout(r, 400))
        setTestResults((prev) =>
          prev.map((t, index) =>
            index === i
              ? {
                  ...t,
                  status: "passed" as const,
                  actualOutput: t.expectedOutput,
                  runtime: Math.floor(Math.random() * 40) + 10,
                }
              : t
          )
        )
      }
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    if (isDBloaded) {
      setSubmitError(null)
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
        type SubResult = { stdout: string | null; stderr: string | null; status_id: number }
        const subs = result.submissions as SubResult[]
        const statusIdToError = (id: number): string => {
          if (id === 5) return "Time limit exceeded"
          if (id === 6) return "Compilation error"
          if (id > 6) return "Runtime error"
          return "Error"
        }
        const normalizeOutput = (out: string): string =>
          out
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .trim()
            .split("\n")
            .map((l) => l.trimEnd())
            .join("\n")
            .trimEnd()
        setTestResults((prev) => {
          const next = prev.map((t, i) => {
            const s = subs[i]
            const actual = s?.stdout ?? ""
            const expectedNorm = normalizeOutput(t.expectedOutput)
            const actualNorm = normalizeOutput(actual)
            const outputMatches = expectedNorm === actualNorm
            const runCompleted = s?.status_id === 3 || s?.status_id === 4
            const runError = s?.status_id != null && s.status_id >= 5
            const passed =
              runError ? false : (runCompleted && outputMatches)
            const hasNoOutput = (s?.stdout ?? "").trim() === ""
            const errorMessage =
              hasNoOutput && s?.status_id != null && s.status_id >= 5
                ? (s?.stderr?.trim() || statusIdToError(s.status_id))
                : hasNoOutput && s?.stderr?.trim()
                  ? s.stderr.trim()
                  : undefined
            const status: TestResult["status"] = runError
              ? "error"
              : passed
                ? "passed"
                : "failed"
            return {
              ...t,
              status,
              actualOutput: s?.stdout ?? undefined,
              runtime: undefined,
              errorMessage,
            }
          })
          return next
        })
        if (result.status === "Accepted") {
          queryClient.invalidateQueries({ queryKey: ["problem", slugOrId] })
          queryClient.invalidateQueries({ queryKey: ["problems"] })
          await queryClient.refetchQueries({ queryKey: ["problems"] })
        }
      } catch (err) {
        console.error("[Submit] error:", err)
        setSubmitError(err instanceof Error ? err.message : "Submission failed")
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
    <AuthGuard>
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
            <span className="text-sm text-muted-foreground px-2 flex items-center gap-1.5">
              {problem.id} {!isDBloaded && `/ ${localProblems.length}`}
              {isDBloaded && problem.status === "solved" && (
                <span title="Solved">
                  <CheckCircle2 className="h-4 w-4 text-easy" aria-label="Solved" />
                </span>
              )}
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
              onChange={handleCodeChange}
              language={languageKey}
              className="h-full"
            />
          </div>

          <div className="h-[200px] flex flex-col min-h-0">
            {submitError && (
              <div className="shrink-0 px-3 py-2 text-sm text-destructive bg-destructive/10 border-b border-border">
                {submitError}
              </div>
            )}
            <div className="flex-1 min-h-0">
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
    </div>
    </AuthGuard>
  )
}
