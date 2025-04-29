"use client"

import type React from "react"
import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { usePokemonContext } from "./pokemon-context"
import { pokemonTypes } from "@/lib/constants"

export default function SearchFilters() {
  const { searchTerm, setSearchTerm, selectedTypes, setSelectedTypes } = usePokemonContext()
  const [isOpen, setIsOpen] = useState(false)

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(selectedTypes.includes(type) 
      ? selectedTypes.filter((t: string) => t !== type) 
      : [...selectedTypes, type],
    )
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedTypes([])
  }

  const hasActiveFilters = searchTerm || selectedTypes.length > 0

  return (
    <div className="sticky top-4 z-10 pt-8 pb-4 bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search Pokémon by name..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault()
                  setIsOpen(!isOpen) // Toggle dropdown on button click
                }}
              >
                <Filter className="h-4 w-4" />
                Filter by Type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              {pokemonTypes.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => handleTypeToggle(type)}
                  className="capitalize"
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {selectedTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedTypes.map((type) => (
            <Badge key={type} variant="secondary" className="capitalize gap-1 px-3 py-1">
              {type}
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => handleTypeToggle(type)}>
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {type} filter</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
