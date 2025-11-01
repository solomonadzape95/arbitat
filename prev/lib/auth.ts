export interface User {
  id: string
  name: string
  email: string
  userType: "student" | "landlord"
}

const STORAGE_KEY = "arbitat_user"

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem(STORAGE_KEY)
  if (!userStr) return null
  try {
    return JSON.parse(userStr) as User
  } catch {
    return null
  }
}

export function setUser(user: User | null): void {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}

export function logout(): void {
  setUser(null)
}

