"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Code2, LayoutDashboard, LogOut, Trophy, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, signOut } = useAuth()
  const isAdmin = pathname.startsWith("/admin")

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-14 items-center">
        <Link href="/" className="group mr-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm ring-1 ring-primary/20 transition-[transform,box-shadow] duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">TestCase</span>
        </Link>

        <nav className="flex flex-1 items-center gap-6">
          <Link
            href="/problems"
            className={cn(
              "relative text-sm font-medium transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-primary after:origin-left after:transition-transform",
              pathname === "/problems" || pathname.startsWith("/problem/")
                ? "text-primary after:scale-x-100"
                : "text-muted-foreground after:scale-x-0 hover:after:scale-x-100 after:opacity-40"
            )}
          >
            Problems
          </Link>
          <Link
            href="/leaderboard"
            className={cn(
              "relative text-sm font-medium transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-primary after:origin-left after:transition-transform",
              pathname === "/leaderboard"
                ? "text-primary after:scale-x-100"
                : "text-muted-foreground after:scale-x-0 hover:after:scale-x-100 after:opacity-40"
            )}
          >
            <span className="flex items-center gap-1.5">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user?.role === "ADMIN" && (
            <Button
              asChild
              variant={isAdmin ? "default" : "outline"}
              size="sm"
              className="gap-2 hover:text-foreground"
            >
              <Link href="/admin">
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}
          <ThemeToggle />
          {!isLoading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full gap-2">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                    {user.name}
                  </div>
                  <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth">Sign In</Link>
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  )
}
