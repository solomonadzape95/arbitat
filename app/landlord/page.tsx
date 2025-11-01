"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { getLandlordLodges, getPaymentsByLandlord, mockStudents, type Lodge, type Payment } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, LogOut, Building2, DollarSign, Users, CheckCircle2, Eye } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandlordPage() {
  const router = useRouter()
  const { userType, userId, logout } = useUser()
  const [lodges, setLodges] = useState<Lodge[]>([])
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    if (userType !== "landlord") {
      router.push("/")
      return
    }

    if (userId) {
      const landlordLodges = getLandlordLodges(userId)
      setLodges(landlordLodges)

      const landlordPayments = getPaymentsByLandlord(userId)
      setPayments(landlordPayments)
    }
  }, [userType, userId, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (userType !== "landlord") {
    return null
  }

  const totalEarnings = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + (p.amount - p.serviceFee), 0)

  const totalMatches = mockStudents.reduce((sum, student) => {
    return sum + student.matches.filter((matchId) => lodges.some((lodge) => lodge.id === matchId)).length
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            arbitat
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={() => router.push("/landlord/add-lodge")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Lodge
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Landlord Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Lodges</CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{lodges.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Matches</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalMatches}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₦{totalEarnings.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lodges List */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">My Lodges</h3>
          {lodges.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-2">No Lodges Yet</h4>
                <p className="text-muted-foreground mb-6">Add your first lodge to start receiving bookings</p>
                <Button onClick={() => router.push("/landlord/add-lodge")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Lodge
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lodges.map((lodge) => {
                const lodgeMatches = mockStudents.reduce(
                  (sum, student) => sum + (student.matches.includes(lodge.id) ? 1 : 0),
                  0,
                )
                const lodgePayments = payments.filter((p) => p.lodgeId === lodge.id && p.status === "completed")

                return (
                  <Card key={lodge.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={lodge.images[0] || "/placeholder.svg"}
                        alt={lodge.name}
                        className="w-full h-48 object-cover"
                      />
                      {lodge.verified && (
                        <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h4 className="text-xl font-bold mb-2 text-balance">{lodge.name}</h4>
                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <span className="text-xl font-bold">₦{lodge.price.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground">/month</span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Matches:</span>
                          <span className="font-semibold">{lodgeMatches}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bookings:</span>
                          <span className="font-semibold">{lodgePayments.length}</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mt-4 bg-transparent"
                        onClick={() => router.push(`/landlord/lodge/${lodge.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Recent Payments</h3>
          <Card>
            <CardContent className="p-6">
              {payments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No payments received yet</div>
              ) : (
                <div className="space-y-4">
                  {payments.slice(0, 5).map((payment) => {
                    const lodge = lodges.find((l) => l.id === payment.lodgeId)
                    const student = mockStudents.find((s) => s.id === payment.studentId)

                    return (
                      <div key={payment.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div>
                          <p className="font-semibold">{lodge?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student?.name} • {payment.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₦{(payment.amount - payment.serviceFee).toLocaleString()}</p>
                          <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
