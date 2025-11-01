import { setUser, type User } from "./auth"

export const DEMO_ACCOUNTS = {
  student: {
    email: "demo.student@arbitat.com",
    password: "demo123",
    name: "Demo Student",
    userType: "student" as const,
  },
  landlord: {
    email: "demo.landlord@arbitat.com",
    password: "demo123",
    name: "Demo Landlord",
    userType: "landlord" as const,
  },
}

export function loginDemoAccount(type: "student" | "landlord") {
  const account = DEMO_ACCOUNTS[type]
  const user: User = {
    id: `demo_${type}_${Date.now()}`,
    name: account.name,
    email: account.email,
    userType: account.userType,
  }
  setUser(user)
  return user
}

