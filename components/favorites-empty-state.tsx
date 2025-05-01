"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FavoritesEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-muted/50 rounded-full p-6 mb-6">
        <Heart className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">No favorite Pokémon yet</h3>
      <p className="text-muted-foreground max-w-md mb-8">
        Click the heart icon on any Pokémon card to add it to your favorites. Your favorite Pokémon will appear here.
      </p>
      <Link href="/">
        <Button className="gap-2">
          <Heart className="h-4 w-4" />
          Start Adding Favorites
        </Button>
      </Link>
    </div>
  )
}