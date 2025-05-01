"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useFavorites } from "./favorites-provider"

export function FavoritesManagement() {
  const { favorites, clearFavorites } = useFavorites()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  if (favorites.length === 0) return null

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button 
          variant="outline" 
          className="gap-2 text-red-500" 
          onClick={() => setIsConfirmOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Clear All Favorites
        </Button>
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all favorites?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove all {favorites.length} Pokémon from your favorites list. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                clearFavorites()
                setIsConfirmOpen(false)
              }}
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}