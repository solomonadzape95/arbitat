// Mock data store for arbitat - Campus Housing Finder

export interface Lodge {
  id: number
  name: string
  location: string
  price: number
  verified: boolean
  images: string[]
  amenities: string[]
  ownerId: number
  description: string
  distance?: string
}

export interface Student {
  id: number
  name: string
  email: string
  matches: number[]
  payments: Payment[]
  swipedLeft: number[]
}

export interface Landlord {
  id: number
  name: string
  email: string
  lodges: number[]
  phone: string
}

export interface Payment {
  id: number
  studentId: number
  lodgeId: number
  amount: number
  serviceFee: number
  status: "pending" | "completed" | "failed"
  date: string
}

// Mock data
export const mockLodges: Lodge[] = [
  {
    id: 101,
    name: "Sunny View Lodge",
    location: "Odim Road, 0.5km from UNN Main Gate",
    price: 150000,
    verified: true,
    images: [
      "/modern-student-lodge-exterior-sunny.jpg",
      "/student-room-interior-bed-desk.jpg",
      "/shared-kitchen-student-accommodation.jpg",
    ],
    amenities: ["Electricity", "Water", "Wi-Fi", "Security", "Parking"],
    ownerId: 1,
    description:
      "Modern, well-maintained lodge with 24/7 security and reliable amenities. Perfect for serious students.",
    distance: "0.5km from UNN",
  },
  {
    id: 102,
    name: "Oakwood Hostel",
    location: "Enugu-Onitsha Road, 1.2km from UNN",
    price: 120000,
    verified: false,
    images: ["/affordable-student-hostel-building.jpg", "/basic-student-room-bed.jpg"],
    amenities: ["Water", "Electricity"],
    ownerId: 1,
    description: "Affordable accommodation close to campus. Basic amenities provided.",
    distance: "1.2km from UNN",
  },
  {
    id: 103,
    name: "Green Valley Residence",
    location: "University Road, 0.8km from UNN Library",
    price: 180000,
    verified: true,
    images: [
      "/luxury-student-residence-green-surroundings.jpg",
      "/modern-student-apartment.png",
      "/student-lounge-common-area.jpg",
    ],
    amenities: ["Electricity", "Water", "Wi-Fi", "Security", "Gym", "Laundry"],
    ownerId: 2,
    description: "Premium student residence with gym and study lounges. All-inclusive amenities.",
    distance: "0.8km from UNN",
  },
  {
    id: 104,
    name: "Campus Edge Apartments",
    location: "Stadium Road, 0.3km from UNN Sports Complex",
    price: 135000,
    verified: true,
    images: ["/student-apartment-building-modern.jpg", "/furnished-student-room.jpg"],
    amenities: ["Electricity", "Water", "Wi-Fi", "Security"],
    ownerId: 2,
    description: "Conveniently located near sports facilities. Quiet and secure environment.",
    distance: "0.3km from UNN",
  },
  {
    id: 105,
    name: "Scholar's Haven",
    location: "Nsukka Town, 0.6km from UNN Main Campus",
    price: 165000,
    verified: true,
    images: [
      "/quiet-student-lodge-study-environment.jpg",
      "/student-study-room-desk-bookshelf.jpg",
      "/student-common-study-area.jpg",
    ],
    amenities: ["Electricity", "Water", "Wi-Fi", "Security", "Study Room"],
    ownerId: 1,
    description: "Designed for focused students. Quiet hours enforced, dedicated study spaces.",
    distance: "0.6km from UNN",
  },
]

export const mockStudents: Student[] = [
  {
    id: 1,
    name: "Demo Student",
    email: "student@demo.com",
    matches: [],
    payments: [],
    swipedLeft: [],
  },
]

export const mockLandlords: Landlord[] = [
  {
    id: 1,
    name: "Demo Landlord",
    email: "landlord@demo.com",
    lodges: [101, 102, 105],
    phone: "+234 800 123 4567",
  },
  {
    id: 2,
    name: "Property Manager",
    email: "manager@demo.com",
    lodges: [103, 104],
    phone: "+234 800 765 4321",
  },
]

export const mockPayments: Payment[] = []

// Helper functions for data management
export function getLodgeById(id: number): Lodge | undefined {
  return mockLodges.find((lodge) => lodge.id === id)
}

export function getLodgesByIds(ids: number[]): Lodge[] {
  return mockLodges.filter((lodge) => ids.includes(lodge.id))
}

export function getStudentById(id: number): Student | undefined {
  return mockStudents.find((student) => student.id === id)
}

export function getLandlordById(id: number): Landlord | undefined {
  return mockLandlords.find((landlord) => landlord.id === id)
}

export function getLandlordLodges(landlordId: number): Lodge[] {
  const landlord = getLandlordById(landlordId)
  if (!landlord) return []
  return getLodgesByIds(landlord.lodges)
}

export function getPaymentsByLandlord(landlordId: number): Payment[] {
  const landlord = getLandlordById(landlordId)
  if (!landlord) return []
  return mockPayments.filter((payment) => landlord.lodges.includes(payment.lodgeId))
}
