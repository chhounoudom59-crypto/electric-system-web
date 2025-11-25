import type { Metadata } from "next"
import { ProductList } from "@/components/products/product-list"
import { ShopHeader } from "@/components/shop/shop-header"

export const metadata: Metadata = {
  title: "Shop Premium Electronics - Smartphones, Laptops, Headphones | ElectroStore",
  description: "Browse our complete collection of premium electronics including smartphones, laptops, headphones, cameras and accessories. Fast shipping & best prices guaranteed.",
  keywords: ["buy electronics", "smartphones for sale", "laptops online", "headphones", "cameras", "tech accessories"],
  openGraph: {
    title: "ElectroStore - Premium Electronics Collection",
    description: "Shop premium electronics with guaranteed authenticity and best prices",
    type: "website",
  },
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <ProductList />
    </div>
  )
}
