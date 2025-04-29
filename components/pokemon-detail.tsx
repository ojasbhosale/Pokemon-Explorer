"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, Heart, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFavorites } from "@/components/favorites-provider"
import { ErrorState } from "@/components/error-state"
import { cn } from "@/lib/utils"
import { typeColors } from "@/lib/constants"
import type { Pokemon } from "@/lib/types"
import { fetchPokemonById } from "@/lib/api"

interface PokemonDetailProps {
  id: number
}

export default function PokemonDetail({ id }: PokemonDetailProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { favorites, toggleFavorite } = useFavorites()

  const isFavorite = favorites.includes(id)

  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setIsLoading(true)
        const data = await fetchPokemonById(id)
        setPokemon(data)
      } catch (err) {
        setError("Failed to load Pokémon data. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadPokemon()
  }, [id])

  if (error) {
    return <ErrorState message={error} />
  }

  if (isLoading || !pokemon) {
    return <div className="h-96 flex items-center justify-center">Loading...</div>
  }

  const mainType = pokemon.types[0]
  const bgColor = typeColors[mainType] || "bg-card"

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to List
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggleFavorite(id)}
            className={cn(isFavorite && "text-red-500")}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
            <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
          </Button>
          <Button variant="outline" size="icon">
            <Share className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_2fr] gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className={cn("overflow-hidden border-2", `border-${bgColor}/50`)}>
            <div className={cn("relative h-64 flex items-center justify-center p-6", `bg-${bgColor}/10`)}>
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="39" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M40 2C62.0914 2 80 19.9086 80 42C80 64.0914 62.0914 82 40 82C17.9086 82 0 64.0914 0 42C0 19.9086 17.9086 2 40 2Z"
                    fill="currentColor"
                    fillOpacity="0.1"
                  />
                  <path
                    d="M40 52C45.5228 52 50 47.5228 50 42C50 36.4772 45.5228 32 40 32C34.4772 32 30 36.4772 30 42C30 47.5228 34.4772 52 40 52Z"
                    fill="currentColor"
                    fillOpacity="0.1"
                  />
                </svg>
              </div>

              <Image
                src={pokemon.image || "/placeholder.svg"}
                alt={pokemon.name}
                width={180}
                height={180}
                className="object-contain z-10"
                priority
              />

              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold">
                #{pokemon.id.toString().padStart(3, "0")}
              </div>
            </div>

            <CardContent className="p-6">
              <h1 className="text-3xl font-bold capitalize mb-4">{pokemon.name}</h1>

              <div className="flex flex-wrap gap-2 mb-4">
                {pokemon.types.map((type) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className={cn(
                      "capitalize font-medium text-sm px-3 py-1",
                      `bg-${typeColors[type]}/10 text-${typeColors[type]}-foreground`,
                    )}
                  >
                    {type}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Height</p>
                  <p className="font-medium">{pokemon.height / 10}m</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Weight</p>
                  <p className="font-medium">{pokemon.weight / 10}kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="abilities">Abilities</TabsTrigger>
              <TabsTrigger value="evolution">Evolution</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-6">
              <h2 className="text-2xl font-bold">Base Stats</h2>
              <div className="space-y-4">
                {pokemon.stats.map((stat) => {
                  const statKey = stat.name as keyof typeof statMaxValues
                  const maxValue = statMaxValues[statKey] || 100
                  const percentage = (stat.value / maxValue) * 100

                  return (
                    <div key={stat.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{statNames[statKey] || stat.name}</span>
                        <span className="text-sm font-medium">{stat.value}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2">Stat Total</h3>
                <p className="text-2xl font-bold">{pokemon.stats.reduce((total, stat) => total + stat.value, 0)}</p>
              </div>
            </TabsContent>

            <TabsContent value="abilities" className="space-y-6">
              <h2 className="text-2xl font-bold">Abilities</h2>
              <div className="space-y-4">
                {pokemon.abilities?.map((ability) => (
                  <Card key={ability.name} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-2">
                        {ability.isHidden && (
                          <Badge variant="outline" className="bg-muted">
                            Hidden
                          </Badge>
                        )}
                        <h3 className="text-lg font-semibold capitalize">{ability.name.replace("-", " ")}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {ability.description || "No description available."}
                      </p>
                    </CardContent>
                  </Card>
                ))}

                {(!pokemon.abilities || pokemon.abilities.length === 0) && (
                  <p className="text-muted-foreground">No ability information available.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="evolution" className="space-y-6">
              <h2 className="text-2xl font-bold">Evolution Chain</h2>

              {pokemon.evolutionChain && pokemon.evolutionChain.length > 0 ? (
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-4">
                  {pokemon.evolutionChain.map((evolution, i) => (
                    <div key={evolution.id} className="flex flex-col items-center">
                      <Link href={`/pokemon/${evolution.id}`} className="group">
                        <div
                          className={cn(
                            "relative w-32 h-32 flex items-center justify-center rounded-full mb-2",
                            `bg-${typeColors[mainType]}/10`,
                            pokemon.id === evolution.id && `ring-2 ring-${typeColors[mainType]}`,
                          )}
                        >
                          <Image
                            src={evolution.image || "/placeholder.svg"}
                            alt={evolution.name}
                            width={100}
                            height={100}
                            className="object-contain transition-transform group-hover:scale-110"
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">#{evolution.id.toString().padStart(3, "0")}</p>
                          <p className="font-medium capitalize">{evolution.name}</p>
                        </div>
                      </Link>

                      {i < (pokemon.evolutionChain?.length || 0) - 1 && (
                        <div className="hidden md:flex items-center justify-center w-12 h-12 mx-4">
                          <ChevronLeft className="rotate-180 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No evolution information available.</p>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6">Similar Pokémon</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {pokemon.similarPokemon?.map((similar) => (
            <Link key={similar.id} href={`/pokemon/${similar.id}`} className="group">
              <Card className="overflow-hidden h-full transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-md">
                <div
                  className={cn(
                    "relative h-24 flex items-center justify-center",
                    `bg-${typeColors[similar.types[0]]}/10`,
                  )}
                >
                  <Image
                    src={similar.image || "/placeholder.svg"}
                    alt={similar.name}
                    width={60}
                    height={60}
                    className="object-contain transition-transform group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">#{similar.id.toString().padStart(3, "0")}</p>
                  <p className="font-medium capitalize truncate">{similar.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}

          {(!pokemon.similarPokemon || pokemon.similarPokemon.length === 0) && (
            <p className="text-muted-foreground col-span-full">No similar Pokémon available.</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
