"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { mockLodges, mockStudents, type Lodge } from "@/lib/data"
import { SwipeCard } from "@/components/swipe-card"
import { Button } from "@/components/ui/button"
import { Heart, X, Home, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function StudentPage() {
  const router = useRouter()
  const { userType, userId, logout } = useUser()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matches, setMatches] = useState<number[]>([])
  const [swipedLeft, setSwipedLeft] = useState<number[]>([])
  const [availableLodges, setAvailableLodges] = useState<Lodge[]>([])

  useEffect(() => {
    if (userType !== "student") {
      router.push("/")
      return
    }

    const student = mockStudents.find((s) => s.id === userId)
    if (student) {
      setMatches(student.matches)
      setSwipedLeft(student.swipedLeft)

      // Filter out already matched or swiped left lodges
      const available = mockLodges.filter(
        (lodge) => !student.matches.includes(lodge.id) && !student.swipedLeft.includes(lodge.id),
      )
      setAvailableLodges(available)
    }
  }, [userType, userId, router])

  const handleSwipe = (direction: "left" | "right") => {
    const currentLodge = availableLodges[currentIndex]
    if (!currentLodge) return

    if (direction === "right") {
      setMatches([...matches, currentLodge.id])
      const student = mockStudents.find((s) => s.id === userId)
      if (student) {
        student.matches.push(currentLodge.id)
      }
    } else {
      setSwipedLeft([...swipedLeft, currentLodge.id])
      const student = mockStudents.find((s) => s.id === userId)
      if (student) {
        student.swipedLeft.push(currentLodge.id)
      }
    }

    setCurrentIndex(currentIndex + 1)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (userType !== "student") {
    return null
  }

  const currentLodge = availableLodges[currentIndex]
  const hasMoreLodges = currentIndex < availableLodges.length

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            arbitat
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => router.push("/student/matches")}>
              <Home className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {hasMoreLodges ? (
          <>
            <div className="flex-1 container mx-auto px-4 pt-4 pb-2 max-w-xl flex items-center">
              <div className="relative w-full" style={{ height: "calc(100vh - 160px)" }}>
                {availableLodges.slice(currentIndex, currentIndex + 3).map((lodge, index) => (
                  <SwipeCard
                    key={lodge.id}
                    lodge={lodge}
                    onSwipe={index === 0 ? handleSwipe : () => {}}
                    style={{
                      zIndex: 3 - index,
                      scale: 1 - index * 0.03,
                      top: `${index * 6}px`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="container mx-auto px-4 pb-6 max-w-xl">
              <div className="flex items-center justify-center gap-6 mb-2">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-16 h-16 rounded-full border-2 hover:border-destructive hover:bg-destructive/10 bg-card transition-all duration-200 hover:scale-105"
                  onClick={() => handleSwipe("left")}
                >
                  <X className="w-7 h-7 text-destructive" />
                </Button>
                <Button
                  size="lg"
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                  onClick={() => handleSwipe("right")}
                >
                  <Heart className="w-7 h-7 fill-current" />
                </Button>
              </div>
              <p className="text-center text-sm font-medium text-muted-foreground">
                {availableLodges.length - currentIndex} lodges remaining
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center px-4 py-20">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Home className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-balance">No More Lodges</h2>
              <p className="text-muted-foreground text-base mb-6 text-balance max-w-md mx-auto">
                You've seen all available lodges. Check your matches to review properties you liked!
              </p>
              <Button onClick={() => router.push("/student/matches")} size="lg">
                View My Cribs
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
