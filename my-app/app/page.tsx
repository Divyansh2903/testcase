"use client"

import Link from "next/link"
import { ArrowRight, Code2, Zap, Target, Trophy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "../components/navbar"
import { RedirectIfAuth } from "@/components/redirect-if-auth"

const features = [
  {
    icon: <Code2 className="h-6 w-6" />,
    title: "Curated Problem Sets",
    description: "Practice with handpicked problems designed to strengthen your DSA fundamentals.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Real-time Execution",
    description: "Write, test, and debug your solutions with instant feedback and detailed results.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Track Progress",
    description: "Monitor your performance with statistics, streaks, and personalized insights.",
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    title: "Compete & Learn",
    description: "See how you rank on leaderboards and learn from the best solutions.",
  },
]

const benefits = [
  "Master data structures and algorithms",
  "Ace technical interviews",
  "Improve problem-solving skills",
  "Track your learning progress",
]

export default function LandingPage() {
  return (
    <RedirectIfAuth>
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20 mb-4">
              <Code2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Master Data Structures & Algorithms
            </h1>
            <p className="text-xl text-muted-foreground">
              Practice with curated problem sets designed to help you excel in technical interviews
              and competitive programming.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/auth">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/problems">Browse Problems</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="border-t border-border bg-muted/30">
          <div className="container max-w-6xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Everything you need to succeed</h2>
            <p className="text-muted-foreground text-lg">
              Powerful features to accelerate your learning journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary shrink-0">
                    {feature.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border bg-muted/30">
          <div className="container max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to start your journey?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of developers mastering data structures and algorithms. Start solving
              problems today.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link href="/auth">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
    </RedirectIfAuth>
  )
}
