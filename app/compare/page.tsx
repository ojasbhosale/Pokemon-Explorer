// app/compare/page.tsx

import { Suspense } from "react"
import { FavoritesProvider } from "@/components/favorites-provider"
import { PokemonProvider } from "@/components/pokemon-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { Loader } from "@/components/loader"
import ComparePokemon from "@/components/compare-pokemon"
import { Navigation } from "@/components/navigation"
import { ErrorBoundary } from "@/components/error-boundary"

export const metadata = {
  title: "Compare Pokémon | Pokémon Explorer",
  description: "Compare stats and abilities of different Pokémon side by side.",
}

export default function ComparePage() {
  return (
    <PokemonProvider>
      <FavoritesProvider>
        <main className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-24">
          <section className="container px-4 py-10 mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="space-y-2 text-center sm:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Compare Pokémon</h1>
                <p className="max-w-[700px] text-muted-foreground">
                  Compare the stats and abilities of two different Pokémon side by side.
                </p>
              </div>
              <ThemeToggle />
            </div>

            <ErrorBoundary>
              <Suspense fallback={<Loader count={2} />}>
                <ComparePokemon />
              </Suspense>
            </ErrorBoundary>
          </section>
          <Navigation />
        </main>
      </FavoritesProvider>
    </PokemonProvider>
  )
}