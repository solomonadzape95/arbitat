const STORAGE_KEY = "arbitat_favorites"

export function getFavorites(): number[] {
  if (typeof window === "undefined") return []
  const favoritesStr = localStorage.getItem(STORAGE_KEY)
  if (!favoritesStr) return []
  try {
    return JSON.parse(favoritesStr) as number[]
  } catch {
    return []
  }
}

export function addFavorite(listingId: number): void {
  if (typeof window === "undefined") return
  const favorites = getFavorites()
  if (!favorites.includes(listingId)) {
    favorites.push(listingId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }
}

export function removeFavorite(listingId: number): void {
  if (typeof window === "undefined") return
  const favorites = getFavorites().filter((id) => id !== listingId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
}

export function isFavorite(listingId: number): boolean {
  return getFavorites().includes(listingId)
}

export function toggleFavorite(listingId: number): boolean {
  const favorites = getFavorites()
  if (favorites.includes(listingId)) {
    removeFavorite(listingId)
    return false
  } else {
    addFavorite(listingId)
    return true
  }
}

