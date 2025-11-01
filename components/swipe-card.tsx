"use client"

import type React from "react"

import { useState } from "react"
import type { Lodge } from "@/lib/data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, CheckCircle2, Zap, Droplet, Wifi, Shield, Car, Dumbbell, WashingMachine, BookOpen } from "lucide-react"

interface SwipeCardProps {
  lodge: Lodge
  onSwipe: (direction: "left" | "right") => void
  style?: React.CSSProperties
}

const amenityIcons: Record<string, React.ReactNode> = {
  Electricity: <Zap className="w-3.5 h-3.5" />,
  Water: <Droplet className="w-3.5 h-3.5" />,
  "Wi-Fi": <Wifi className="w-3.5 h-3.5" />,
  Security: <Shield className="w-3.5 h-3.5" />,
  Parking: <Car className="w-3.5 h-3.5" />,
  Gym: <Dumbbell className="w-3.5 h-3.5" />,
  Laundry: <WashingMachine className="w-3.5 h-3.5" />,
  "Study Room": <BookOpen className="w-3.5 h-3.5" />,
}

export function SwipeCard({ lodge, onSwipe, style }: SwipeCardProps) {
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (clientX: number, clientY: number) => {
    setDragStart({ x: clientX, y: clientY })
    setIsDragging(true)
  }

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!dragStart) return

    const deltaX = clientX - dragStart.x
    const deltaY = clientY - dragStart.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleDragEnd = () => {
    if (!dragStart) return

    const threshold = 100
    if (Math.abs(dragOffset.x) > threshold) {
      onSwipe(dragOffset.x > 0 ? "right" : "left")
    }

    setDragStart(null)
    setDragOffset({ x: 0, y: 0 })
    setIsDragging(false)
  }

  const rotation = dragOffset.x * 0.05
  const opacity = 1 - Math.abs(dragOffset.x) / 500

  return (
    <Card
      className="absolute w-full h-full cursor-grab active:cursor-grabbing select-none rounded-2xl overflow-hidden"
      style={{
        ...style,
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity,
        transition: isDragging ? "none" : "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow: "var(--shadow-2xl)",
      }}
      onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
      onMouseMove={(e) => isDragging && handleDragMove(e.clientX, e.clientY)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => isDragging && handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleDragEnd}
    >
      <img
        src={lodge.images[0] || "/placeholder.svg"}
        alt={lodge.name}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

      {lodge.verified && (
        <Badge className="absolute top-5 right-5 bg-primary text-primary-foreground shadow-lg text-xs px-2.5 py-1 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
          Verified
        </Badge>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h2 className="text-3xl font-bold mb-2 text-balance leading-tight tracking-tight">{lodge.name}</h2>

        <div className="flex items-center gap-1.5 mb-3 text-white/90">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">{lodge.location}</span>
        </div>

        <div className="flex items-baseline gap-1.5 mb-4">
          <span className="text-2xl font-bold">₦{lodge.price.toLocaleString()}</span>
          <span className="text-sm text-white/70 font-medium">/month</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {lodge.amenities.slice(0, 5).map((amenity) => (
            <Badge
              key={amenity}
              variant="secondary"
              className="bg-white/20 backdrop-blur-md text-white border-0 px-2 py-0.5 text-xs font-medium"
            >
              {amenityIcons[amenity]}
              <span className="ml-1">{amenity}</span>
            </Badge>
          ))}
          {lodge.amenities.length > 5 && (
            <Badge
              variant="secondary"
              className="bg-white/20 backdrop-blur-md text-white border-0 px-2 py-0.5 text-xs font-medium"
            >
              +{lodge.amenities.length - 5}
            </Badge>
          )}
        </div>
      </div>

      {dragOffset.x > 50 && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-6xl font-black text-primary rotate-12 drop-shadow-2xl animate-pulse">LIKE</div>
        </div>
      )}
      {dragOffset.x < -50 && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-6xl font-black text-destructive -rotate-12 drop-shadow-2xl animate-pulse">SKIP</div>
        </div>
      )}
    </Card>
  )
}
