"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Building2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  const router = useRouter()
  const { userType, setUser } = useUser()

  useEffect(() => {
    if (userType === "student") {
      router.push("/student")
    } else if (userType === "landlord") {
      router.push("/landlord")
    }
  }, [userType, router])

  const handleStudentLogin = () => {
    setUser("student", 1)
    router.push("/student")
  }

  const handleLandlordLogin = () => {
    setUser("landlord", 1)
    router.push("/landlord")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-balance mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            arbitat
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            Swipe, Match, Move In - Find your perfect campus lodge
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Student</CardTitle>
              <CardDescription className="text-base">
                Browse verified lodges, swipe to match, and secure your perfect accommodation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleStudentLogin} className="w-full" size="lg">
                Use Student Demo
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-2xl">Landlord</CardTitle>
              <CardDescription className="text-base">
                Manage your properties, track bookings, and connect with students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleLandlordLogin}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                size="lg"
              >
                Use Landlord Demo
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Demo accounts are pre-loaded with sample data for testing
        </p>
      </div>
    </div>
  )
}
