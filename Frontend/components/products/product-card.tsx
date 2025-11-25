"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Eye } from "lucide-react"
import type { Product } from "@/lib/products-data"
import { getLowestPrice, hasStock, getAvailableStorages } from "@/lib/products-data"
import { useFavorites } from "@/hooks/use-favorites"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { favorites, toggleFavorite } = useFavorites()
  const isFavorite = favorites.includes(product.id)
  const { addItem } = useCart()

  const lowestPrice = getLowestPrice(product)
  const inStock = hasStock(product)
  const lowestPriceVariant = product.variants.find((v) => v.price === lowestPrice)
  const storages = getAvailableStorages(product)
  const showStorageInfo = product.category === "Smartphones" || product.category === "Laptops"

  const defaultVariantId = lowestPriceVariant?.id ?? product.variants[0]?.id
  const canQuickAdd = inStock && !!defaultVariantId

  const handleQuickAddToCart = () => {
    if (!canQuickAdd || !defaultVariantId) return
    addItem(product, 1, defaultVariantId)
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {lowestPriceVariant?.originalPrice && (
              <Badge className="absolute left-3 top-3 bg-destructive">
                Save ${lowestPriceVariant.originalPrice - lowestPrice}
              </Badge>
            )}
            {!inStock && (
              <Badge className="absolute left-3 top-3 bg-muted-foreground">Out of Stock</Badge>
            )}
          </div>
        </Link>

        {/* Hover overlay with actions */}
        {canQuickAdd && (
          <div className="pointer-events-none absolute inset-0 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="pointer-events-auto absolute inset-x-3 bottom-3 flex gap-2">
              <Button
                size="sm"
                className="flex-1 gap-1"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleQuickAddToCart()
                }}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="bg-background/80"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleFavorite(product.id)
                }}
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    isFavorite && "fill-destructive text-destructive",
                  )}
                />
              </Button>
              <Link href={`/products/${product.id}`} className="shrink-0">
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-background/80"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <Link href={`/products/${product.id}`} className="flex-1">
            <p className="text-xs text-muted-foreground">{product.brand}</p>
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={(e) => {
              e.preventDefault()
              toggleFavorite(product.id)
            }}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isFavorite && "fill-destructive text-destructive",
              )}
            />
          </Button>
        </div>

        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-bold text-foreground">${lowestPrice}</span>
          {lowestPriceVariant?.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${lowestPriceVariant.originalPrice}
            </span>
          )}
        </div>
        {showStorageInfo && storages.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            From {storages[0]} • {storages.length} storage options
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/products/${product.id}`} className="w-full">
          <Button className="w-full" variant={inStock ? "default" : "outline"} disabled={!inStock}>
            {inStock ? "View details" : "Out of Stock"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}