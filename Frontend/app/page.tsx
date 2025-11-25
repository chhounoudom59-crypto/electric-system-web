"use client"
import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Smartphone, Laptop, Headphones, Watch, Cpu, Truck, ShieldCheck, Headset } from "lucide-react"
import { ShopHeader } from "@/components/shop/shop-header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />

      <main className="container mx-auto px-4 py-10 space-y-16">
        {/* Hero Section */}
        <section className="grid items-center gap-10 lg:grid-cols-[3fr,2fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              New in ElectroVault
            </span>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              All your <span className="text-primary">electronics</span> in one secure vault.
            </h1>

            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              Discover smartphones, laptops, audio, wearables and more. Fast checkout, secure payments, and modern
              UX inspired by premium electronics stores.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="px-8">
                  Shop Now
                </Button>
              </Link>
              <Link href="/products?category=Smartphones">
                <Button size="lg" variant="outline" className="px-8">
                  View Smartphones
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 text-xs text-muted-foreground sm:text-sm">
              <div>
                <p className="font-semibold text-foreground">Free Shipping</p>
                <p>On selected orders over $199</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Secure Payments</p>
                <p>ABA Pay / Cards / KHQR</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">24/7 Support</p>
                <p>We are here to help you</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/10 via-background to-primary/5 shadow-lg">
              <CardContent className="relative flex h-full flex-col justify-between p-6 sm:p-8">
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">Featured Device</p>
                  <h2 className="text-2xl font-bold text-foreground">iPhone 16 Pro Max</h2>
                  <p className="text-sm text-muted-foreground">
                    Titanium design, Pro camera system, and all-day battery. Perfect hero product for your storefront.
                  </p>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    $1199{" "}
                    <span className="ml-2 text-sm text-muted-foreground line-through">
                      $1299
                    </span>
                  </p>
                </div>

                <div className="relative mt-6 h-56 w-full sm:h-72">
                  <Image
                    src="/iPhone_16_Pro_Max_Natural_Titanium.webp"
                    alt="Featured smartphone"
                    fill
                    className="object-contain drop-shadow-xl"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Feature Icons Strip */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="bg-card/60 border-border">
            <CardContent className="flex items-start gap-3 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">Fast Delivery</h3>
                <p className="text-xs text-muted-foreground">Same-day and next-day delivery options.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 border-border">
            <CardContent className="flex items-start gap-3 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">Secure & Trusted</h3>
                <p className="text-xs text-muted-foreground">Protected payments and easy returns.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 border-border">
            <CardContent className="flex items-start gap-3 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Headset className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">Expert Support</h3>
                <p className="text-xs text-muted-foreground">Tech experts ready to help you choose.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Featured Categories */}
        
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Shop by Category</h2>
            <Link href="/products" className="text-sm text-primary hover:underline">
              View all products
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <CategoryTile
              href="/products?category=Smartphones"
              icon={<Smartphone className="h-6 w-6" />}
              label="Smartphones"
            />
            <CategoryTile
              href="/products?category=Laptops"
              icon={<Laptop className="h-6 w-6" />}
              label="Laptops"
            />
            <CategoryTile
              href="/products?category=Headphones"
              icon={<Headphones className="h-6 w-6" />}
              label="Audio & Headphones"
            />
            <CategoryTile
              href="/products?category=Smartwatches"
              icon={<Watch className="h-6 w-6" />}
              label="Wearables"
            />
            <CategoryTile
              href="/products?category=Accessories"
              icon={<Cpu className="h-6 w-6" />}
              label="Accessories & Parts"
            />
          </div>
        </section>

        {/* New Arrivals (linking to /products) */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">New Arrivals</h2>
            <Link href="/products" className="text-sm text-primary hover:underline">
              Browse full catalog
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Explore the latest devices from Apple, Samsung, Dell, Sony and more in the products section.
          </p>
          <div className="flex flex-wrap gap-3">
            <Tag>Flagship Phones</Tag>
            <Tag>Gaming Laptops</Tag>
            <Tag>Noise-cancelling Headphones</Tag>
            <Tag>Smartwatches</Tag>
          </div>
        </section>

        {/* Brand Row */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Top Brands</h2>
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-border bg-card/40 px-4 py-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Apple</span>
            <span>Samsung</span>
            <span>Sony</span>
            <span>Dell</span>
            <span>Lenovo</span>
            <span>Canon</span>
            <span>HP</span>
          </div>
        </section>

        {/* Newsletter */}
        <section className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-[2fr,3fr] items-center">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Get the newest tech deals</h2>
              <p className="text-sm text-muted-foreground">
                Sign up to receive updates on flash sales, new arrivals, and exclusive offers from ElectroVault.
              </p>
            </div>
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault()
                alert("Subscribed (demo)")
              }}
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-background text-foreground"
                required
              />
              <Button type="submit" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </section>

        {/* Simple Footer */}
        <footer className="border-t border-border pt-6 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} ElectroVault. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/products" className="hover:underline">
                Shop
              </Link>
              <Link href="/login" className="hover:underline">
                Account
              </Link>
              <span className="text-[10px] sm:text-xs">Demo UI built for full‑stack electronics store.</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

type CategoryTileProps = {
  href: string
  icon: React.ReactNode
  label: string
}

function CategoryTile({ href, icon, label }: CategoryTileProps) {
  return (
    <Link href={href}>
      <Card className="h-full cursor-pointer border-border bg-card/70 transition-all hover:-translate-y-1 hover:shadow-lg">
        <CardContent className="flex h-24 items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
          <p className="text-sm font-semibold text-card-foreground">{label}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
      {children}
    </span>
  )
}