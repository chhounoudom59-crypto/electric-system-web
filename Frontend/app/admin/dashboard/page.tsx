"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShopHeader } from "@/components/shop/shop-header"
import { BarChart, TrendingUp, Package, DollarSign, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, stock_alerts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/admin-dashboard/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your store operations</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-foreground">{stats.orders}</p>
                </div>
                <ShoppingCart className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-foreground">${stats.revenue}</p>
                </div>
                <DollarSign className="h-10 w-10 text-green-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Products</p>
                  <p className="text-3xl font-bold text-foreground">{stats.products}</p>
                </div>
                <Package className="h-10 w-10 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Stock Alerts</p>
                  <p className="text-3xl font-bold text-red-600">{stats.stock_alerts}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-red-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/products">
                <Button className="w-full justify-start h-12" variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Products
                </Button>
              </Link>
              <Link href="/admin/stock">
                <Button className="w-full justify-start h-12" variant="outline">
                  <BarChart className="mr-2 h-4 w-4" />
                  Manage Stock
                </Button>
              </Link>
              <Link href="/admin/reports">
                <Button className="w-full justify-start h-12" variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest store updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">✓ New order received</p>
                <p className="text-muted-foreground">⚠ Low stock alert: iPhone 13</p>
                <p className="text-muted-foreground">✓ Payment processed</p>
                <p className="text-muted-foreground">📦 Order shipped</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
