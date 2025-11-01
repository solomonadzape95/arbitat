export interface BookingRequest {
  id: string
  listingId: number
  userId: string
  moveInDate: string
  leaseDuration: string
  status: "pending" | "approved" | "rejected" | "cancelled"
  createdAt: string
}

const STORAGE_KEY = "arbitat_bookings"

export function getBookings(): BookingRequest[] {
  if (typeof window === "undefined") return []
  const bookingsStr = localStorage.getItem(STORAGE_KEY)
  if (!bookingsStr) return []
  try {
    return JSON.parse(bookingsStr) as BookingRequest[]
  } catch {
    return []
  }
}

export function createBooking(booking: Omit<BookingRequest, "id" | "status" | "createdAt">): BookingRequest {
  if (typeof window === "undefined") {
    throw new Error("Cannot create booking on server")
  }
  const bookings = getBookings()
  const newBooking: BookingRequest = {
    ...booking,
    id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  }
  bookings.push(newBooking)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  return newBooking
}

export function getBookingsByUser(userId: string): BookingRequest[] {
  return getBookings().filter((booking) => booking.userId === userId)
}

