"use client"

import { useEffect } from "react"
import { usePokemonContext } from "./pokemon-context"
import PokemonCard from "./pokemon-card"
import { Pagination } from "./pagination"
import { EmptyState } from "./empty-state"
import { ErrorState } from "./error-state"

export default function PokemonGrid() {
  const { filteredPokemon, currentPage, setCurrentPage, itemsPerPage, isLoading, error } = usePokemonContext()

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredPokemon.length, setCurrentPage])

  if (error) {
    return <ErrorState message={error} />
  }

  if (!isLoading && filteredPokemon.length === 0) {
    return <EmptyState />
  }

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredPokemon.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage)

  return (
    <div className="space-y-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentItems.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  )
}
