import { Suspense } from "react"
import { notFound } from "next/navigation"
import PokemonDetail from "@/components/pokemon-detail"
import { Loader } from "@/components/loader"
import { FavoritesProvider } from "@/components/favorites-provider"
import { fetchPokemonById } from "@/lib/api"
import type { Metadata } from 'next'

type Params = {
  id: string
}

export default async function PokemonPage({ 
  params 
}: { 
  params: Promise<Params> | Params
}) {
  try {
    // Await params if it's a Promise
    const resolvedParams = await Promise.resolve(params);
    const pokemonId = Number.parseInt(resolvedParams.id)
    
    if (isNaN(pokemonId) || pokemonId <= 0 || pokemonId > 150) {
      return notFound()
    }
    
    return (
      <FavoritesProvider>
        <main className="container px-4 py-8 mx-auto max-w-5xl">
          <Suspense fallback={<Loader count={1} />}>
            <PokemonDetail id={pokemonId} />
          </Suspense>
        </main>
      </FavoritesProvider>
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
  params: Promise<Params> | Params
}): Promise<Metadata> {
  try {
    // Await params if it's a Promise
    const resolvedParams = await Promise.resolve(params);
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