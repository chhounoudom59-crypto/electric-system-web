"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Smartphone, Calendar } from "lucide-react"

export function PersonalInfo() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000"
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "", // Note: Backend might not have this field yet, purely frontend for now or added to Profile model
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  })

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
        if (!token) {
          setLoading(false)
          return
        }

        const res = await fetch(`${API_BASE_URL}/api/users/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          setFormData(prev => ({
            ...prev,
            name: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            address_line1: data.address_line1 || "",
            address_line2: data.address_line2 || "",
            city: data.city || "",
            state: data.state || "",
            postal_code: data.postal_code || "",
            country: data.country || "",
          }))
        }
      } catch (err) {
        console.error("Failed to fetch profile", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
        const token = localStorage.getItem("accessToken")
        const res = await fetch(`${API_BASE_URL}/api/users/profile/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                full_name: formData.name,
                address_line1: formData.address_line1,
                address_line2: formData.address_line2,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postal_code,
                country: formData.country,
            })
        })

        if (!res.ok) throw new Error("Failed to update")
        
        setEditing(false)
        // Optionally refresh data or show toast
    } catch (err) {
        console.error(err)
        alert("Failed to save changes")
    } finally {
        setLoading(false)
    }
  }

  if (loading && !formData.phone) return <div>Loading...</div>

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-card-foreground">Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </div>
          {!editing && (
            <Button onClick={() => setEditing(true)} variant="outline">
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-card-foreground">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!editing}
                className="pl-10 bg-background text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-card-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editing}
                className="pl-10 bg-background text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-card-foreground">
              Phone Number
            </Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                disabled
                className="pl-10 bg-muted text-muted-foreground"
              />
            </div>
            <p className="text-xs text-muted-foreground">Phone number cannot be changed. Contact support if needed.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob" className="text-card-foreground">
              Date of Birth
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                disabled={!editing}
                className="pl-10 bg-background text-foreground"
              />
            </div>
          </div>
        </div>

        {editing && (
          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            <Button onClick={() => setEditing(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
