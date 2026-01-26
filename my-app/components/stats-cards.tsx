import { CheckCircle2, Flame, Target, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"



interface StatsCardsProps {
  totalSolved: number
  totalProblems: number
  streak: number
  rank: number
}

export function StatsCards({ totalSolved, totalProblems, streak, rank }: StatsCardsProps) {
  const stats = [
    {
      label: "Solved",
      value: `${totalSolved}/${totalProblems}`,
      icon: CheckCircle2,
      color: "text-easy",
      bgColor: "bg-easy/10",
    },
    {
      label: "Streak",
      value: `${streak} days`,
      icon: Flame,
      color: "text-medium",
      bgColor: "bg-medium/10",
    },
    {
      label: "Rank",
      value: `#${rank.toLocaleString()}`,
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Accuracy",
      value: `${totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0}%`,
      icon: Target,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="bg-card border-border transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-semibold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
