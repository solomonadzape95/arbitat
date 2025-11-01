import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import { UserProvider } from "@/lib/user-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "arbitat - Campus Housing Finder",
  description: "Swipe, Match, Move In - Find your perfect campus lodge",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${satoshi.variable} ${plusJakarta.variable} font-satoshi antialiased`}>
        <UserProvider>
          {children}
          <Toaster />
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
