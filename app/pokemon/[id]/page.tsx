// app/pokemon/[id]/page.tsx

import { Suspense } from "react"
import { notFound } from "next/navigation"
import PokemonDetail from "@/components/pokemon-detail"
import { Loader } from "@/components/loader"
import { FavoritesProvider } from "@/components/favorites-provider"
import { PokemonProvider } from "@/components/pokemon-context"
import { Navigation } from "@/components/navigation"
import { fetchPokemonById } from "@/lib/api"
import type { Metadata } from 'next'

type Params = {
  id: string
}

export default async function PokemonPage({ 
  params 
}: { 
  params: Promise<Params>
}) {
  try {
    // Await params before using
    const resolvedParams = await params;
    const pokemonId = Number.parseInt(resolvedParams.id)
    
    if (isNaN(pokemonId) || pokemonId <= 0 || pokemonId > 150) {
      return notFound()
    }
    
    return (
      <PokemonProvider>
        <FavoritesProvider>
          <main className="container px-4 py-8 mx-auto max-w-5xl pb-24">
            <Suspense fallback={<Loader count={1} />}>
              <PokemonDetail id={pokemonId} />
            </Suspense>
            <Navigation />
          </main>
        </FavoritesProvider>
      </PokemonProvider>
    )
  } catch (error) {
    console.log(error)
    return notFound()
  }
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  // Pre-generate the first 150 Pokémon pages
  return Array.from({ length: 150 }, (_, i) => ({
    id: (i + 1).toString(),
  }))
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<Params>
}): Promise<Metadata> {
  try {
    // Await params before using
    const resolvedParams = await params;
    const pokemonId = Number.parseInt(resolvedParams.id)
    
    if (isNaN(pokemonId) || pokemonId <= 0 || pokemonId > 150) {
      return {
        title: "Pokémon Not Found",
      }
    }
    
    const pokemon = await fetchPokemonById(pokemonId)
    return {
      title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} | Pokémon Explorer`,
      description: `View detailed information about ${pokemon.name}, including stats, abilities, and more.`,
    }
  } catch (error) {
    console.log(error)
    return {
      title: "Pokémon Details | Pokémon Explorer",
    }
  }
}