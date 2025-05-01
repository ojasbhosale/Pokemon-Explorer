"use client"

import { Button } from "@/components/ui/button"
import { Dices } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface RandomCompareButtonProps {
  onRandomize: () => void
  className?: string
}

export function RandomCompareButton({ onRandomize, className }: RandomCompareButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            onClick={onRandomize} 
            className={className}
            size="sm"
          >
            <Dices className="h-4 w-4 mr-2" />
            Random Comparison
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Compare two random Pokémon</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}