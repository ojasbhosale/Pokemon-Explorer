"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Pokemon } from "@/lib/types"
import { fetchPokemon } from "@/lib/api"

interface PokemonContextType {
  allPokemon: Pokemon[]
  filteredPokemon: Pokemon[]
  isLoading: boolean
  error: string | null
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedTypes: string[]
  setSelectedTypes: (types: string[]) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  itemsPerPage: number
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined)

export function PokemonProvider({ children }: { children: ReactNode }) {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([])
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Fetch all Pokémon data
  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setIsLoading(true)
        const data = await fetchPokemon()
        setAllPokemon(data)
        setFilteredPokemon(data)
      } catch (err) {
        setError("Failed to load Pokémon data. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadPokemon()
  }, [])

  // Filter Pokémon based on search term and selected types
  useEffect(() => {
    if (!allPokemon.length) return

    let filtered = [...allPokemon]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (pokemon) => pokemon.name.toLowerCase().includes(term) || pokemon.id.toString() === term,
      )
    }

    // Filter by selected types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((pokemon) => selectedTypes.every((type) => pokemon.types.includes(type)))
    }

    setFilteredPokemon(filtered)
  }, [allPokemon, searchTerm, selectedTypes])

  return (
    <PokemonContext.Provider
      value={{
        allPokemon,
        filteredPokemon,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        selectedTypes,
        setSelectedTypes,
        currentPage,
        setCurrentPage,
        itemsPerPage,
      }}
    >
      {children}
    </PokemonContext.Provider>
  )
}

export function usePokemonContext() {
  const context = useContext(PokemonContext)
  if (context === undefined) {
    throw new Error("usePokemonContext must be used within a PokemonProvider")
  }
  return context
}
