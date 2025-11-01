"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { getLodgeById, getLandlordById, type Lodge, type Landlord } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  Zap,
  Droplet,
  Wifi,
  Shield,
  Car,
  Dumbbell,
  WashingMachine,
  BookOpen,
} from "lucide-react"

const amenityIcons: Record<string, React.ReactNode> = {
  Electricity: <Zap className="w-5 h-5" />,
  Water: <Droplet className="w-5 h-5" />,
  "Wi-Fi": <Wifi className="w-5 h-5" />,
  Security: <Shield className="w-5 h-5" />,
  Parking: <Car className="w-5 h-5" />,
  Gym: <Dumbbell className="w-5 h-5" />,
  Laundry: <WashingMachine className="w-5 h-5" />,
  "Study Room": <BookOpen className="w-5 h-5" />,
}

export default function LodgeDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { userType } = useUser()
  const [lodge, setLodge] = useState<Lodge | null>(null)
  const [landlord, setLandlord] = useState<Landlord | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (userType !== "student") {
      router.push("/")
      return
    }

    const lodgeId = Number(params.id)
    const foundLodge = getLodgeById(lodgeId)
    if (foundLodge) {
      setLodge(foundLodge)
      const foundLandlord = getLandlordById(foundLodge.ownerId)
      setLandlord(foundLandlord || null)
    }
  }, [userType, params.id, router])

  if (userType !== "student" || !lodge) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Lodge Details</h1>
          </div>
          <Button onClick={() => router.push(`/student/payment/${lodge.id}`)}>Pay Now</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Image Gallery */}
        <Card className="overflow-hidden mb-6">
          <div className="relative h-96">
            <img
              src={lodge.images[currentImageIndex] || "/placeholder.svg"}
              alt={lodge.name}
              className="w-full h-full object-cover"
            />
            {lodge.verified && (
              <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Verified
              </Badge>
            )}
            {lodge.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {lodge.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? "bg-white w-8" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Lodge Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-3xl font-bold mb-4 text-balance">{lodge.name}</h2>

            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="w-5 h-5" />
              <span>{lodge.location}</span>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl font-bold">₦{lodge.price.toLocaleString()}</span>
              <span className="text-muted-foreground">/month</span>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">{lodge.description}</p>

            <div>
              <h3 className="font-semibold text-lg mb-3">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {lodge.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {amenityIcons[amenity]}
                    </div>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3D Tour Placeholder */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3">Virtual Tour</h3>
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
              <p className="text-muted-foreground">3D Virtual Tour Coming Soon</p>
            </div>
          </CardContent>
        </Card>

        {/* Landlord Contact */}
        {landlord && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Contact Landlord</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{landlord.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{landlord.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
