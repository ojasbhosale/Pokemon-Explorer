"use client"

import { useRouter } from "next/navigation"
import { Dices } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip"

interface RandomPokemonButtonProps {
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function RandomPokemonButton({ className, variant = "ghost" }: RandomPokemonButtonProps) {
  const router = useRouter()

  const handleRandomPokemon = () => {
    // Generate random number between 1 and 150
    const randomId = Math.floor(Math.random() * 150) + 1
    router.push(`/pokemon/${randomId}`)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={variant} 
            size="icon" 
            className={className} 
            onClick={handleRandomPokemon}
          >
            <Dices className="h-5 w-5" />
            <span className="sr-only">Random Pokémon</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Find a random Pokémon</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}