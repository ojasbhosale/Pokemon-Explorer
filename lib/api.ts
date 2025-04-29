import type { Pokemon, PokemonDetail, PokemonListItem } from "./types"

const API_BASE_URL = "https://pokeapi.co/api/v2"

export async function fetchPokemon(): Promise<Pokemon[]> {
  try {
    // Fetch the first 150 Pokémon
    const response = await fetch(`${API_BASE_URL}/pokemon?limit=150`)

    if (!response.ok) {
      throw new Error("Failed to fetch Pokémon list")
    }

    const data = await response.json()

    // Fetch detailed data for each Pokémon
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon: { name: string; url: string }) => {
        const detailResponse = await fetch(pokemon.url)

        if (!detailResponse.ok) {
          throw new Error(`Failed to fetch details for ${pokemon.name}`)
        }

        return detailResponse.json()
      }),
    )

    // Transform the data into our Pokemon type
    return pokemonDetails.map((detail: PokemonDetail) => ({
      id: detail.id,
      name: detail.name,
      image: detail.sprites.other["official-artwork"].front_default || detail.sprites.front_default,
      types: detail.types.map((type: { type: { name: string } }) => type.type.name),
      height: detail.height,
      weight: detail.weight,
      stats: detail.stats.map((stat: { stat: { name: string }; base_stat: number }) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
    }))
  } catch (error) {
    console.error("Error fetching Pokémon:", error)
    throw error
  }
}

export async function fetchPokemonById(id: number): Promise<Pokemon> {
  try {
    // Fetch the specific Pokémon
    const response = await fetch(`${API_BASE_URL}/pokemon/${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon with ID ${id}`)
    }

    const detail = await response.json()

    // Fetch species data for evolution chain
    const speciesResponse = await fetch(detail.species.url)

    if (!speciesResponse.ok) {
      throw new Error(`Failed to fetch species data for ${detail.name}`)
    }

    const speciesData = await speciesResponse.json()

    // Fetch ability descriptions
    const abilities = await Promise.all(
      detail.abilities.map(async (abilityData: { ability: { name: string; url: string }; is_hidden: boolean }) => {
        try {
          const abilityResponse = await fetch(abilityData.ability.url)

          if (!abilityResponse.ok) {
            return {
              name: abilityData.ability.name,
              isHidden: abilityData.is_hidden,
              description: null,
            }
          }

          const abilityDetail = await abilityResponse.json()
          const englishEntry = abilityDetail.effect_entries.find(
            (entry: { language: { name: string } }) => entry.language.name === "en",
          )

          return {
            name: abilityData.ability.name,
            isHidden: abilityData.is_hidden,
            description: englishEntry ? englishEntry.effect : null,
          }
        } catch (error) {
          console.error(`Error fetching ability data for ${abilityData.ability.name}:`, error)
          return {
            name: abilityData.ability.name,
            isHidden: abilityData.is_hidden,
            description: null,
          }
        }
      }),
    )

    // Get evolution chain data if available
    let evolutionChain: { id: number; name: string; image: string }[] = []
    if (speciesData.evolution_chain) {
      try {
        const evolutionResponse = await fetch(speciesData.evolution_chain.url)

        if (evolutionResponse.ok) {
          const evolutionData = await evolutionResponse.json()

          // Process evolution chain
          evolutionChain = await processEvolutionChain(evolutionData.chain)
        }
      } catch (error) {
        console.error(`Error fetching evolution chain for ${detail.name}:`, error)
      }
    }

    // Get similar Pokémon (same type)
    let similarPokemon: { id: number; name: string; image: string; types: string[] }[] = []
    try {
      const mainType = detail.types[0].type.name
      const typeResponse = await fetch(`${API_BASE_URL}/type/${mainType}`)

      if (typeResponse.ok) {
        const typeData = await typeResponse.json()

        // Get 5 random Pokémon of the same type (excluding self)
        const sameTypePokemon = typeData.pokemon
          .filter((p: { pokemon: PokemonListItem }) => {
            const pokemonId = Number.parseInt(p.pokemon.url.split("/").filter(Boolean).pop() || "0")
            return pokemonId <= 150 && pokemonId !== id
          })
          .map((p: { pokemon: PokemonListItem }) => p.pokemon)
          .sort(() => 0.5 - Math.random())
          .slice(0, 5)

        // Fetch basic details for similar Pokémon
        similarPokemon = await Promise.all(
          sameTypePokemon.map(async (pokemon: PokemonListItem) => {
            try {
              const similarResponse = await fetch(pokemon.url)

              if (!similarResponse.ok) {
                return null
              }

              const similarData = await similarResponse.json()

              return {
                id: similarData.id,
                name: similarData.name,
                image: similarData.sprites.other["official-artwork"].front_default || similarData.sprites.front_default,
                types: similarData.types.map((t: { type: { name: string } }) => t.type.name),
              }
            } catch (error) {
              console.error(`Error fetching similar Pokémon ${pokemon.name}:`, error)
              return null
            }
          }),
        ).then((results) => results.filter(Boolean) as { id: number; name: string; image: string; types: string[] }[])
      }
    } catch (error) {
      console.error(`Error fetching similar Pokémon for ${detail.name}:`, error)
    }

    // Transform the data into our Pokemon type
    return {
      id: detail.id,
      name: detail.name,
      image: detail.sprites.other["official-artwork"].front_default || detail.sprites.front_default,
      types: detail.types.map((type: { type: { name: string } }) => type.type.name),
      height: detail.height,
      weight: detail.weight,
      stats: detail.stats.map((stat: { stat: { name: string }; base_stat: number }) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
      abilities,
      evolutionChain,
      similarPokemon,
    }
  } catch (error) {
    console.error(`Error fetching Pokémon with ID ${id}:`, error)
    throw error
  }
}

// Helper function to process evolution chain
async function processEvolutionChain(chain: {
  species: { url: string }
  evolves_to: {
    species: { url: string }
    evolves_to: Array<{
      species: { url: string }
      evolves_to: []
    }>
  }[]
}): Promise<{ id: number; name: string; image: string }[]> {
  const evolutionData: { id: number; name: string; image: string }[] = []

  // Process current Pokémon in the chain
  const pokemonId = Number.parseInt(chain.species.url.split("/").filter(Boolean).pop() || "0")

  // Only include Pokémon from the first 150
  if (pokemonId <= 150) {
    try {
      const response = await fetch(`${API_BASE_URL}/pokemon/${pokemonId}`)

      if (response.ok) {
        const pokemonData = await response.json()

        evolutionData.push({
          id: pokemonData.id,
          name: pokemonData.name,
          image: pokemonData.sprites.other["official-artwork"].front_default || pokemonData.sprites.front_default,
        })
      }
    } catch (error) {
      console.error(`Error fetching evolution data for Pokémon ${pokemonId}:`, error)
    }
  }

  // Process next evolution in the chain
  if (chain.evolves_to && chain.evolves_to.length > 0) {
    for (const evolution of chain.evolves_to) {
      const nextEvolutions = await processEvolutionChain(evolution)
      evolutionData.push(...nextEvolutions)
    }
  }

  return evolutionData
}
