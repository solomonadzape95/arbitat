"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { getLodgeById, mockStudents, mockPayments, type Lodge } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, DollarSign, CheckCircle2, Users, TrendingUp } from "lucide-react"

export default function LandlordLodgeDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { userType } = useUser()
  const [lodge, setLodge] = useState<Lodge | null>(null)

  useEffect(() => {
    if (userType !== "landlord") {
      router.push("/")
      return
    }

    const lodgeId = Number(params.id)
    const foundLodge = getLodgeById(lodgeId)
    if (foundLodge) {
      setLodge(foundLodge)
    }
  }, [userType, params.id, router])

  if (userType !== "landlord" || !lodge) {
    return null
  }

  const matchedStudents = mockStudents.filter((student) => student.matches.includes(lodge.id))

  const lodgePayments = mockPayments.filter((p) => p.lodgeId === lodge.id && p.status === "completed")

  const totalRevenue = lodgePayments.reduce((sum, p) => sum + (p.amount - p.serviceFee), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/landlord")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Lodge Details</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Lodge Info */}
        <Card className="mb-6 overflow-hidden">
          <div className="relative h-64">
            <img src={lodge.images[0] || "/placeholder.svg"} alt={lodge.name} className="w-full h-full object-cover" />
            {lodge.verified && (
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <CardContent className="p-6">
            <h2 className="text-3xl font-bold mb-4 text-balance">{lodge.name}</h2>

            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="w-5 h-5" />
              <span>{lodge.location}</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6 text-primary" />
              <span className="text-3xl font-bold">₦{lodge.price.toLocaleString()}</span>
              <span className="text-muted-foreground">/month</span>
            </div>

            <p className="text-muted-foreground leading-relaxed">{lodge.description}</p>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Matches</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{matchedStudents.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bookings</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{lodgePayments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₦{totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Matched Students */}
        <Card>
          <CardHeader>
            <CardTitle>Interested Students</CardTitle>
          </CardHeader>
          <CardContent>
            {matchedStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No students have matched with this lodge yet</div>
            ) : (
              <div className="space-y-3">
                {matchedStudents.map((student) => {
                  const hasBooked = student.payments.some((p) => p.lodgeId === lodge.id && p.status === "completed")

                  return (
                    <div key={student.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                      {hasBooked && <Badge className="bg-accent text-accent-foreground">Booked</Badge>}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
