"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Pokemon } from "@/lib/types"
import { fetchPokemon } from "@/lib/api"

type SortOption = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc'

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
  setItemsPerPage: (count: number) => void
  sortOption: SortOption
  setSortOption: (option: SortOption) => void
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
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [sortOption, setSortOption] = useState<SortOption>('id-asc')

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

  // Filter and sort Pokémon based on search term, selected types, and sort option
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

    // Sort the filtered Pokémon
    filtered = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'id-asc':
          return a.id - b.id
        case 'id-desc':
          return b.id - a.id
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })

    setFilteredPokemon(filtered)
    
    // Reset to first page when filters or sort option changes
    setCurrentPage(1)
  }, [allPokemon, searchTerm, selectedTypes, sortOption])

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

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
        setItemsPerPage,
        sortOption,
        setSortOption,
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