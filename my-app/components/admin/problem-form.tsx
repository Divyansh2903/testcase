"use client"

import React from "react"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Problem, Difficulty } from "@/lib/types"
import { allTags } from "@/lib/data"

interface ProblemFormProps {
  initialData?: Problem
  onSubmit: (problem: Omit<Problem, "id" | "submissions" | "acceptance">) => void
}

export function ProblemForm({ initialData, onSubmit }: ProblemFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [difficulty, setDifficulty] = useState<Difficulty>(initialData?.difficulty || "easy")
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [description, setDescription] = useState(initialData?.description || "")
  const [examples, setExamples] = useState(
    initialData?.examples || [{ input: "", output: "", explanation: "" }]
  )
  const [constraints, setConstraints] = useState<string[]>(initialData?.constraints || [""])
  const [starterCode, setStarterCode] = useState(
    initialData?.starterCode || {
      javascript: "// Write your JavaScript solution here\n",
      python: "# Write your Python solution here\n",
      cpp: "// Write your C++ solution here\n",
    }
  )
  const [testCases, setTestCases] = useState(
    initialData?.testCases || [{ input: "", expectedOutput: "" }]
  )

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!initialData) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
      )
    }
  }

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag))
    } else {
      setTags([...tags, tag])
    }
  }

  const addExample = () => {
    setExamples([...examples, { input: "", output: "", explanation: "" }])
  }

  const removeExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index))
  }

  const updateExample = (index: number, field: string, value: string) => {
    setExamples(
      examples.map((ex, i) =>
        i === index ? { ...ex, [field]: value } : ex
      )
    )
  }

  const addConstraint = () => {
    setConstraints([...constraints, ""])
  }

  const removeConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index))
  }

  const updateConstraint = (index: number, value: string) => {
    setConstraints(constraints.map((c, i) => (i === index ? value : c)))
  }

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "" }])
  }

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index))
  }

  const updateTestCase = (index: number, field: string, value: string) => {
    setTestCases(
      testCases.map((tc, i) =>
        i === index ? { ...tc, [field]: value } : tc
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      slug,
      difficulty,
      tags,
      description,
      examples: examples.filter((ex) => ex.input && ex.output),
      constraints: constraints.filter((c) => c.trim()),
      starterCode,
      testCases: testCases.filter((tc) => tc.input && tc.expectedOutput),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Two Sum"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="two-sum"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-secondary/30">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={tags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Problem description..."
          rows={6}
          required
        />
      </div>

      {/* Examples */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Examples</Label>
          <Button type="button" variant="outline" size="sm" onClick={addExample}>
            <Plus className="h-4 w-4 mr-1" />
            Add Example
          </Button>
        </div>
        {examples.map((example, index) => (
          <div key={index} className="space-y-2 p-4 border rounded-lg bg-secondary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Example {index + 1}</span>
              {examples.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeExample(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Input
              placeholder="Input: nums = [2,7,11,15], target = 9"
              value={example.input}
              onChange={(e) => updateExample(index, "input", e.target.value)}
            />
            <Input
              placeholder="Output: [0,1]"
              value={example.output}
              onChange={(e) => updateExample(index, "output", e.target.value)}
            />
            <Input
              placeholder="Explanation (optional)"
              value={example.explanation || ""}
              onChange={(e) => updateExample(index, "explanation", e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Constraints */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Constraints</Label>
          <Button type="button" variant="outline" size="sm" onClick={addConstraint}>
            <Plus className="h-4 w-4 mr-1" />
            Add Constraint
          </Button>
        </div>
        {constraints.map((constraint, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="2 <= nums.length <= 10^4"
              value={constraint}
              onChange={(e) => updateConstraint(index, e.target.value)}
            />
            {constraints.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeConstraint(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Starter Code */}
      <div className="space-y-3">
        <Label>Starter Code</Label>
        <Tabs defaultValue="javascript">
          <TabsList>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="cpp">C++</TabsTrigger>
          </TabsList>
          <TabsContent value="javascript">
            <Textarea
              value={starterCode.javascript}
              onChange={(e) =>
                setStarterCode({ ...starterCode, javascript: e.target.value })
              }
              className="font-mono text-sm"
              rows={8}
            />
          </TabsContent>
          <TabsContent value="python">
            <Textarea
              value={starterCode.python}
              onChange={(e) =>
                setStarterCode({ ...starterCode, python: e.target.value })
              }
              className="font-mono text-sm"
              rows={8}
            />
          </TabsContent>
          <TabsContent value="cpp">
            <Textarea
              value={starterCode.cpp}
              onChange={(e) =>
                setStarterCode({ ...starterCode, cpp: e.target.value })
              }
              className="font-mono text-sm"
              rows={8}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Test Cases */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Test Cases</Label>
          <Button type="button" variant="outline" size="sm" onClick={addTestCase}>
            <Plus className="h-4 w-4 mr-1" />
            Add Test Case
          </Button>
        </div>
        {testCases.map((testCase, index) => (
          <div key={index} className="space-y-2 p-4 border rounded-lg bg-secondary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Test Case {index + 1}</span>
              {testCases.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeTestCase(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Input
              placeholder="Input"
              value={testCase.input}
              onChange={(e) => updateTestCase(index, "input", e.target.value)}
            />
            <Input
              placeholder="Expected Output"
              value={testCase.expectedOutput}
              onChange={(e) => updateTestCase(index, "expectedOutput", e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="submit">
          {initialData ? "Update Problem" : "Create Problem"}
        </Button>
      </div>
    </form>
  )
}
