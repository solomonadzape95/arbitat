"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { getLodgeById, mockStudents, mockPayments, type Lodge } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, CheckCircle2, DollarSign, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const SERVICE_FEE_PERCENTAGE = 0.05 // 5% service fee

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const { userType, userId } = useUser()
  const { toast } = useToast()
  const [lodge, setLodge] = useState<Lodge | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  useEffect(() => {
    if (userType !== "student") {
      router.push("/")
      return
    }

    const lodgeId = Number(params.id)
    const foundLodge = getLodgeById(lodgeId)
    if (foundLodge) {
      setLodge(foundLodge)
    }
  }, [userType, params.id, router])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (lodge && userId) {
      const serviceFee = Math.round(lodge.price * SERVICE_FEE_PERCENTAGE)
      const newPayment = {
        id: mockPayments.length + 1,
        studentId: userId,
        lodgeId: lodge.id,
        amount: lodge.price,
        serviceFee,
        status: "completed" as const,
        date: new Date().toLocaleDateString(),
      }

      mockPayments.push(newPayment)

      const student = mockStudents.find((s) => s.id === userId)
      if (student) {
        student.payments.push(newPayment)
      }

      setPaymentSuccess(true)
      setIsProcessing(false)

      toast({
        title: "Payment Successful!",
        description: `You've successfully secured ${lodge.name}`,
      })
    }
  }

  if (userType !== "student" || !lodge) {
    return null
  }

  const serviceFee = Math.round(lodge.price * SERVICE_FEE_PERCENTAGE)
  const totalAmount = lodge.price

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-balance">Payment Successful!</h2>
            <p className="text-muted-foreground mb-8 text-balance">
              You've successfully secured your room at {lodge.name}. The landlord will contact you shortly.
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push("/student/matches")} className="w-full">
                View My Cribs
              </Button>
              <Button variant="outline" onClick={() => router.push("/student")} className="w-full">
                Continue Browsing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Secure Payment</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Lodge Summary */}
          <div>
            <Card className="mb-6 overflow-hidden">
              <img src={lodge.images[0] || "/placeholder.svg"} alt={lodge.name} className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <h3 className="text-xl font-bold mb-2 text-balance">{lodge.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{lodge.location}</p>
                {lodge.verified && (
                  <Badge className="bg-accent text-accent-foreground">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified Property
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Rent</span>
                  <span className="font-semibold">₦{lodge.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee (5%)</span>
                  <span>₦{serviceFee.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold">₦{totalAmount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      (Landlord receives ₦{(totalAmount - serviceFee).toLocaleString()})
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4 border-accent/50 bg-accent/5">
              <CardContent className="p-4 flex gap-3">
                <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Demo Payment</p>
                  <p className="text-muted-foreground">
                    This is a simulated payment for demonstration purposes. No real transaction will occur.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        maxLength={5}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing ? (
                      <>Processing Payment...</>
                    ) : (
                      <>
                        <DollarSign className="w-5 h-5 mr-2" />
                        Pay ₦{totalAmount.toLocaleString()}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">Your payment is secure and encrypted</p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
