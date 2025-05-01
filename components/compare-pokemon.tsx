"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RandomCompareButton } from "./random-compare-button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ErrorState } from "@/components/error-state"
import { cn } from "@/lib/utils"
import { typeColors } from "@/lib/constants"
import type { Pokemon } from "@/lib/types"
import { fetchPokemonById } from "@/lib/api"
import { usePokemonContext } from "./pokemon-context"

export default function ComparePokemon() {
  const { allPokemon } = usePokemonContext()
  const [pokemon1, setPokemon1] = useState<Pokemon | null>(null)
  const [pokemon2, setPokemon2] = useState<Pokemon | null>(null)
  const [pokemon1Id, setPokemon1Id] = useState<string>("")
  const [pokemon2Id, setPokemon2Id] = useState<string>("")
  const [isLoading1, setIsLoading1] = useState(false)
  const [isLoading2, setIsLoading2] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Handle random comparison
  const handleRandomize = () => {
    // Generate two different random numbers between 1 and 150
    const random1 = Math.floor(Math.random() * 150) + 1
    let random2 = Math.floor(Math.random() * 150) + 1
    
    // Make sure the two numbers are different
    while (random1 === random2) {
      random2 = Math.floor(Math.random() * 150) + 1
    }
    
    // Set the Pokemon IDs
    setPokemon1Id(random1.toString())
    setPokemon2Id(random2.toString())
  }

  const loadPokemon = async (id: number, setPokemon: (pokemon: Pokemon | null) => void, setIsLoading: (loading: boolean) => void) => {
    if (id <= 0 || isNaN(id)) {
      setPokemon(null)
      return
    }
    
    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchPokemonById(id)
      setPokemon(data)
    } catch (err) {
      setError("Failed to load Pokémon data. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Pokemon 1 selection
  const handlePokemon1Change = (value: string) => {
    if (value === "placeholder") {
      setPokemon1Id("")
      setPokemon1(null)
    } else {
      setPokemon1Id(value)
    }
  }

  // Handle Pokemon 2 selection
  const handlePokemon2Change = (value: string) => {
    if (value === "placeholder") {
      setPokemon2Id("")
      setPokemon2(null)
    } else {
      setPokemon2Id(value)
    }
  }

  // Load the first Pokémon when selected
  useEffect(() => {
    if (pokemon1Id && pokemon1Id !== "placeholder") {
      const id = parseInt(pokemon1Id)
      loadPokemon(id, setPokemon1, setIsLoading1)
    } else {
      setPokemon1(null)
    }
  }, [pokemon1Id])

  // Load the second Pokémon when selected
  useEffect(() => {
    if (pokemon2Id && pokemon2Id !== "placeholder") {
      const id = parseInt(pokemon2Id)
      loadPokemon(id, setPokemon2, setIsLoading2)
    } else {
      setPokemon2(null)
    }
  }, [pokemon2Id])

  // Clear any previous error when a new selection is made
  useEffect(() => {
    setError(null)
  }, [pokemon1Id, pokemon2Id])

  const statMaxValues = {
    hp: 255,
    attack: 190,
    defense: 230,
    "special-attack": 194,
    "special-defense": 230,
    speed: 180,
  }

  const statNames = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  }

  // Helper to render a stat comparison
  const renderStat = (name: string, value1: number | undefined, value2: number | undefined) => {
    const statKey = name as keyof typeof statMaxValues
    const maxValue = statMaxValues[statKey] || 100
    const percent1 = value1 ? (value1 / maxValue) * 100 : 0
    const percent2 = value2 ? (value2 / maxValue) * 100 : 0
    const displayName = statNames[statKey] || name

    return (
      <div key={name} className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">{displayName}</span>
        </div>
        
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* First Pokémon's stat */}
          <div className="space-y-1">
            <div className="text-right font-medium">{value1 || "-"}</div>
            <Progress value={percent1} className="h-2" />
          </div>
          
          {/* Comparison indicator */}
          <div className="text-center font-bold px-2">
            {value1 && value2 ? (
              value1 > value2 ? (
                <span className="text-green-500">▲</span>
              ) : value1 < value2 ? (
                <span className="text-red-500">▼</span>
              ) : (
                <span className="text-yellow-500">=</span>
              )
            ) : (
              <span>-</span>
            )}
          </div>
          
          {/* Second Pokémon's stat */}
          <div className="space-y-1">
            <div className="font-medium">{value2 || "-"}</div>
            <Progress value={percent2} className="h-2" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to List
          </Button>
        </Link>
        <RandomCompareButton onRandomize={handleRandomize} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pokemon 1 Selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Select First Pokémon</label>
          <Select value={pokemon1Id || "placeholder"} onValueChange={handlePokemon1Change}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a Pokémon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder">-- Select Pokémon --</SelectItem>
              {allPokemon.map((pokemon) => (
                <SelectItem key={`p1-${pokemon.id}`} value={pokemon.id.toString()}>
                  #{pokemon.id.toString().padStart(3, "0")} - {pokemon.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pokemon 2 Selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Second Pokémon</label>
          <Select value={pokemon2Id || "placeholder"} onValueChange={handlePokemon2Change}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a Pokémon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder">-- Select Pokémon --</SelectItem>
              {allPokemon.map((pokemon) => (
                <SelectItem key={`p2-${pokemon.id}`} value={pokemon.id.toString()}>
                  #{pokemon.id.toString().padStart(3, "0")} - {pokemon.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Comparison content */}
      {(pokemon1 || isLoading1 || pokemon2 || isLoading2) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pokemon 1 Card */}
          <Card className="overflow-hidden">
            {isLoading1 ? (
              <div className="h-64 flex items-center justify-center">Loading...</div>
            ) : pokemon1 ? (
              <div>
                <div className={cn("relative h-48 flex items-center justify-center", `bg-${typeColors[pokemon1.types[0]]}/10`)}>
                  <Image
                    src={pokemon1.image || "/placeholder.svg"}
                    alt={pokemon1.name}
                    width={120}
                    height={120}
                    className="object-contain"
                    priority
                  />
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold">
                    #{pokemon1.id.toString().padStart(3, "0")}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold capitalize">{pokemon1.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPokemon1Id("")}
                      title="Clear selection"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pokemon1.types.map((type) => (
                      <Badge
                        key={type}
                        variant="outline"
                        className={cn(
                          "capitalize font-medium",
                          `bg-${typeColors[type]}/10 text-${typeColors[type]}-foreground`,
                        )}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Height</p>
                      <p className="font-medium">{pokemon1.height / 10}m</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Weight</p>
                      <p className="font-medium">{pokemon1.weight / 10}kg</p>
                    </div>
                  </div>
                </CardContent>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Select a Pokémon to compare
              </div>
            )}
          </Card>

          {/* Pokemon 2 Card */}
          <Card className="overflow-hidden">
            {isLoading2 ? (
              <div className="h-64 flex items-center justify-center">Loading...</div>
            ) : pokemon2 ? (
              <div>
                <div className={cn("relative h-48 flex items-center justify-center", `bg-${typeColors[pokemon2.types[0]]}/10`)}>
                  <Image
                    src={pokemon2.image || "/placeholder.svg"}
                    alt={pokemon2.name}
                    width={120}
                    height={120}
                    className="object-contain"
                    priority
                  />
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold">
                    #{pokemon2.id.toString().padStart(3, "0")}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold capitalize">{pokemon2.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPokemon2Id("")}
                      title="Clear selection"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pokemon2.types.map((type) => (
                      <Badge
                        key={type}
                        variant="outline"
                        className={cn(
                          "capitalize font-medium",
                          `bg-${typeColors[type]}/10 text-${typeColors[type]}-foreground`,
                        )}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Height</p>
                      <p className="font-medium">{pokemon2.height / 10}m</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Weight</p>
                      <p className="font-medium">{pokemon2.weight / 10}kg</p>
                    </div>
                  </div>
                </CardContent>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Select a Pokémon to compare
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Stats Comparison */}
      {pokemon1 && pokemon2 && (
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Stats Comparison</h2>
            <div className="space-y-6">
              {pokemon1.stats.map((stat, index) => {
                const stat2 = pokemon2.stats[index];
                return renderStat(stat.name, stat.value, stat2?.value);
              })}
              
              {/* Total stats comparison */}
              <div className="pt-4 border-t">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                  </div>
                  
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    {/* First Pokémon's total */}
                    <div className="text-right font-bold text-lg">
                      {pokemon1.stats.reduce((total, stat) => total + stat.value, 0)}
                    </div>
                    
                    {/* Comparison indicator */}
                    <div className="text-center font-bold px-2 text-lg">
                      {pokemon1.stats.reduce((total, stat) => total + stat.value, 0) > 
                       pokemon2.stats.reduce((total, stat) => total + stat.value, 0) ? (
                        <span className="text-green-500">▲</span>
                      ) : pokemon1.stats.reduce((total, stat) => total + stat.value, 0) < 
                         pokemon2.stats.reduce((total, stat) => total + stat.value, 0) ? (
                        <span className="text-red-500">▼</span>
                      ) : (
                        <span className="text-yellow-500">=</span>
                      )}
                    </div>
                    
                    {/* Second Pokémon's total */}
                    <div className="font-bold text-lg">
                      {pokemon2.stats.reduce((total, stat) => total + stat.value, 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}