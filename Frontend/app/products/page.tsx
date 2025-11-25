"use client"

import { useEffect } from "react"
import type { Metadata } from "next"
import { ProductList } from "@/components/products/product-list"
import { ShopHeader } from "@/components/shop/shop-header"

export default function ProductsPage() {
  useEffect(() => {
    // Check that user stays logged in when navigating
    const token = localStorage.getItem("accessToken")
    if (token) {
      // Token exists, user should stay logged in
      console.log("User session active")
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <ProductList />
    </div>
  )
}
