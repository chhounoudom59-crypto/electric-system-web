"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, User, Search, Menu, X, ChevronDown, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useFavorites } from "@/hooks/use-favorites"
import { useCart } from "@/hooks/use-cart"

export function ShopHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const { favorites } = useFavorites()
  const { getTotalItems } = useCart()
  const cartItemsCount = getTotalItems()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem("accessToken")
    setIsLoggedIn(!!token)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const param = searchParams?.get("search") ?? ""
    if (param && searchQuery === "") {
      setSearchQuery(param)
    }
  }, [searchParams])

  useEffect(() => {
    if (searchQuery.trim() === "" && searchParams?.get("search")) {
      router.replace("/products")
    }
  }, [searchQuery, searchParams, router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const categories = [
    { name: "All Products", href: "/products", featured: true },
    { name: "Smartphones", href: "/products?category=Smartphones" },
    { name: "Laptops", href: "/products?category=Laptops" },
    { name: "Headphones", href: "/products?category=Headphones" },
    { name: "Cameras", href: "/products?category=Cameras" },
    { name: "Accessories", href: "/products?category=Accessories" },
  ]

  return (
    <>
      <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex h-9 items-center justify-center text-xs sm:text-sm font-medium">
            <Zap className="mr-2 h-3.5 w-3.5 animate-pulse" />
            <span>Free Express Shipping on orders over $199</span>
            <span className="mx-3 hidden sm:inline">|</span>
            <span className="hidden sm:inline">30-Day Easy Returns</span>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50" 
          : "bg-background border-b border-border"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 -ml-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold tracking-tight text-foreground">
                    Electro<span className="text-primary">Store</span>
                  </span>
                </div>
              </Link>
            </div>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for products, brands, and more..."
                  className="w-full pl-11 pr-4 h-11 rounded-full border-2 border-muted bg-muted/50 focus:bg-background focus:border-primary/50 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <nav className="flex items-center gap-1">
              <Link href="/favorites">
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-primary/10">
                  <Heart className="h-5 w-5" />
                  {mounted && favorites.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-lg">
                      {favorites.length}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-primary/10">
                  <ShoppingCart className="h-5 w-5" />
                  {mounted && cartItemsCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-lg">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
              </Link>
              {isLoggedIn ? (
                <>
                  <div className="relative group">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/10">
                      <User className="h-5 w-5" />
                    </Button>
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50 border border-border">
                      <Link href="/profile" className="block px-4 py-2.5 hover:bg-muted rounded-t-lg text-sm font-medium">
                        My Profile
                      </Link>
                      <Link href="/orders" className="block px-4 py-2.5 hover:bg-muted text-sm font-medium">
                        My Orders
                      </Link>
                      <button onClick={() => {
                        localStorage.removeItem("accessToken")
                        localStorage.removeItem("refreshToken")
                        localStorage.removeItem("user")
                        setIsLoggedIn(false)
                        router.push("/")
                      }} className="w-full text-left px-4 py-2.5 hover:bg-muted rounded-b-lg text-red-600 text-sm font-medium">
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Link href="/login" className="hidden sm:block ml-2">
                  <Button size="sm" className="rounded-full px-5 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
          </div>

          <nav className="hidden lg:flex h-12 items-center gap-1 -mb-px">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  category.featured
                    ? "text-primary hover:bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="w-full pl-11 h-11 rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
              <nav className="flex flex-col gap-1">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
