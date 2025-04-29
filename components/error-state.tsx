"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  message: string
}

export function ErrorState({ message }: ErrorStateProps) {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h3 className="text-2xl font-bold mb-2">Something went wrong</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {message || "We encountered an error while loading the Pokémon data. Please try again."}
      </p>
      <Button onClick={handleRefresh}>Refresh Page</Button>
    </div>
  )
}
