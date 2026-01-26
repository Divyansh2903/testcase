"use client"

import { Navbar } from "@/components/navbar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trophy, Medal, Award } from "lucide-react"

const leaderboardData = [
  { rank: 1, name: "Alex Chen", solved: 1247, streak: 365, country: "US" },
  { rank: 2, name: "Priya Sharma", solved: 1189, streak: 290, country: "IN" },
  { rank: 3, name: "James Wilson", solved: 1156, streak: 180, country: "UK" },
  { rank: 4, name: "Maria Garcia", solved: 1098, streak: 145, country: "ES" },
  { rank: 5, name: "Wei Zhang", solved: 1045, streak: 220, country: "CN" },
  { rank: 6, name: "Emma Johnson", solved: 987, streak: 90, country: "CA" },
  { rank: 7, name: "Ahmed Hassan", solved: 923, streak: 75, country: "EG" },
  { rank: 8, name: "Yuki Tanaka", solved: 891, streak: 120, country: "JP" },
  { rank: 9, name: "Lucas Silva", solved: 856, streak: 60, country: "BR" },
  { rank: 10, name: "Anna Kowalski", solved: 812, streak: 45, country: "PL" },
]

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />
    default:
      return <span className="text-muted-foreground">{rank}</span>
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container max-w-7xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">
            Top performers on the platform
          </p>
        </div>

        {/* Top 3 Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {leaderboardData.slice(0, 3).map((user, index) => (
            <div
              key={user.rank}
              className={`relative p-6 rounded-xl border ${index === 0
                  ? "bg-yellow-500/10 border-yellow-500/30"
                  : index === 1
                    ? "bg-gray-400/10 border-gray-400/30"
                    : "bg-amber-600/10 border-amber-600/30"
                }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="text-lg bg-secondary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center ${index === 0
                        ? "bg-yellow-500"
                        : index === 1
                          ? "bg-gray-400"
                          : "bg-amber-600"
                      }`}
                  >
                    <span className="text-xs font-bold text-background">{user.rank}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.country}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Solved: </span>
                  <span className="font-medium text-primary">{user.solved}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Streak: </span>
                  <span className="font-medium">{user.streak} days</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full Leaderboard Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-20">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Solved</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Streak</TableHead>
                <TableHead className="text-right hidden md:table-cell">Country</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((user) => (
                <TableRow key={user.rank}>
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(user.rank)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-secondary">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{user.solved}</Badge>
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell text-muted-foreground">
                    {user.streak} days
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell text-muted-foreground">
                    {user.country}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}
