"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Lock } from "lucide-react"
import { OtpVerification } from "./otp-verification"

export function RegisterForm() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"
  const [step, setStep] = useState<"phone" | "otp" | "details">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/auth/request-phone-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phoneNumber,
          purpose: "REGISTER",
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || "Failed to send OTP")
      }

      setStep("otp")
    } catch (error: any) {
      console.error(error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (otp: string) => {
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/auth/verify-phone-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phoneNumber,
          code: otp,
          purpose: "REGISTER",
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || "Invalid OTP")
      }

      const data = await res.json()
      // Save tokens to local storage
      localStorage.setItem("accessToken", data.access)
      localStorage.setItem("refreshToken", data.refresh)
      
      // If profile creation is part of registration, move to details step
      setStep("details")
    } catch (error: any) {
      console.error(error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Update profile with full name
      const token = localStorage.getItem("accessToken")
      const res = await fetch(`${API_BASE_URL}/api/users/profile/`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          full_name: name,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update profile")
      }

      window.location.href = "/profile"
    } catch (error: any) {
        console.error(error)
        alert(error.message)
    } finally {
        setLoading(false)
    }
  }

  if (step === "otp") {
    return (
      <OtpVerification
        phoneNumber={phoneNumber}
        onVerify={handleVerifyOtp}
        onResend={() => console.log("[v0] Resending OTP")}
        loading={loading}
      />
    )
  }

  if (step === "details") {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Complete Your Profile</CardTitle>
          <CardDescription>Tell us a bit more about yourself</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCompleteRegistration} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-card-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-card-foreground">
                Email Address (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background text-foreground"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || !name}>
              {loading ? "Creating Account..." : "Complete Registration"}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Register with Phone</CardTitle>
        <CardDescription>{"We'll send you a verification code"}</CardDescription>
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
                placeholder="+1 (555) 000-0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10 bg-background text-foreground"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">Enter your phone number with country code</p>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !phoneNumber}>
            {loading ? "Sending Code..." : "Send Verification Code"}
          </Button>

          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Your phone number is secure and will only be used for authentication
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
