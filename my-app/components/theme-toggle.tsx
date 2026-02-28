"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)
    const [isAnimating, setIsAnimating] = React.useState(false)
    const [animationPosition, setAnimationPosition] = React.useState({ x: 0, y: 0 })
    const [targetTheme, setTargetTheme] = React.useState<string>("light")
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    const handleClick = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            const newTheme = theme === "dark" ? "light" : "dark"
            setTargetTheme(newTheme)
            setAnimationPosition({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            })
            
            // Start animation immediately
            setIsAnimating(true)
            
            // Change theme at 25% of animation (~160ms) - when circle is expanding
            // This creates the effect of the new theme expanding from the button
            setTimeout(() => {
                setTheme(newTheme)
            }, 160)
            
            // Clean up after animation completes
            setTimeout(() => setIsAnimating(false), 650)
        }
    }

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="rounded-full">
                <Sun className="h-5 w-5" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        )
    }

    return (
        <>
            <Button
                ref={buttonRef}
                variant="ghost"
                size="icon"
                className="rounded-full relative z-10 transition-transform duration-200 ease-out hover:rotate-12 active:scale-90"
                onClick={handleClick}
            >
                {theme === "dark" ? (
                    <Sun className="h-5 w-5 transition-all duration-300 ease-out" style={{
                        transform: isAnimating ? "rotate(90deg) scale(0.9)" : "rotate(0deg) scale(1)",
                        opacity: isAnimating ? 0.7 : 1,
                    }} />
                ) : (
                    <Moon className="h-5 w-5 transition-all duration-300 ease-out" style={{
                        transform: isAnimating ? "rotate(-90deg) scale(0.9)" : "rotate(0deg) scale(1)",
                        opacity: isAnimating ? 0.7 : 1,
                    }} />
                )}
                <span className="sr-only">Toggle theme</span>
            </Button>
            {isAnimating && (
                <div
                    className="theme-transition-overlay fixed pointer-events-none z-[9999] rounded-full"
                    style={{
                        left: `${animationPosition.x}px`,
                        top: `${animationPosition.y}px`,
                        transform: "translate(-50%, -50%)",
                        "--overlay-color": targetTheme === "dark" 
                            ? "oklch(0.09 0 0 / 0.7)" 
                            : "oklch(0.98 0 0 / 0.7)",
                    } as React.CSSProperties}
                />
            )}
        </>
    )
}
