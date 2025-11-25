"use client"
import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Smartphone, Laptop, Headphones, Watch, Cpu, Truck, ShieldCheck, Headset, ArrowRight, Star, Sparkles, Timer, Gift } from "lucide-react"
import { ShopHeader } from "@/components/shop/shop-header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 py-12 lg:py-20 relative">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20">
                  <Sparkles className="h-4 w-4" />
                  New Collection 2025
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
                  <span className="text-foreground">Premium</span>
                  <br />
                  <span className="text-gradient">Electronics</span>
                  <br />
                  <span className="text-foreground">For Everyone</span>
                </h1>

                <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
                  Discover the latest smartphones, laptops, audio gear, and accessories from top brands. 
                  Fast shipping, secure payments, and exceptional service.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/products">
                    <Button size="lg" className="h-14 px-8 text-base rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105">
                      Shop Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/products?category=Smartphones">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-2 hover:bg-primary/5">
                      View Smartphones
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap gap-8 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                      <Truck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Free Shipping</p>
                      <p className="text-sm text-muted-foreground">On orders $199+</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                      <ShieldCheck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Secure Payment</p>
                      <p className="text-sm text-muted-foreground">100% Protected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                      <Headset className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">24/7 Support</p>
                      <p className="text-sm text-muted-foreground">Expert help</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10">
                  <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                    <CardContent className="relative p-8">
                      <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                        <Timer className="h-3 w-3" />
                        Limited Offer
                      </div>
                      
                      <div className="space-y-4 text-white">
                        <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/70">Featured Device</p>
                        <h2 className="text-3xl font-bold">iPhone 16 Pro Max</h2>
                        <p className="text-sm text-slate-300">
                          Titanium design, Pro camera system, and all-day battery life.
                        </p>
                        
                        <div className="flex items-center gap-1 text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                          <span className="ml-2 text-sm text-slate-300">(2,847 reviews)</span>
                        </div>
                        
                        <div className="flex items-baseline gap-3 pt-2">
                          <span className="text-4xl font-bold">$1,199</span>
                          <span className="text-lg text-slate-400 line-through">$1,299</span>
                          <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-semibold text-green-400">
                            Save $100
                          </span>
                        </div>
                        
                        <Link href="/products" className="block pt-4">
                          <Button className="w-full h-12 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-semibold">
                            Shop Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>

                      <div className="absolute -right-10 -bottom-10 w-64 h-64">
                        <Image
                          src="/iPhone_16_Pro_Max_Natural_Titanium.webp"
                          alt="iPhone 16 Pro Max"
                          fill
                          className="object-contain drop-shadow-2xl animate-float"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl opacity-60" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">Shop by Category</h2>
              <p className="text-muted-foreground">Find exactly what you're looking for</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <CategoryCard
                href="/products?category=Smartphones"
                icon={<Smartphone className="h-8 w-8" />}
                label="Smartphones"
                count="120+ Products"
                color="from-blue-500/20 to-blue-600/10"
              />
              <CategoryCard
                href="/products?category=Laptops"
                icon={<Laptop className="h-8 w-8" />}
                label="Laptops"
                count="85+ Products"
                color="from-purple-500/20 to-purple-600/10"
              />
              <CategoryCard
                href="/products?category=Headphones"
                icon={<Headphones className="h-8 w-8" />}
                label="Audio"
                count="200+ Products"
                color="from-pink-500/20 to-pink-600/10"
              />
              <CategoryCard
                href="/products?category=Smartwatches"
                icon={<Watch className="h-8 w-8" />}
                label="Wearables"
                count="65+ Products"
                color="from-green-500/20 to-green-600/10"
              />
              <CategoryCard
                href="/products?category=Accessories"
                icon={<Cpu className="h-8 w-8" />}
                label="Accessories"
                count="300+ Products"
                color="from-orange-500/20 to-orange-600/10"
              />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <PromoCard
                title="Flash Sale"
                subtitle="Up to 40% Off"
                description="Limited time offer on selected items"
                icon={<Timer className="h-6 w-6" />}
                color="bg-gradient-to-br from-red-500 to-orange-500"
                href="/products"
              />
              <PromoCard
                title="New Arrivals"
                subtitle="Just Landed"
                description="Check out the latest tech gadgets"
                icon={<Sparkles className="h-6 w-6" />}
                color="bg-gradient-to-br from-primary to-purple-600"
                href="/products"
              />
              <PromoCard
                title="Gift Cards"
                subtitle="Perfect Gift"
                description="Give the gift of choice"
                icon={<Gift className="h-6 w-6" />}
                color="bg-gradient-to-br from-green-500 to-emerald-600"
                href="/products"
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-3">Featured Collections</h2>
              <p className="text-muted-foreground text-lg">Curated selections of the best electronics</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <ImageShowcaseCard
                title="Premium Smartphones"
                description="Latest flagship phones with cutting-edge technology"
                image="/iPhone_16_Pro_Max_Natural_Titanium.webp"
                bgGradient="from-blue-500/20 to-cyan-500/10"
                href="/products?category=Smartphones"
              />
              <ImageShowcaseCard
                title="High Performance Laptops"
                description="Powerful laptops for work, gaming, and creation"
                image="/placeholder.svg"
                bgGradient="from-purple-500/20 to-pink-500/10"
                href="/products?category=Laptops"
              />
              <ImageShowcaseCard
                title="Premium Audio"
                description="Crystal clear sound with noise cancellation"
                image="/placeholder.svg"
                bgGradient="from-green-500/20 to-emerald-500/10"
                href="/products?category=Headphones"
              />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-3">Why Choose ElectroStore</h2>
              <p className="text-muted-foreground text-lg">Industry-leading service and quality</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureShowcase
                icon={<Truck className="h-8 w-8" />}
                title="Free Shipping"
                description="On all orders over $199"
                bgColor="bg-gradient-to-br from-blue-500/10 to-blue-600/5"
              />
              <FeatureShowcase
                icon={<ShieldCheck className="h-8 w-8" />}
                title="100% Secure"
                description="Protected transactions always"
                bgColor="bg-gradient-to-br from-green-500/10 to-green-600/5"
              />
              <FeatureShowcase
                icon={<Headset className="h-8 w-8" />}
                title="Expert Support"
                description="24/7 customer service team"
                bgColor="bg-gradient-to-br from-purple-500/10 to-purple-600/5"
              />
              <FeatureShowcase
                icon={<Sparkles className="h-8 w-8" />}
                title="Best Prices"
                description="Guaranteed lowest prices"
                bgColor="bg-gradient-to-br from-orange-500/10 to-orange-600/5"
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl mx-4 md:mx-auto md:container">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold leading-tight">Tech That Matters</h2>
                <p className="text-lg text-white/80">
                  From cutting-edge smartphones to powerful laptops, we bring you the latest innovations in electronics. 
                  Every product is carefully selected and tested for quality.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Best Warranties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Expert Service</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>Great Prices</span>
                  </div>
                </div>
                <Link href="/products">
                  <Button className="h-12 px-8 rounded-full bg-white text-slate-900 hover:bg-white/90 font-semibold">
                    Explore Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="relative h-80 hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl blur-3xl"></div>
                <Image
                  src="/iPhone_16_Pro_Max_Natural_Titanium.webp"
                  alt="Featured tech"
                  fill
                  className="object-contain drop-shadow-2xl relative z-10"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Popular Brands</h2>
                <p className="text-muted-foreground">Shop from the world's leading tech brands</p>
              </div>
              <Link href="/products">
                <Button variant="outline" className="rounded-full">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {["Apple", "Samsung", "Sony", "Dell", "Lenovo", "Canon"].map((brand) => (
                <Link key={brand} href={`/products?search=${brand}`}>
                  <Card className="hover-lift border-2 border-transparent hover:border-primary/20 cursor-pointer">
                    <CardContent className="flex h-20 items-center justify-center p-4">
                      <span className="text-lg font-bold text-muted-foreground hover:text-foreground transition-colors">
                        {brand}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="overflow-hidden border-0 bg-gradient-to-r from-primary via-primary to-purple-600 shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="grid gap-8 md:grid-cols-2 items-center">
                  <div className="text-white space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">Get Exclusive Deals</h2>
                    <p className="text-lg text-white/80">
                      Subscribe to our newsletter and be the first to know about new products, flash sales, and exclusive offers.
                    </p>
                  </div>
                  <form
                    className="flex flex-col sm:flex-row gap-3"
                    onSubmit={(e) => {
                      e.preventDefault()
                      alert("Subscribed! (demo)")
                    }}
                  >
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="h-14 rounded-full bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 flex-1"
                      required
                    />
                    <Button 
                      type="submit" 
                      size="lg"
                      className="h-14 px-8 rounded-full bg-white text-primary hover:bg-white/90 font-semibold shrink-0"
                    >
                      Subscribe
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="text-xl font-bold">ElectroStore</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your trusted destination for premium electronics and accessories.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Shop</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/products" className="hover:text-foreground transition-colors">All Products</Link></li>
                  <li><Link href="/products?category=Smartphones" className="hover:text-foreground transition-colors">Smartphones</Link></li>
                  <li><Link href="/products?category=Laptops" className="hover:text-foreground transition-colors">Laptops</Link></li>
                  <li><Link href="/products?category=Headphones" className="hover:text-foreground transition-colors">Headphones</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Account</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/profile" className="hover:text-foreground transition-colors">My Profile</Link></li>
                  <li><Link href="/orders" className="hover:text-foreground transition-colors">Orders</Link></li>
                  <li><Link href="/favorites" className="hover:text-foreground transition-colors">Wishlist</Link></li>
                  <li><Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><span className="hover:text-foreground transition-colors cursor-pointer">Contact Us</span></li>
                  <li><span className="hover:text-foreground transition-colors cursor-pointer">FAQs</span></li>
                  <li><span className="hover:text-foreground transition-colors cursor-pointer">Shipping Info</span></li>
                  <li><span className="hover:text-foreground transition-colors cursor-pointer">Returns</span></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>2025 ElectroStore. All rights reserved.</p>
              <div className="flex gap-6">
                <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
                <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

type CategoryCardProps = {
  href: string
  icon: React.ReactNode
  label: string
  count: string
  color: string
}

function CategoryCard({ href, icon, label, count, color }: CategoryCardProps) {
  return (
    <Link href={href}>
      <Card className="group h-full cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all hover-lift">
        <CardContent className={`flex flex-col items-center justify-center gap-4 p-6 h-40 bg-gradient-to-br ${color} rounded-lg`}>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background/80 text-primary shadow-lg group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{count}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

type PromoCardProps = {
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  color: string
  href: string
}

function PromoCard({ title, subtitle, description, icon, color, href }: PromoCardProps) {
  return (
    <Link href={href}>
      <Card className={`group overflow-hidden border-0 ${color} text-white hover-lift cursor-pointer`}>
        <CardContent className="p-6 flex flex-col justify-between h-48">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              {icon}
            </div>
            <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">{subtitle}</p>
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-sm text-white/70 mt-1">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
