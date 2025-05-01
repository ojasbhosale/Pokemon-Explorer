"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Home, GitCompare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "./favorites-provider"
import { cn } from "@/lib/utils"
import { RandomPokemonButton } from "@/components/random-pokemon-button"

export function Navigation() {
  const pathname = usePathname()
  const { favorites } = useFavorites()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 sm:p-0 sm:bottom-8">
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg p-2">
        <Link href="/">
          <Button
            variant={pathname === "/" ? "default" : "ghost"}
            size="icon"
            className={cn(
              "rounded-full",
              pathname === "/" ? "text-background" : "text-foreground"
            )}
          >
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Button>
        </Link>
        <Link href="/favorites">
          <Button
            variant={pathname === "/favorites" ? "default" : "ghost"}
            size="icon"
            className={cn(
              "rounded-full relative",
              pathname === "/favorites" ? "text-background" : "text-foreground"
            )}
          >
            <Heart className="h-5 w-5" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                {favorites.length > 99 ? "99+" : favorites.length}
              </span>
            )}
            <span className="sr-only">Favorites</span>
          </Button>
        </Link>
        <Link href="/compare">
          <Button
            variant={pathname === "/compare" ? "default" : "ghost"}
            size="icon"
            className={cn(
              "rounded-full",
              pathname === "/compare" ? "text-background" : "text-foreground"
            )}
          >
            <GitCompare className="h-5 w-5" />
            <span className="sr-only">Compare</span>
          </Button>
        </Link>
        <RandomPokemonButton 
          variant={pathname.startsWith("/pokemon/") ? "default" : "ghost"}
          className={cn(
            "rounded-full",
            pathname.startsWith("/pokemon/") ? "text-background" : "text-foreground"
          )}
        />
      </div>
    </div>
  )
}