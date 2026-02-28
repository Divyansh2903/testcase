"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Code2, Zap, Target, Trophy, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import useEmblaCarousel from "embla-carousel-react"
import { authApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { RedirectIfAuth } from "@/components/redirect-if-auth"

const slides = [
  {
    icon: <Code2 className="h-16 w-16 text-primary" />,
    title: "Master Data Structures & Algorithms",
    description: "Practice with curated problem sets designed to help you excel in technical interviews and competitive programming.",
  },
  {
    icon: <Zap className="h-16 w-16 text-primary" />,
    title: "Real-time Code Execution",
    description: "Write, test, and debug your solutions in our integrated code editor with instant feedback and detailed test results.",
  },
  {
    icon: <Target className="h-16 w-16 text-primary" />,
    title: "Track Your Progress",
    description: "Monitor your performance with detailed statistics, streaks, and personalized recommendations to improve your skills.",
  },
  {
    icon: <Trophy className="h-16 w-16 text-primary" />,
    title: "Compete on Leaderboards",
    description: "See how you rank against other developers and climb the leaderboard as you solve more problems.",
  },
]

export default function AuthPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [currentSlide, setCurrentSlide] = useState(0)

  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")
  const [signUpName, setSignUpName] = useState("")
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setCurrentSlide(emblaApi.selectedScrollSnap())
    }

    emblaApi.on("select", onSelect)
    onSelect()

    // Autoplay
    const autoplayInterval = setInterval(() => {
      emblaApi.scrollNext()
    }, 4000)

    return () => {
      emblaApi.off("select", onSelect)
      clearInterval(autoplayInterval)
    }
  }, [emblaApi])

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const res = await authApi.signIn(signInEmail, signInPassword)
      setUser(res.data.user)
      router.push("/problems")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const res = await authApi.signUp(signUpName, signUpEmail, signUpPassword)
      setUser(res.data)
      router.push("/problems")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <RedirectIfAuth>
    <div className="min-h-screen flex">
      {/* Left side - Slideshow */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} />
        <div className="relative z-10 w-full flex flex-col items-center justify-center p-12">
          <div className="w-full max-w-lg">
            <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
              <div className="flex">
                {slides.map((slide, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0 px-4">
                    <div className="flex flex-col items-center text-center space-y-6 py-8">
                      <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20">
                        {slide.icon}
                      </div>
                      <div className="space-y-3">
                        <h2 className="text-3xl font-bold tracking-tight">{slide.title}</h2>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto">
                          {slide.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide indicators */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                className="rounded-full"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollNext}
                className="rounded-full"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-center space-y-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-sm ring-1 ring-primary/20">
                <Code2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold tracking-tight">TestCase</span>
            </Link>
            <p className="text-sm text-muted-foreground">Get started with your account</p>
          </div>

          {/* Auth Tabs */}
          <Tabs defaultValue="signin" className="w-full" onValueChange={() => setError(null)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {error && (
              <p className="text-sm text-destructive mt-4 text-center" role="alert">
                {error}
              </p>
            )}

            <TabsContent value="signin" className="space-y-4 mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signin-password">Password</Label>
                    <Link
                      href="#"
                      className="text-sm text-primary hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a strong password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Creating account…" : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              By continuing, you agree to our{" "}
              <Link href="#" className="text-primary hover:underline" onClick={(e) => e.preventDefault()}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-primary hover:underline" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </RedirectIfAuth>
  )
}
