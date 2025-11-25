"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Eye, Star, Sparkles } from "lucide-react"
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

  const discount = lowestPriceVariant?.originalPrice 
    ? Math.round(((lowestPriceVariant.originalPrice - lowestPrice) / lowestPriceVariant.originalPrice) * 100)
    : 0

  return (
    <Card className="group overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all hover-lift bg-card">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-2.5 py-1">
                  -{discount}%
                </Badge>
              )}
              {!inStock && (
                <Badge variant="secondary" className="bg-slate-800 text-white">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>
        </Link>

        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite(product.id)
          }}
          className={cn(
            "absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110",
            isFavorite ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          )}
        >
          <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
        </button>

        {canQuickAdd && (
          <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Button
              size="sm"
              className="flex-1 h-10 rounded-full shadow-lg font-semibold"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleQuickAddToCart()
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Link href={`/products/${product.id}`}>
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full shadow-lg bg-white hover:bg-white/90"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-wide">{product.brand}</p>
            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold text-foreground line-clamp-2 mt-1 group-hover:text-primary transition-colors leading-snug">
                {product.name}
              </h3>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">(124)</span>
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
            <div className="flex flex-wrap gap-1.5">
              {storages.slice(0, 3).map((storage) => (
                <span key={storage} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {storage}
                </span>
              ))}
              {storages.length > 3 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  +{storages.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Link href={`/products/${product.id}`} className="w-full">
          <Button 
            className="w-full h-11 rounded-full font-semibold" 
            variant={inStock ? "default" : "outline"} 
            disabled={!inStock}
          >
            {inStock ? (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                View Details
              </>
            ) : (
              "Out of Stock"
            )}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
