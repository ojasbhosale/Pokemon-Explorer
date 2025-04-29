import { Suspense } from "react"
import PokemonGrid from "@/components/pokemon-grid"
import SearchFilters from "@/components/search-filters"
import { PokemonProvider } from "@/components/pokemon-context"
import { FavoritesProvider } from "@/components/favorites-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Loader } from "@/components/loader"

export default function Home() {
  return (
    <PokemonProvider>
      <FavoritesProvider>
        <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
          <section className="container px-4 py-10 mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="space-y-2 text-center sm:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Pokémon Explorer</h1>
                <p className="max-w-[700px] text-muted-foreground">
                  Discover and explore the first 150 Pokémon with advanced filtering and search capabilities.
                </p>
              </div>
              <ThemeToggle />
            </div>

            <SearchFilters />

            <Suspense fallback={<Loader count={12} />}>
              <PokemonGrid />
            </Suspense>
          </section>
        </main>
      </FavoritesProvider>
    </PokemonProvider>
  )
}
