"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search, MoreHorizontal } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { problems as initialProblems } from "@/lib/data"
import type { Problem, Difficulty } from "@/lib/types"
import { ProblemForm } from "@/components/admin/problem-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Loading from "./loading"

export default function AdminPage() {
  const searchParams = useSearchParams()
  const [problems, setProblems] = useState<Problem[]>(initialProblems)
  const [search, setSearch] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null)
  const [deletingProblem, setDeletingProblem] = useState<Problem | null>(null)

  const filteredProblems = problems.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.id.includes(search)
  )

  const stats = {
    total: problems.length,
    easy: problems.filter((p) => p.difficulty === "easy").length,
    medium: problems.filter((p) => p.difficulty === "medium").length,
    hard: problems.filter((p) => p.difficulty === "hard").length,
  }

  const handleAddProblem = (problem: Omit<Problem, "id" | "submissions" | "acceptance">) => {
    const newProblem: Problem = {
      ...problem,
      id: String(problems.length + 1),
      submissions: 0,
      acceptance: 0,
    }
    setProblems([...problems, newProblem])
    setIsAddDialogOpen(false)
  }

  const handleEditProblem = (problem: Omit<Problem, "id" | "submissions" | "acceptance">) => {
    if (!editingProblem) return
    setProblems(
      problems.map((p) =>
        p.id === editingProblem.id
          ? { ...p, ...problem }
          : p
      )
    )
    setEditingProblem(null)
  }

  const handleDeleteProblem = () => {
    if (!deletingProblem) return
    setProblems(problems.filter((p) => p.id !== deletingProblem.id))
    setDeletingProblem(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage problems on the platform
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Problem
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Problem</DialogTitle>
                <DialogDescription>
                  Create a new coding problem for the platform
                </DialogDescription>
              </DialogHeader>
              <ProblemForm onSubmit={handleAddProblem} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Problems
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-easy">Easy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.easy}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-medium">Medium</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.medium}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-hard">Hard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hard}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border max-w-md"
          />
        </div>

        {/* Problems Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Tags</TableHead>
                <TableHead className="w-28">Difficulty</TableHead>
                <TableHead className="hidden sm:table-cell w-28">Submissions</TableHead>
                <TableHead className="w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProblems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell className="font-medium">{problem.id}</TableCell>
                  <TableCell>{problem.title}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {problem.submissions.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingProblem(problem)}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingProblem(problem)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No problems found.</p>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingProblem} onOpenChange={(open) => !open && setEditingProblem(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Problem</DialogTitle>
              <DialogDescription>
                Update the problem details
              </DialogDescription>
            </DialogHeader>
            {editingProblem && (
              <ProblemForm
                initialData={editingProblem}
                onSubmit={handleEditProblem}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingProblem} onOpenChange={(open) => !open && setDeletingProblem(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Problem</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingProblem?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProblem}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}

