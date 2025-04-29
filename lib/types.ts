export interface Pokemon {
    id: number
    name: string
    image: string
    types: string[]
    height: number
    weight: number
    stats: {
      name: string
      value: number
    }[]
    abilities?: {
      name: string
      isHidden: boolean
      description: string | null
    }[]
    evolutionChain?: {
      id: number
      name: string
      image: string
    }[]
    similarPokemon?: {
      id: number
      name: string
      image: string
      types: string[]
    }[]
}
  
export interface PokemonListItem {
    name: string
    url: string
}
  
export interface PokemonDetail {
    id: number
    name: string
    sprites: {
      front_default: string
      other: {
        "official-artwork": {
          front_default: string
        }
      }
    }
    types: {
      type: {
        name: string
      }
    }[]
    height: number
    weight: number
    stats: {
      stat: {
        name: string
      }
      base_stat: number
    }[]
}
  