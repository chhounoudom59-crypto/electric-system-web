"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Lock } from "lucide-react"
import { OtpVerification } from "./otp-verification"

export function LoginForm() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"

  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/auth/request-phone-otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          purpose: "LOGIN",
        }),
      })

      if (!res.ok) {
        let detail = "Failed to send OTP. Please try again."
        try {
          const data = await res.json()
          if (data?.detail) detail = data.detail
        } catch (_) {}
        setError(detail)
        return
      }

      setStep("otp")
    } catch (err) {
      setError("Network error while sending OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (otp: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/auth/verify-phone-otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          code: otp,
          purpose: "LOGIN",
        }),
      })

      if (!res.ok) {
        let detail = "Failed to verify OTP. Please try again."
        try {
          const data = await res.json()
          if (data?.detail) detail = data.detail
        } catch (_) {}
        setError(detail)
        return
      }

      const data = await res.json()
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", data.access)
        localStorage.setItem("refreshToken", data.refresh)
        localStorage.setItem("user", JSON.stringify(data.user))
        alert("Login successful")
      }

      window.location.href = "/profile"
    } catch (err) {
      setError("Network error while verifying OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (step === "otp") {
    return (
      <OtpVerification
        phoneNumber={phoneNumber}
        onVerify={handleVerifyOtp}
        onResend={async () => {
          if (!phoneNumber) return
          setLoading(true)
          setError(null)
          try {
            const res = await fetch(`${API_BASE_URL}/api/users/auth/request-phone-otp/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                phone_number: phoneNumber,
                purpose: "LOGIN",
              }),
            })
            if (!res.ok) {
              let detail = "Failed to resend OTP. Please try again."
              try {
                const data = await res.json()
                if (data?.detail) detail = data.detail
              } catch (_) {}
              setError(detail)
            }
          } catch (err) {
            setError("Network error while resending OTP. Please try again.")
          } finally {
            setLoading(false)
          }
        }}
        loading={loading}
      />
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Sign In</CardTitle>
        <CardDescription>Enter your phone number to receive a verification code</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-card-foreground">
              Phone Number
            </Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+855 12 345 678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10 bg-background text-foreground"
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading || !phoneNumber}>
            {loading ? "Sending Code..." : "Continue with Phone"}
          </Button>

          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Secure authentication with OTP verification</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
