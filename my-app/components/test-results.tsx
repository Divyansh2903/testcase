"use client"

import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type TestStatus = "idle" | "running" | "passed" | "failed" | "error"

export interface TestResult {
  id: number
  input: string
  expectedOutput: string
  actualOutput?: string
  status: TestStatus
  runtime?: number
}

interface TestResultsProps {
  results: TestResult[]
  activeTab: string
  onTabChange: (value: string) => void
}

export function TestResults({ results, activeTab, onTabChange }: TestResultsProps) {
  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-4 w-4 text-easy" />
      case "failed":
        return <XCircle className="h-4 w-4 text-hard" />
      case "running":
        return <Clock className="h-4 w-4 text-medium animate-spin" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-hard" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
    }
  }

  const getStatusLabel = (status: TestStatus) => {
    switch (status) {
      case "passed":
        return "Accepted"
      case "failed":
        return "Wrong Answer"
      case "running":
        return "Running..."
      case "error":
        return "Error"
      default:
        return "Not Run"
    }
  }

  return (
    <div className="h-full flex flex-col bg-card border-t border-border">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col">
        <div className="border-b border-border px-4">
          <TabsList className="h-10 bg-transparent">
            <TabsTrigger value="testcase" className="text-xs">
              Testcase
            </TabsTrigger>
            <TabsTrigger value="result" className="text-xs">
              Test Result
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="testcase" className="flex-1 p-4 m-0 overflow-y-auto">
          <div className="space-y-3">
            {results.map((test) => (
              <div
                key={test.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 text-sm"
              >
                {getStatusIcon(test.status)}
                <div className="flex-1 space-y-2">
                  <div className="font-medium">Case {test.id}</div>
                  <div className="font-mono text-xs text-muted-foreground">
                    <div>Input: {test.input}</div>
                    <div>Expected: {test.expectedOutput}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="result" className="flex-1 p-4 m-0 overflow-y-auto">
          {results.some((r) => r.status !== "idle") ? (
            <div className="space-y-4">
              {results.map((test) => (
                <div
                  key={test.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    test.status === "passed"
                      ? "border-easy/30 bg-easy/5"
                      : test.status === "failed"
                        ? "border-hard/30 bg-hard/5"
                        : "border-border bg-secondary/30"
                  )}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {getStatusIcon(test.status)}
                    <span className="text-sm font-medium">
                      Case {test.id}: {getStatusLabel(test.status)}
                    </span>
                    {test.runtime && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        {test.runtime}ms
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-muted-foreground">Input: {test.input}</div>
                    <div className="text-muted-foreground">
                      Expected: {test.expectedOutput}
                    </div>
                    {test.actualOutput && (
                      <div
                        className={cn(
                          test.status === "passed" ? "text-easy" : "text-hard"
                        )}
                      >
                        Output: {test.actualOutput}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Run your code to see test results</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
