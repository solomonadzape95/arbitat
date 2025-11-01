"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast, Toaster } from "sonner"
import {
  MapPin,
  BedDouble,
  Star,
  Search,
  Filter,
  Heart,
  Users,
  Wifi,
  Car,
  Coffee,
  Home,
  CheckCircle2,
  Menu,
  X,
  Calendar,
  ShieldCheck,
  Camera,
  Mail,
  Lock,
  User as UserIcon,
  Briefcase,
  GraduationCap,
  LogOut,
  BookOpen,
  Image as ImageIcon,
  Settings,
  Building2,
  Package,
} from "lucide-react"
import { mockListings, cities, universities, type Listing } from "@/lib/mock-data"
import { getUser, setUser, logout as logoutUser, type User } from "@/lib/auth"
import { getFavorites, toggleFavorite, isFavorite } from "@/lib/favorites"
import { createBooking, getBookingsByUser } from "@/lib/bookings"
import { DEMO_ACCOUNTS, loginDemoAccount } from "@/lib/demo-accounts"

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  userType: z.enum(["student", "landlord"]),
})

const bookingSchema = z.object({
  moveInDate: z.string().min(1, "Please select a move-in date"),
  leaseDuration: z.string().min(1, "Please select lease duration"),
})

function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
  onLoginSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp: () => void
  onLoginSuccess?: () => void
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  })

  const handleDemoLogin = (type: "student" | "landlord") => {
    loginDemoAccount(type)
    toast.success(`Logged in as ${DEMO_ACCOUNTS[type].name}!`)
    onClose()
    onLoginSuccess?.()
  }

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    // Mock login - in production, this would call an API
    const user: User = {
      id: `user_${Date.now()}`,
      name: data.email.split("@")[0],
      email: data.email,
      userType: "student",
    }
    setUser(user)
    toast.success("Login successful! Welcome back!")
    onClose()
    onLoginSuccess?.()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in slide-in-from-top-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600">Login to your ARBITAT account</p>
        </div>

        {/* Demo Account Info */}
        <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <p className="text-sm font-semibold text-blue-900 mb-2">Demo Accounts for Testing:</p>
          <div className="space-y-2 text-xs text-blue-800">
            <p>
              <strong>Student:</strong> {DEMO_ACCOUNTS.student.email} / {DEMO_ACCOUNTS.student.password}
            </p>
            <p>
              <strong>Landlord:</strong> {DEMO_ACCOUNTS.landlord.email} / {DEMO_ACCOUNTS.landlord.password}
            </p>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => handleDemoLogin("student")}
              className="flex-1 py-2 px-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login as Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("landlord")}
              className="flex-1 py-2 px-3 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Login as Landlord
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                {...register("email")}
                placeholder="your.email@example.com"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              />
            </div>
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                {...register("password")}
                placeholder="Enter your password"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              />
            </div>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button type="button" className="text-sm text-green-600 hover:text-green-700 font-medium">
            Forgot password?
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => {
                onClose()
                onSwitchToSignUp()
              }}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

function SignUpModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSignUpSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
  onSignUpSuccess?: () => void
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userType: "student",
    },
  })

  const userType = watch("userType")

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    // Mock sign up - in production, this would call an API
    const user: User = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      userType: data.userType,
    }
    setUser(user)
    toast.success("Account created successfully! Welcome to ARBITAT!")
    onClose()
    onSignUpSuccess?.()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in slide-in-from-top-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join ARBITAT</h2>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue("userType", "student")}
                className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all flex items-center justify-center gap-2 ${
                  userType === "student"
                    ? "border-green-500 bg-green-50 text-green-600"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setValue("userType", "landlord")}
                className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all flex items-center justify-center gap-2 ${
                  userType === "landlord"
                    ? "border-green-500 bg-green-50 text-green-600"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                <Briefcase className="w-5 h-5" />
                Landlord
              </button>
            </div>
            <input type="hidden" {...register("userType")} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                {...register("name")}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              />
            </div>
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                {...register("email")}
                placeholder="your.email@example.com"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              />
            </div>
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                {...register("password")}
                placeholder="Create a strong password"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              />
            </div>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            <p className="text-xs text-gray-600 mt-1">Must be at least 8 characters</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => {
                onClose()
                onSwitchToLogin()
              }}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

// SearchModal component for location, move-in date, and roommates
function SearchModal({
  isOpen,
  onClose,
  onSearch,
}: {
  isOpen: boolean
  onClose: () => void
  onSearch: (filters: { location: string; moveInDate: string; roommates: number }) => void
}) {
  const [location, setLocation] = useState("")
  const [moveInDate, setMoveInDate] = useState("")
  const [roommates, setRoommates] = useState(1)

  const handleSearch = () => {
    onSearch({ location, moveInDate, roommates })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 animate-in fade-in slide-in-from-top-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Find your perfect student home</h2>

        <div className="space-y-6">
          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Where do you want to live?</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              >
                <option value="">Select city or university</option>
                <optgroup label="Cities">
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Universities">
                  {universities.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Move-in Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">When do you want to move in?</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          {/* Roommates */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              How many roommates are you looking for?
            </label>
            <div className="grid grid-cols-5 gap-3">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setRoommates(num)}
                  className={`py-4 rounded-xl border-2 font-semibold transition-all ${
                    roommates === num
                      ? "border-green-500 bg-green-50 text-green-600"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {num === 0 ? "None" : num}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {roommates === 0
                ? "Looking for a private place"
                : `Looking to share with ${roommates} roommate${roommates > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => {
              setLocation("")
              setMoveInDate("")
              setRoommates(1)
            }}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Clear all
          </button>
          <button
            onClick={handleSearch}
            className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl"
          >
            Search properties
          </button>
        </div>
      </div>
    </div>
  )
}

function NavBar({
  onNavigate,
  currentPage,
  onOpenSearch,
  onOpenLogin,
  onOpenSignUp,
  onLogout,
}: {
  onNavigate: (page: string) => void
  currentPage: string
  onOpenSearch: () => void
  onOpenLogin: () => void
  onOpenSignUp: () => void
  onLogout?: () => void
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(getUser())
    const handleStorageChange = () => setUser(getUser())
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="text-xl sm:text-2xl font-bold text-green-600 hover:text-green-700 transition-colors flex-shrink-0"
          >
            ARBITAT
          </button>

          {/* Tablet/Desktop Search Bar - Hidden on small screens, visible on md+ */}
          {(!user || user.userType === "student") && (
            <button
              onClick={onOpenSearch}
              className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 xl:px-6 py-2 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all bg-white hover:border-green-400 flex-1 max-w-xl mx-4"
            >
              <div className="px-2 xl:px-4 border-r border-gray-300 flex-shrink-0">
                <p className="text-xs xl:text-sm font-medium text-gray-700 whitespace-nowrap">Search by university...</p>
              </div>
              <div className="px-2 xl:px-4 border-r border-gray-300 flex-shrink-0">
                <p className="text-xs xl:text-sm font-medium text-gray-700 whitespace-nowrap">Add dates</p>
              </div>
              <div className="bg-green-600 text-white p-2 rounded-full ml-auto flex-shrink-0">
                <Search className="w-4 h-4" />
              </div>
            </button>
          )}

          {/* Desktop Navigation - Hidden on md, visible on lg+ */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-6">
            {user?.userType === "landlord" && (
              <button
                onClick={() => onNavigate("list-property")}
                className="text-xs xl:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap px-2 xl:px-0"
              >
                List property
              </button>
            )}
            {user ? (
              <div className="flex items-center gap-2 xl:gap-4">
                {user.userType === "landlord" && (
                  <button
                    onClick={() => onNavigate("my-properties")}
                    className="flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-2 xl:px-0"
                  >
                    <Building2 className="w-3 h-3 xl:w-4 xl:h-4 flex-shrink-0" />
                    <span className="hidden xl:inline">My Properties</span>
                    <span className="xl:hidden">Properties</span>
                  </button>
                )}
                <button
                  onClick={() => onNavigate("profile")}
                  className="flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-2 xl:px-0"
                >
                  <Settings className="w-3 h-3 xl:w-4 xl:h-4 flex-shrink-0" />
                  <span className="hidden xl:inline">Profile</span>
                </button>
                <div className="flex items-center gap-1 xl:gap-2 px-2 xl:px-3 py-1 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 xl:w-8 xl:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-3 h-3 xl:w-5 xl:h-5 text-green-600" />
                  </div>
                  <span className="text-xs xl:text-sm font-semibold text-gray-900 max-w-[80px] xl:max-w-none truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logoutUser()
                    onLogout?.()
                    toast.success("Logged out successfully")
                  }}
                  className="flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-2 xl:px-0"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3 xl:w-4 xl:h-4 flex-shrink-0" />
                  <span className="hidden xl:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={onOpenLogin}
                  className="text-xs xl:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap px-2 xl:px-0"
                >
                  Login
                </button>
                <button
                  onClick={onOpenSignUp}
                  className="px-3 xl:px-4 py-1.5 xl:py-2 bg-green-600 text-white text-xs xl:text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile/Tablet Menu Button - Visible on md and below, hidden on lg+ */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile/Tablet Menu - Visible on screens below lg */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-3">
              {/* Search Button - Always visible for students/unauthenticated */}
              {(!user || user.userType === "student") && (
                <button
                  onClick={() => {
                    onOpenSearch()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-600 font-semibold rounded-xl hover:bg-green-100 transition-colors shadow-sm"
                >
                  <Search className="w-5 h-5" />
                  Search properties
                </button>
              )}

              {/* User Info Section */}
              {user && (
                <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                        user.userType === "landlord"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.userType === "landlord" ? "Landlord" : "Student"}
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1">
                {user?.userType === "landlord" && (
                  <>
                    <button
                      onClick={() => {
                        onNavigate("list-property")
                        setMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Building2 className="w-5 h-5 text-gray-600" />
                      List your property
                    </button>
                    <button
                      onClick={() => {
                        onNavigate("my-properties")
                        setMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Building2 className="w-5 h-5 text-gray-600" />
                      My Properties
                    </button>
                  </>
                )}
                {user && (
                  <button
                    onClick={() => {
                      onNavigate("profile")
                      setMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-600" />
                    Profile
                  </button>
                )}
              </div>

              {/* Auth Buttons */}
              {user ? (
                <button
                  onClick={() => {
                    logoutUser()
                    onLogout?.()
                    setMobileMenuOpen(false)
                    toast.success("Logged out successfully")
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      onOpenLogin()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onOpenSignUp()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full px-4 py-3 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function HomePage({ onNavigate }: { onNavigate: (page: string, listingId?: number) => void }) {
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    setFavorites(getFavorites())
  }, [])
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
              Verified Homes. No Agents. No Stress.
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 text-pretty">
              Find your school-approved student home in Enugu & Nsukka.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by university or campus..."
                  className="w-full px-6 py-5 pr-14 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent shadow-lg"
                  onClick={() => onNavigate("listings")}
                  readOnly
                />
                <button
                  onClick={() => onNavigate("listings")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Verified Homes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockListings.slice(0, 8).map((listing) => (
            <div
              key={listing.id}
              onClick={() => onNavigate("detail", listing.id)}
              className="group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative overflow-hidden">
                <img
                  src={listing.image || "/placeholder.svg"}
                  alt={listing.title}
                  className="w-full aspect-video object-cover transform group-hover:scale-105 transition-transform duration-300 rounded-t-xl"
                />
                {/* Verified Badge */}
                <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const isFav = toggleFavorite(listing.id)
                    setFavorites(getFavorites())
                    toast.success(isFav ? "Added to favorites" : "Removed from favorites")
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors z-10"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      favorites.includes(listing.id) ? "fill-red-500 text-red-500" : "text-gray-700"
                    }`}
                  />
                </button>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900 flex-1">{listing.location}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-gray-900" />
                    <span className="text-sm font-medium text-gray-900">{listing.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{listing.title}</p>
                <p className="text-gray-900">
                  <span className="font-bold">₦{listing.pricePerMonth.toLocaleString()}</span>
                  <span className="text-gray-600"> / month</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose ARBITAT?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Verified Properties</h3>
              <p className="text-gray-600">
                Every listing is school-affiliated and safety inspected. No fake listings, no scams.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Agents, Direct Contact</h3>
              <p className="text-gray-600">
                Connect directly with verified landlords. No middlemen, no extra fees, no wahala.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Edey Show Virtual Tours</h3>
              <p className="text-gray-600">
                Take 3D virtual tours before you visit. See exactly what you're getting from anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Search</h3>
            <p className="text-gray-600">
              Browse verified listings near your university. Filter by price, type, and amenities.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Tour</h3>
            <p className="text-gray-600">Take a 3D virtual tour or schedule a physical visit with the landlord.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Book</h3>
            <p className="text-gray-600">Securely request to book and pay digitally. Move in with confidence.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Chioma Nwosu",
                university: "UNILAG",
                text: "No more agent wahala! I found my flat directly from the landlord. The verification gave me peace of mind.",
                rating: 5,
              },
              {
                name: "Ibrahim Musa",
                university: "UI",
                text: "The 3D tour saved me so much time. I could see everything before visiting. Very impressed!",
                rating: 5,
              },
              {
                name: "Blessing Okoro",
                university: "UNIBEN",
                text: "Finally, a platform I can trust. All verified properties, no fake listings. This is what we needed!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current text-green-600" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.text}</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.university} Student</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function ListingsPage({
  onNavigate,
  searchFilters,
}: {
  onNavigate: (page: string, listingId?: number) => void
  searchFilters?: { location: string; moveInDate: string; roommates: number }
}) {
  const [priceRange, setPriceRange] = useState<string>("all")
  const [propertyType, setPropertyType] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    setFavorites(getFavorites())
  }, [])

  const filteredListings = mockListings.filter((listing) => {
    if (propertyType !== "all" && listing.type !== propertyType) return false

    if (priceRange === "low" && listing.pricePerMonth > 150000) return false
    if (priceRange === "mid" && (listing.pricePerMonth < 150000 || listing.pricePerMonth > 300000)) return false
    if (priceRange === "high" && listing.pricePerMonth < 300000) return false

    if (searchFilters?.location) {
      const locationLower = searchFilters.location.toLowerCase()
      const cityMatch = listing.city.toLowerCase().includes(locationLower)
      const universityMatch = listing.university.toLowerCase().includes(locationLower)
      if (!cityMatch && !universityMatch) return false
    }

    if (searchFilters?.roommates !== undefined) {
      if (searchFilters.roommates === 0) {
        if (listing.type === "Shared") return false
      } else {
        if (listing.type === "Studio" && listing.bedrooms === 1) return false
      }
    }

    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verified Properties</h1>
          <p className="text-gray-600">
            {filteredListings.length} verified propert{filteredListings.length === 1 ? "y" : "ies"} found
            {searchFilters?.location && <span className="ml-2 text-green-600">in {searchFilters.location}</span>}
          </p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors mb-4 md:hidden"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>

          <div
            className={`${showFilters ? "block" : "hidden"} md:flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200`}
          >
            <div className="flex-1 mb-4 md:mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="all">All prices</option>
                <option value="low">Under ₦150,000</option>
                <option value="mid">₦150,000 - ₦300,000</option>
                <option value="high">Over ₦300,000</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="all">All types</option>
                <option value="Studio">Studio / Self-Con</option>
                <option value="Apartment">Apartment</option>
                <option value="Shared">Shared</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              onClick={() => onNavigate("detail", listing.id)}
              className="group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow bg-white"
            >
              <div className="relative overflow-hidden">
                <img
                  src={listing.image || "/placeholder.svg"}
                  alt={listing.title}
                  className="w-full aspect-video object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const isFav = toggleFavorite(listing.id)
                    setFavorites(getFavorites())
                    toast.success(isFav ? "Added to favorites" : "Removed from favorites")
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors z-10"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      favorites.includes(listing.id) ? "fill-red-500 text-red-500" : "text-gray-700"
                    }`}
                  />
                </button>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900 flex-1">{listing.location}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-gray-900" />
                    <span className="text-sm font-medium text-gray-900">{listing.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{listing.title}</p>
                <p className="text-gray-900">
                  <span className="font-bold">₦{listing.pricePerMonth.toLocaleString()}</span>
                  <span className="text-gray-600"> / month</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DetailPage({ listingId, onNavigate }: { listingId: number; onNavigate: (page: string) => void }) {
  const listing = mockListings.find((l) => l.id === listingId)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const user = getUser()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      moveInDate: "",
      leaseDuration: "12 months",
    },
  })

  useEffect(() => {
    setIsFavorite(getFavorites().includes(listingId))
  }, [listingId])

  const handleFavoriteToggle = () => {
    const newState = toggleFavorite(listingId)
    setIsFavorite(newState)
    toast.success(newState ? "Added to favorites" : "Removed from favorites")
  }

  const leaseDuration = watch("leaseDuration")
  const moveInDate = watch("moveInDate")

  const onBookingSubmit = async (data: z.infer<typeof bookingSchema>) => {
    if (!user) {
      toast.error("Please login to book a property")
      return
    }
    try {
      createBooking({
        listingId,
        userId: user.id,
        moveInDate: data.moveInDate,
        leaseDuration: data.leaseDuration,
      })
      toast.success("Booking request submitted successfully! The landlord will contact you soon.")
      setTimeout(() => onNavigate("listings"), 2000)
    } catch (error) {
      toast.error("Failed to submit booking request. Please try again.")
    }
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
          <button
            onClick={() => onNavigate("listings")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to listings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => onNavigate("listings")}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
        >
          <span>←</span> Back to listings
        </button>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative overflow-hidden rounded-xl h-96">
            <img
              src={listing.images[currentImageIndex] || "/placeholder.svg"}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              ARBITAT Verified
            </div>
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-3 right-3 p-3 bg-white/90 rounded-full hover:bg-white transition-colors z-10"
            >
              <Heart className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {listing.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {listing.images.slice(1).map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl h-44">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${listing.title} ${index + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => setCurrentImageIndex(index + 1)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <p className="text-gray-600 flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5" />
                {listing.location} • {listing.university}
              </p>
              <div className="flex items-center gap-6 text-gray-700 pb-6 border-b border-gray-200">
                <span className="flex items-center gap-2">
                  <BedDouble className="w-5 h-5" />
                  {listing.bedrooms} bedroom{listing.bedrooms > 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  {listing.type}
                </span>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current text-gray-900" />
                  <span className="font-semibold">{listing.rating}</span>
                  <span className="text-gray-600">({listing.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Edey Show Virtual Tour */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Edey Show</h3>
                  <p className="text-sm text-gray-600">3D Virtual Tour Available</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                See this property from every angle with our immersive 3D virtual tour. Walk through the space from the
                comfort of your current location.
              </p>
              <button className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <Camera className="w-5 h-5" />
                Take 3D Virtual Tour
              </button>
            </div>

            {/* Hosted by */}
            <div className="pb-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Entire {listing.type.toLowerCase()} hosted by {listing.hostName}
              </h2>
              <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl">
                <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-green-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{listing.hostName}</p>
                  <p className="text-sm text-green-700 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Landlord • No Agents
                  </p>
                </div>
              </div>
            </div>

            {/* ARBITAT Verified */}
            <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-8 h-8 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">ARBITAT Verified</h2>
              </div>
              <p className="text-gray-700 mb-4">
                This property has passed our rigorous verification process to ensure your safety and peace of mind.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>School-Affiliated Property:</strong> Approved by university housing office
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Verified Landlord:</strong> Identity confirmed, no middlemen or agents
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Safety Inspected:</strong> Property meets safety and habitability standards
                  </span>
                </li>
              </ul>
            </div>

            {/* Description */}
            <div className="pb-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this property</h2>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {amenity === "Wifi" && <Wifi className="w-5 h-5 text-gray-700" />}
                    {amenity === "Parking" && <Car className="w-5 h-5 text-gray-700" />}
                    {amenity === "Kitchen" && <Coffee className="w-5 h-5 text-gray-700" />}
                    {amenity === "Shared Kitchen" && <Coffee className="w-5 h-5 text-gray-700" />}
                    {amenity === "Laundry" && <Home className="w-5 h-5 text-gray-700" />}
                    {amenity === "Gym" && <Users className="w-5 h-5 text-gray-700" />}
                    {amenity === "Pool" && <Users className="w-5 h-5 text-gray-700" />}
                    {amenity === "Balcony" && <Home className="w-5 h-5 text-gray-700" />}
                    {amenity === "Generator" && <Home className="w-5 h-5 text-gray-700" />}
                    {amenity === "24/7 Security" && <ShieldCheck className="w-5 h-5 text-gray-700" />}
                    {amenity === "Furnished" && <Home className="w-5 h-5 text-gray-700" />}
                    {amenity === "Private Bathroom" && <Home className="w-5 h-5 text-gray-700" />}
                    {amenity === "Study Room" && <Home className="w-5 h-5 text-gray-700" />}
                    <span className="text-gray-700 font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border-2 border-gray-200 rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <p className="text-3xl font-bold text-gray-900">
                  ₦{listing.pricePerMonth.toLocaleString()}
                  <span className="text-lg font-normal text-gray-600"> / month</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-5 h-5 fill-current text-gray-900" />
                  <span className="font-semibold">{listing.rating}</span>
                  <span className="text-gray-600">({listing.reviewCount} reviews)</span>
                </div>
              </div>

              <form onSubmit={handleSubmit(onBookingSubmit)} className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Move-in date</label>
                  <input
                    type="date"
                    {...register("moveInDate")}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                  {errors.moveInDate && <p className="text-red-600 text-sm mt-1">{errors.moveInDate.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Lease duration</label>
                  <select
                    {...register("leaseDuration")}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  >
                    <option value="6 months">6 months</option>
                    <option value="12 months">12 months</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                  {errors.leaseDuration && <p className="text-red-600 text-sm mt-1">{errors.leaseDuration.message}</p>}
                </div>
              </form>

              {!user ? (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      toast.info("Please login to book this property")
                    }}
                    className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl mb-4 text-lg"
                  >
                    Login to Book
              </button>
                  <p className="text-center text-xs text-gray-500">Sign in to request booking</p>
                </div>
              ) : (
                <button
                  onClick={handleSubmit(onBookingSubmit)}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl mb-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Securely Request to Book"}
                </button>
              )}

              <p className="text-center text-sm text-gray-600 mb-6">
                You won't be charged yet. Secure digital payments protected by ARBITAT.
              </p>

              <div className="pt-6 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>
                    ₦{listing.pricePerMonth.toLocaleString()} x{" "}
                    {leaseDuration === "6 months" ? "6" : leaseDuration === "12 months" ? "12" : "1"} month
                    {leaseDuration !== "Flexible" && leaseDuration !== "6 months" ? "s" : ""}
                  </span>
                  <span>
                    ₦
                    {leaseDuration === "6 months"
                      ? (listing.pricePerMonth * 6).toLocaleString()
                      : leaseDuration === "12 months"
                        ? (listing.pricePerMonth * 12).toLocaleString()
                        : listing.pricePerMonth.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Service fee</span>
                  <span>
                    ₦
                    {Math.round(
                      (leaseDuration === "6 months"
                        ? listing.pricePerMonth * 6
                        : leaseDuration === "12 months"
                          ? listing.pricePerMonth * 12
                          : listing.pricePerMonth) * 0.05
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-lg pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>
                    ₦
                    {(
                      (leaseDuration === "6 months"
                        ? listing.pricePerMonth * 6
                        : leaseDuration === "12 months"
                          ? listing.pricePerMonth * 12
                          : listing.pricePerMonth) +
                      Math.round(
                        (leaseDuration === "6 months"
                          ? listing.pricePerMonth * 6
                          : leaseDuration === "12 months"
                            ? listing.pricePerMonth * 12
                            : listing.pricePerMonth) * 0.05
                      )
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ListPropertyPage({
  onNavigate,
  onListingCreated,
}: {
  onNavigate: (page: string) => void
  onListingCreated?: () => void
}) {
  const user = getUser()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      location: "",
      university: "",
      city: "",
      pricePerMonth: "",
      bedrooms: "1",
      type: "Apartment" as "Apartment" | "Studio" | "Shared",
      description: "",
      amenities: [] as string[],
    },
  })

  useEffect(() => {
    if (!user || user.userType !== "landlord") {
      toast.error("Only landlords can list properties. Please sign up as a landlord.")
      setTimeout(() => onNavigate("home"), 2000)
    }
  }, [user, onNavigate])

  const availableAmenities = [
    "Wifi",
    "Parking",
    "Kitchen",
    "Shared Kitchen",
    "Laundry",
    "Gym",
    "Pool",
    "Balcony",
    "Generator",
    "24/7 Security",
    "Furnished",
    "Private Bathroom",
    "Study Room",
  ]

  const onSubmit = async (data: any) => {
    if (!user || user.userType !== "landlord") {
      toast.error("Only landlords can list properties")
      return
    }

    setIsSubmitting(true)
    // In production, this would call an API to create the listing
    setTimeout(() => {
      toast.success("Property listed successfully! It will be reviewed and verified.")
      reset()
      setIsSubmitting(false)
      onListingCreated?.()
      onNavigate("listings")
    }, 1500)
  }

  if (!user || user.userType !== "landlord") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Landlord Access Required</h2>
          <p className="text-gray-600 mb-6">Please sign up as a landlord to list properties</p>
          <button
            onClick={() => onNavigate("home")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8 transition-colors"
        >
          <span>←</span> Back to home
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Property</h1>
          <p className="text-gray-600 mb-8">Fill out the form below to list your property on ARBITAT</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Property Title *</label>
              <input
                type="text"
                {...register("title", { required: "Property title is required" })}
                placeholder="e.g., Modern 1-Bed Flat, 5 mins from Main Gate"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message as string}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">University *</label>
                <select
                  {...register("university", { required: "University is required" })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select university</option>
                  {universities.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>
                {errors.university && (
                  <p className="text-red-600 text-sm mt-1">{errors.university.message as string}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">City *</label>
                <select
                  {...register("city", { required: "City is required" })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message as string}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Location *</label>
              <input
                type="text"
                {...register("location", { required: "Location is required" })}
                placeholder="e.g., 0.8km from UNILAG"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              />
              {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location.message as string}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Property Type *</label>
                <select
                  {...register("type", { required: "Property type is required" })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Studio">Studio / Self-Con</option>
                  <option value="Shared">Shared</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Bedrooms *</label>
                <select
                  {...register("bedrooms", { required: "Bedrooms is required" })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Price per Month (₦) *</label>
                <input
                  type="number"
                  {...register("pricePerMonth", { required: "Price is required", min: 1 })}
                  placeholder="180000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
                {errors.pricePerMonth && (
                  <p className="text-red-600 text-sm mt-1">{errors.pricePerMonth.message as string}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
              <textarea
                {...register("description", { required: "Description is required", minLength: 50 })}
                rows={6}
                placeholder="Describe your property in detail..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.description.message as string} (Minimum 50 characters)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Amenities *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border-2 border-gray-200 rounded-xl">
                {availableAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={amenity}
                      {...register("amenities", { required: "Select at least one amenity" })}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
              {errors.amenities && <p className="text-red-600 text-sm mt-1">{errors.amenities.message as string}</p>}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "List Property"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function MyPropertiesPage({
  onNavigate,
}: {
  onNavigate: (page: string, listingId?: number) => void
}) {
  const user = getUser()
  const [listings] = useState<Listing[]>(mockListings.slice(0, 3))

  useEffect(() => {
    if (!user || user.userType !== "landlord") {
      toast.error("Only landlords can access this page")
      setTimeout(() => onNavigate("home"), 2000)
    }
  }, [user, onNavigate])

  if (!user || user.userType !== "landlord") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only landlords can access this page</p>
          <button
            onClick={() => onNavigate("home")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
              <p className="text-gray-600">Manage your listed properties</p>
            </div>
            <button
              onClick={() => onNavigate("list-property")}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              List New Property
            </button>
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-600 mb-6">Start listing your properties to reach thousands of students</p>
            <button
              onClick={() => onNavigate("list-property")}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              List Your First Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => onNavigate("detail", listing.id)}
                className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={listing.image || "/placeholder.svg"}
                    alt={listing.title}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 flex-1">{listing.location}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current text-gray-900" />
                      <span className="text-sm font-medium text-gray-900">{listing.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{listing.title}</p>
                  <p className="text-gray-900">
                    <span className="font-bold">₦{listing.pricePerMonth.toLocaleString()}</span>
                    <span className="text-gray-600"> / month</span>
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-600 pt-2 border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <BedDouble className="w-4 h-4" />
                      {listing.bedrooms} bed
                    </span>
                    <span className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      {listing.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Requests</h2>
          <div className="space-y-4">
            {listings.slice(0, 2).map((listing) => (
              <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{listing.location}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Move-in: Jan 15, 2025
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        Duration: 12 months
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                      Pending
                    </span>
                    <button className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfilePage({
  onNavigate,
}: {
  onNavigate: (page: string, listingId?: number) => void
}) {
  const user = getUser()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(user?.name || "")
  const [editedEmail, setEditedEmail] = useState(user?.email || "")

  const bookings = user ? getBookingsByUser(user.id) : []
  const favorites = getFavorites()

  useEffect(() => {
    if (user) {
      setEditedName(user.name)
      setEditedEmail(user.email)
    }
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile</p>
          <button
            onClick={() => onNavigate("home")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = { ...user, name: editedName, email: editedEmail }
      setUser(updatedUser)
      setIsEditing(false)
      toast.success("Profile updated successfully!")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-green-600" />
              </div>
              <div>
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-2xl font-bold text-gray-900 border-2 border-green-500 rounded-lg px-3 py-1 focus:outline-none"
                    />
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      className="text-gray-600 border-2 border-green-500 rounded-lg px-3 py-1 focus:outline-none"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                    <p className="text-gray-600">{user.email}</p>
                  </>
                )}
                <div className="mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.userType === "landlord"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.userType === "landlord" ? "🏠 Landlord" : "🎓 Student"}
                  </span>
                </div>
              </div>
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditedName(user.name)
                    setEditedEmail(user.email)
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Favorites</p>
                <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
              </div>
            </div>
          </div>
          {user.userType === "landlord" && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Properties</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {bookings.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
            <div className="space-y-4">
              {bookings.map((booking) => {
                const listing = mockListings.find((l) => l.id === booking.listingId)
                return listing ? (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onNavigate("detail", booking.listingId)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{listing.location}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Move-in: {new Date(booking.moveInDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                              Duration: {booking.leaseDuration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}

        {favorites.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Favorite Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.map((listingId) => {
                const listing = mockListings.find((l) => l.id === listingId)
                return listing ? (
                  <div
                    key={listing.id}
                    onClick={() => onNavigate("detail", listing.id)}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{listing.location}</p>
                    <p className="font-bold text-gray-900">₦{listing.pricePerMonth.toLocaleString()}/month</p>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-xl">ARBITAT</h3>
            <p className="text-sm text-gray-600">
              Your trusted platform for verified student accommodation. No agents, no stress.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Safety & Trust
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>© 2025 ARBITAT. All rights reserved. Made with ❤️ for Nigerian students.</p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [page, setPage] = useState<string>("home")
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [signUpModalOpen, setSignUpModalOpen] = useState(false)
  const [searchFilters, setSearchFilters] = useState<{
    location: string
    moveInDate: string
    roommates: number
  } | undefined>(undefined)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleNavigate = (newPage: string, listingId?: number) => {
    setPage(newPage)
    if (listingId) {
      setSelectedListingId(listingId)
    }
    window.scrollTo(0, 0)
  }

  const handleSearch = (filters: { location: string; moveInDate: string; roommates: number }) => {
    setSearchFilters(filters)
    setPage("listings")
    window.scrollTo(0, 0)
  }

  const handleLoginSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleLogout = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Toaster position="top-center" richColors />
      <NavBar
        key={refreshKey}
        onNavigate={handleNavigate}
        currentPage={page}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenSignUp={() => setSignUpModalOpen(true)}
        onLogout={handleLogout}
      />

      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} onSearch={handleSearch} />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToSignUp={() => {
          setLoginModalOpen(false)
          setSignUpModalOpen(true)
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      <SignUpModal
        isOpen={signUpModalOpen}
        onClose={() => setSignUpModalOpen(false)}
        onSwitchToLogin={() => {
          setSignUpModalOpen(false)
          setLoginModalOpen(true)
        }}
        onSignUpSuccess={handleLoginSuccess}
      />

      {page === "home" && <HomePage onNavigate={handleNavigate} />}
      {page === "listings" && <ListingsPage onNavigate={handleNavigate} searchFilters={searchFilters} />}
      {page === "detail" && selectedListingId && (
        <DetailPage listingId={selectedListingId} onNavigate={handleNavigate} />
      )}
      {page === "list-property" && <ListPropertyPage onNavigate={handleNavigate} onListingCreated={handleLoginSuccess} />}
      {page === "my-properties" && <MyPropertiesPage onNavigate={handleNavigate} />}
      {page === "profile" && <ProfilePage onNavigate={handleNavigate} />}

      <Footer />
    </div>
  )
}
