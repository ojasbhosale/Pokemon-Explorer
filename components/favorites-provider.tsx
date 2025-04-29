"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface FavoritesContextType {
  favorites: number[]
  toggleFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("pokemon-favorites")
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("pokemon-favorites", JSON.stringify(favorites))
    }
  }, [favorites, isInitialized])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]))
  }

  const isFavorite = (id: number) => favorites.includes(id)

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>{children}</FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
