"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { getLodgesByIds, type Lodge } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle2, X, Check, MapPin } from "lucide-react"

export default function ComparePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userType } = useUser()
  const [lodges, setLodges] = useState<Lodge[]>([])

  useEffect(() => {
    if (userType !== "student") {
      router.push("/")
      return
    }

    const ids = searchParams.get("ids")?.split(",").map(Number) || []
    const selectedLodges = getLodgesByIds(ids)
    setLodges(selectedLodges)
  }, [userType, searchParams, router])

  if (userType !== "student" || lodges.length === 0) {
    return null
  }

  const allAmenities = Array.from(new Set(lodges.flatMap((lodge) => lodge.amenities)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/student/matches")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl md:text-2xl font-bold">Compare Lodges</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        {/* Mobile View - Stacked Cards */}
        <div className="md:hidden space-y-6">
          {lodges.map((lodge) => (
            <Card key={lodge.id} className="overflow-hidden">
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
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2 text-balance">{lodge.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{lodge.location}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">Price/Month</span>
                    <span className="text-lg font-bold">₦{lodge.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">Distance</span>
                    <span className="text-sm">{lodge.distance || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium">Verified</span>
                    {lodge.verified ? (
                      <Check className="w-5 h-5 text-accent" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {lodge.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button variant="outline" onClick={() => router.push(`/student/lodge/${lodge.id}`)}>
                    View Details
                  </Button>
                  <Button onClick={() => router.push(`/student/payment/${lodge.id}`)}>Pay Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop View - Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-max">
            <div className="grid gap-6" style={{ gridTemplateColumns: `200px repeat(${lodges.length}, 300px)` }}>
              {/* Images Row */}
              <div className="font-semibold text-lg flex items-end pb-4">Property</div>
              {lodges.map((lodge) => (
                <Card key={lodge.id} className="overflow-hidden">
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
                    <h3 className="font-bold text-lg mb-2 text-balance">{lodge.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{lodge.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Price Row */}
              <div className="font-semibold flex items-center">Price/Month</div>
              {lodges.map((lodge) => (
                <Card key={`price-${lodge.id}`}>
                  <CardContent className="p-4">
                    <span className="text-2xl font-bold">₦{lodge.price.toLocaleString()}</span>
                  </CardContent>
                </Card>
              ))}

              {/* Distance Row */}
              <div className="font-semibold flex items-center">Distance</div>
              {lodges.map((lodge) => (
                <Card key={`distance-${lodge.id}`}>
                  <CardContent className="p-4">
                    <span className="text-lg">{lodge.distance || "N/A"}</span>
                  </CardContent>
                </Card>
              ))}

              {/* Verification Row */}
              <div className="font-semibold flex items-center">Verified</div>
              {lodges.map((lodge) => (
                <Card key={`verified-${lodge.id}`}>
                  <CardContent className="p-4">
                    {lodge.verified ? (
                      <Check className="w-6 h-6 text-accent" />
                    ) : (
                      <X className="w-6 h-6 text-muted-foreground" />
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Amenities Section */}
              <div className="font-semibold text-lg flex items-center pt-4">Amenities</div>
              <div className="col-span-full" style={{ gridColumn: `2 / span ${lodges.length}` }} />

              {allAmenities.map((amenity) => (
                <>
                  <div key={`label-${amenity}`} className="flex items-center text-sm">
                    {amenity}
                  </div>
                  {lodges.map((lodge) => (
                    <Card key={`${lodge.id}-${amenity}`}>
                      <CardContent className="p-4">
                        {lodge.amenities.includes(amenity) ? (
                          <Check className="w-5 h-5 text-accent" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </>
              ))}

              {/* Action Buttons */}
              <div />
              {lodges.map((lodge) => (
                <div key={`action-${lodge.id}`} className="flex flex-col gap-2">
                  <Button variant="outline" onClick={() => router.push(`/student/lodge/${lodge.id}`)}>
                    View Details
                  </Button>
                  <Button onClick={() => router.push(`/student/payment/${lodge.id}`)}>Pay Now</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
