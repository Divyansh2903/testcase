"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2, Flame, Target, Trophy, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const ACCURACY_TOOLTIP =
  "Accuracy = (Problems solved / Total problems) × 100%. Based on your current problem set."

const CARD_PADDING = "p-4"
const ICON_SIZE = "h-5 w-5"
const ICON_BOX = "p-2 rounded-lg shrink-0"
const LABEL_CLASS = "text-xs text-muted-foreground/70"
const VALUE_CLASS = "text-xl font-semibold tabular-nums tracking-tight"
const VISUAL_GAP = "mt-2"

interface StatsCardsProps {
  totalSolved: number
  totalProblems: number
  streak: number
  rank: number
  rankTrend?: "up" | "down"
  /** Solved today (for "+X today" label) */
  solvedToday?: number
}

function useCountUp(end: number, durationMs: number, enabled: boolean) {
  const [value, setValue] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!enabled || end === 0) {
      setValue(end)
      return
    }
    startRef.current = null
    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts
      const elapsed = ts - startRef.current
      const t = Math.min(elapsed / durationMs, 1)
      const easeOut = 1 - (1 - t) ** 2
      setValue(Math.round(easeOut * end))
      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [end, durationMs, enabled])

  return value
}

function AccuracyDonut({
  value,
  animate,
  hover,
}: {
  value: number
  animate: boolean
  hover: boolean
}) {
  const size = 44
  const stroke = 4
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const fromOffset = circumference
  const toOffset = circumference - (value / 100) * circumference
  const offset = animate && mounted ? toOffset : fromOffset

  return (
    <div
      className="inline-flex transition-transform duration-200"
      style={{ width: size, height: size }}
      title={ACCURACY_TOOLTIP}
    >
      <svg className="-rotate-90" width={size} height={size} aria-hidden>
        <circle
          className="stroke-muted/40"
          strokeWidth={stroke}
          fill="none"
          r={r}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="stroke-chart-2 fill-none transition-[stroke-dashoffset,stroke-width] duration-500 ease-out"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            strokeWidth: hover ? 5 : stroke,
          }}
          r={r}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
    </div>
  )
}

export function StatsCards({
  totalSolved,
  totalProblems,
  streak,
  rank,
  rankTrend = "up",
  solvedToday = 0,
}: StatsCardsProps) {
  const [mounted, setMounted] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  useEffect(() => setMounted(true), [])

  const accuracy = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0
  const progressPct = totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0

  const countUpDuration = 600
  const solvedDisplay = useCountUp(totalSolved, countUpDuration, mounted)
  const totalDisplay = useCountUp(totalProblems, countUpDuration, mounted)
  const streakDisplay = useCountUp(streak, countUpDuration, mounted)
  const rankDisplay = useCountUp(rank, countUpDuration, mounted)

  const stats = [
    {
      key: "Solved",
      label: "Solved",
      value: `${solvedDisplay}/${totalDisplay}`,
      sub: solvedToday > 0 ? `+${solvedToday} today` : null,
      icon: CheckCircle2,
      color: "text-easy",
      bgColor: "bg-easy/10",
      dominant: true,
      progress: progressPct,
    },
    {
      key: "Streak",
      label: "Streak",
      value: `${streakDisplay} days`,
      sub: null,
      icon: Flame,
      color: "text-medium",
      bgColor: "bg-medium/10",
      dominant: false,
      progress: null as number | null,
      hasGlow: streak > 0,
    },
    {
      key: "Rank",
      label: "Rank",
      value: `#${rankDisplay.toLocaleString()}`,
      sub: null,
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
      dominant: false,
      progress: null as number | null,
      rankTrend,
    },
    {
      key: "Accuracy",
      label: "Accuracy",
      value: `${accuracy}%`,
      sub: null,
      icon: Target,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      dominant: false,
      progress: null as number | null,
      isAccuracy: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      {stats.map((stat, index) => (
        <Card
          key={stat.key}
          title={stat.isAccuracy ? ACCURACY_TOOLTIP : undefined}
          onMouseEnter={() => setHoveredCard(stat.key)}
          onMouseLeave={() => setHoveredCard(null)}
          className={cn(
            "bg-card border border-border/80 rounded-xl",
            "shadow-[0_1px_2px_0_rgba(0,0,0,0.04),inset_0_1px_0_0_rgba(255,255,255,0.03)] dark:shadow-[0_1px_2px_0_rgba(0,0,0,0.15),inset_0_1px_0_0_rgba(255,255,255,0.02)]",
            "transition-[transform,box-shadow,border-color] duration-250 ease-out",
            "hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_6px_16px_-4px_rgba(0,0,0,0.3)]",
            "hover:border-primary/20 dark:hover:border-primary/25",
            "hover:scale-[1.02]",
            stat.dominant && "ring-1 ring-easy/20 border-easy/30",
            "animate-in fade-in slide-in-from-bottom-3 duration-300"
          )}
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <CardContent className={cn(CARD_PADDING, "flex flex-col")}>
            {/* Row 1: icon + label (same height for all cards so titles align) */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  ICON_BOX,
                  stat.bgColor,
                  stat.hasGlow && "shadow-[0_0_12px_var(--medium)]"
                )}
              >
                <stat.icon className={cn(ICON_SIZE, stat.color)} />
              </div>
              <p className={cn(LABEL_CLASS, "leading-tight")}>{stat.label}</p>
            </div>
            {/* Row 2: number (same font for all); Accuracy shows "50%" then donut in row 3 */}
            <div className={cn("min-h-8 flex items-center", VISUAL_GAP)}>
              <p className={cn(VALUE_CLASS)}>
                {stat.isAccuracy ? `${accuracy}%` : stat.value}
                {stat.key === "Rank" && (
                  <span
                    className="ml-1 inline-flex text-muted-foreground animate-[stats-pulse_0.6s_ease-out_1]"
                    aria-hidden
                  >
                    {stat.rankTrend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-easy" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive/80" />
                    )}
                  </span>
                )}
              </p>
            </div>
            {/* Row 3: visual (progress bar, or donut for Accuracy) — same vertical level */}
            <div className={cn("min-h-11 flex items-end", VISUAL_GAP)}>
              {stat.key === "Solved" && (
                <div className="w-full space-y-0.5">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                    <div
                      className="h-full rounded-full bg-easy transition-[width] duration-700 ease-out"
                      style={{ width: mounted ? `${progressPct}%` : "0%" }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground/80 tabular-nums">
                    {mounted ? Math.round(progressPct) : 0}%
                  </p>
                </div>
              )}
              {stat.isAccuracy && (
                <AccuracyDonut
                  value={accuracy}
                  animate={mounted}
                  hover={hoveredCard === "Accuracy"}
                />
              )}
              {stat.sub && (
                <p className="text-[10px] text-muted-foreground/80">{stat.sub}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
