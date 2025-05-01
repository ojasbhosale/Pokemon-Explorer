"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { usePokemonContext } from "./pokemon-context"
import { useFavorites } from "./favorites-provider"
import PokemonCard from "./pokemon-card"
import { Pagination } from "./pagination"
import { FavoritesEmptyState } from "./favorites-empty-state"
import { Button } from "@/components/ui/button"
import type { Pokemon } from "@/lib/types"

export default function FavoritePokemonGrid() {
  const { allPokemon, isLoading } = usePokemonContext()
  const { favorites } = useFavorites()
  const [favoritePokemon, setFavoritePokemon] = useState<Pokemon[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  // Filter out only favorite Pokémon
  useEffect(() => {
    if (allPokemon.length > 0 && favorites.length > 0) {
      const favPokemon = allPokemon.filter(pokemon => favorites.includes(pokemon.id))
      setFavoritePokemon(favPokemon)
    } else {
      setFavoritePokemon([])
    }
  }, [allPokemon, favorites])

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  if (!isLoading && favoritePokemon.length === 0) {
    return (
      <div className="space-y-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to All Pokémon
          </Button>
        </Link>
        <FavoritesEmptyState />
      </div>
    )
  }

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = favoritePokemon.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(favoritePokemon.length / itemsPerPage)

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to All Pokémon
            </Button>
          </Link>
          <p className="mt-2 ml-2 text-sm text-muted-foreground">
            Showing {favoritePokemon.length} favorite {favoritePokemon.length === 1 ? 'Pokémon' : 'Pokémon'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentItems.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {favoritePokemon.length > itemsPerPage && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}
    </div>
  )
}