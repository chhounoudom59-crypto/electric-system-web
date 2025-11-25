import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "ElectroStore - Premium Electronics & Gadgets Online | Best Prices 2025",
  description: "Shop premium smartphones, laptops, headphones, cameras & accessories from top brands. Fast shipping, secure payments & 100% authentic. ElectroStore - Your trusted online electronics store.",
  keywords: ["electronics", "smartphones", "laptops", "headphones", "cameras", "gadgets", "online shopping"],
  authors: [{ name: "ElectroStore" }],
  creator: "ElectroStore",
  publisher: "ElectroStore",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://electrostore.example.com",
    siteName: "ElectroStore",
    title: "ElectroStore - Premium Electronics Store",
    description: "Shop the latest premium electronics with guaranteed authenticity and best prices",
    images: [
      {
        url: "https://electrostore.example.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "ElectroStore - Premium Electronics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ElectroStore - Premium Electronics Store",
    description: "Shop authentic electronics at best prices",
    creator: "@electrostore",
    images: ["https://electrostore.example.com/twitter-image.png"],
  },
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  alternates: {
    canonical: "https://electrostore.example.com",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          {children}
          <Toaster />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
