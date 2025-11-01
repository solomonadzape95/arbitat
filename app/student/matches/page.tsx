"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { mockStudents, getLodgesByIds, type Lodge } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, CheckCircle2, Eye, Scale } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function MatchesPage() {
  const router = useRouter()
  const { userType, userId } = useUser()
  const [matches, setMatches] = useState<Lodge[]>([])
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([])

  useEffect(() => {
    if (userType !== "student") {
      router.push("/")
      return
    }

    const student = mockStudents.find((s) => s.id === userId)
    if (student) {
      const matchedLodges = getLodgesByIds(student.matches)
      setMatches(matchedLodges)
    }
  }, [userType, userId, router])

  const toggleCompareSelection = (lodgeId: number) => {
    if (selectedForCompare.includes(lodgeId)) {
      setSelectedForCompare(selectedForCompare.filter((id) => id !== lodgeId))
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare([...selectedForCompare, lodgeId])
    }
  }

  const handleCompare = () => {
    if (selectedForCompare.length >= 2) {
      router.push(`/student/compare?ids=${selectedForCompare.join(",")}`)
    }
  }

  if (userType !== "student") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/student")}>
              <ArrowLeft className="w-8 h-8" />
            </Button>
            <h1 className="text-2xl font-bold">Cribs</h1>
          </div>
          {selectedForCompare.length >= 2 && (
            <Button onClick={handleCompare} className="gap-2">
              <Scale className="w-8 h-8" />
              Compare ({selectedForCompare.length})
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {matches.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Eye className="w-32 h-32 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-balance">No Matches Yet</h2>
            <p className="text-muted-foreground mb-8 text-balance">Start swiping to find lodges you like!</p>
            <Button onClick={() => router.push("/student")} size="lg">
              Start Swiping
            </Button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">Select up to 3 lodges to compare side by side</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((lodge) => (
                <Card key={lodge.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={lodge.images[0] || "/placeholder.svg"}
                      alt={lodge.name}
                      className="w-full h-48 object-cover"
                    />
                    {lodge.verified && (
                      <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                        <CheckCircle2 className="w-6 h-6 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <div className="absolute top-3 left-3">
                      <Checkbox
                        checked={selectedForCompare.includes(lodge.id)}
                        onCheckedChange={() => toggleCompareSelection(lodge.id)}
                        disabled={!selectedForCompare.includes(lodge.id) && selectedForCompare.length >= 3}
                        className="bg-white border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold mb-2 text-balance">{lodge.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-8 h-8" />
                      <span>{lodge.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold">₦{lodge.price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{lodge.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => router.push(`/student/lodge/${lodge.id}`)}
                    >
                      <Eye className="w-8 h-8 mr-2" />
                      View Details
                    </Button>
                    <Button className="flex-1" onClick={() => router.push(`/student/payment/${lodge.id}`)}>
                      Pay Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
