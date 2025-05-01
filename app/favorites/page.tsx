// app/favorites/page.tsx

import { Suspense } from "react"
import { FavoritesProvider } from "@/components/favorites-provider"
import { PokemonProvider } from "@/components/pokemon-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { Loader } from "@/components/loader"
import FavoritePokemonGrid from "../../components/favorite-pokemon-grid"
import { FavoritesManagement } from "@/components/favorites-management"
import { Navigation } from "@/components/navigation"

export default function FavoritesPage() {
  return (
    <PokemonProvider>
      <FavoritesProvider>
        <main className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-24">
          <section className="container px-4 py-10 mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="space-y-2 text-center sm:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Favorite Pokémon</h1>
                <p className="max-w-[700px] text-muted-foreground">
                  View and manage your favorite Pokémon collection.
                </p>
              </div>
              <ThemeToggle />
            </div>

            <FavoritesManagement />

            <Suspense fallback={<Loader count={12} />}>
              <FavoritePokemonGrid />
            </Suspense>
          </section>
          <Navigation />
        </main>
      </FavoritesProvider>
    </PokemonProvider>
  )
}