"use client"

import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePokemonContext } from "./pokemon-context"

export function EmptyState() {
  const { setSearchTerm, setSelectedTypes } = usePokemonContext()

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedTypes([])
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-2xl font-bold mb-2">No Pokémon Found</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        We couldn&apos;t find any Pokémon matching your search criteria. Try adjusting your filters or search term.
      </p>
      <Button onClick={resetFilters}>Reset Filters</Button>
    </div>
  )
}
