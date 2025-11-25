"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShopHeader } from "@/components/shop/shop-header"
import { Smartphone, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function VerifyOTPPage() {
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSendOTP = async () => {
    if (!phone) {
      setError("Please enter phone number")
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/request-phone-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone, purpose: "LOGIN" }),
      })
      if (response.ok) {
        const data = await response.json()
        alert(`OTP sent! (Demo: ${data.dev_otp})`)
      } else {
        setError("Failed to send OTP")
      }
    } catch (err) {
      setError("Error: " + String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter valid 6-digit OTP")
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/verify-phone-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone, code: otp }),
      })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("authToken", data.access)
        router.push("/profile")
      } else {
        const errData = await response.json()
        setError(errData.detail || "Invalid OTP")
      }
    } catch (err) {
      setError("Error: " + String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <main className="container mx-auto px-4 py-12">
        <Link href="/login" className="flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Verify Your Phone</CardTitle>
              <CardDescription>
                Enter your phone number and we'll send you a 6-digit OTP
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="+855 9x xxx xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  className="h-12"
                />
                <Button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full h-12 rounded-full"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </div>

              {phone && (
                <div className="space-y-2 pt-4 border-t">
                  <label className="text-sm font-medium">Enter 6-Digit OTP</label>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    disabled={loading}
                    maxLength={6}
                    className="h-12 text-center text-2xl tracking-widest font-mono"
                  />
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    className="w-full h-12 rounded-full"
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                  </Button>
                </div>
              )}

              <p className="text-xs text-center text-muted-foreground pt-2">
                Your information is secure. We never share your data.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
