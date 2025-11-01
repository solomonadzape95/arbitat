"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type UserType = "student" | "landlord" | null

interface UserContextType {
  userType: UserType
  userId: number | null
  setUser: (type: UserType, id: number) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null)
  const [userId, setUserId] = useState<number | null>(null)

  const setUser = (type: UserType, id: number) => {
    setUserType(type)
    setUserId(id)
  }

  const logout = () => {
    setUserType(null)
    setUserId(null)
  }

  return <UserContext.Provider value={{ userType, userId, setUser, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
