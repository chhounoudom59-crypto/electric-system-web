"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShopHeader } from "@/components/shop/shop-header"
import { Plus, Edit2, Trash2 } from "lucide-react"

export default function ProductManagementPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", price: "", description: "" })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (err) {
      console.error("Failed to fetch products:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        alert("Product added successfully!")
        setFormData({ name: "", price: "", description: "" })
        setShowForm(false)
        fetchProducts()
      }
    } catch (err) {
      alert("Error adding product")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Product Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage your products</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2 rounded-full">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Input
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddProduct} className="flex-1 rounded-full">
                    Save Product
                  </Button>
                  <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1 rounded-full">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Products ({products.length})</CardTitle>
            <CardDescription>All products in your store</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-muted-foreground">No products yet. Add one to get started!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 5).map((product: any) => (
                      <tr key={product.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{product.name}</td>
                        <td className="py-3 px-4">${product.base_price}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{product.product_type}</td>
                        <td className="py-3 px-4 flex gap-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
