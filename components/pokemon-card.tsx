"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/components/favorites-provider"
import type { Pokemon } from "@/lib/types"
import { cn } from "@/lib/utils"
import { typeColors } from "@/lib/constants"

interface PokemonCardProps {
  pokemon: Pokemon
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { favorites, toggleFavorite } = useFavorites()
  const mainType = pokemon.types[0]
  const bgColor = typeColors[mainType] || "bg-card"
  const isFavorite = favorites.includes(pokemon.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        y: -10,
        transition: { duration: 0.2 },
      }}
      className="h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "overflow-hidden h-full transition-all duration-300 border-2",
          isHovered ? "shadow-xl border-primary/50" : "shadow-md border-transparent",
        )}
      >
        <Link href={`/pokemon/${pokemon.id}`} className="block">
          <div className={cn("relative h-48 flex items-center justify-center p-6", `bg-${bgColor}/10`)}>
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

            <div className="relative z-10 transition-all duration-300 transform group-hover:scale-110">
              <Image
                src={pokemon.image || "/placeholder.svg"}
                alt={pokemon.name}
                width={120}
                height={120}
                className="object-contain transition-all duration-300"
                priority
              />
            </div>

            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold">
              #{pokemon.id.toString().padStart(3, "0")}
            </div>
          </div>
        </Link>

        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Link href={`/pokemon/${pokemon.id}`}>
              <h3 className="text-xl font-bold capitalize hover:text-primary transition-colors">{pokemon.name}</h3>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", isFavorite && "text-red-500")}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                toggleFavorite(pokemon.id)
              }}
            >
              <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
              <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {pokemon.types.map((type) => (
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
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-0 flex justify-between">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Height</p>
              <p className="font-medium">{pokemon.height / 10}m</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Weight</p>
              <p className="font-medium">{pokemon.weight / 10}kg</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
