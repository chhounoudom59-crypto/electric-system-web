"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart, type CartItem as CartItemType } from "@/hooks/use-cart"

interface CartItemProps {
  item: CartItemType
  isSelected?: boolean
  onSelectChange?: (selected: boolean) => void
}

export function CartItem({ item, isSelected, onSelectChange }: CartItemProps) {
    const { product, quantity, selectedVariant } = item

    const itemPrice = selectedVariant?.price ?? product.basePrice
    const totalPrice = itemPrice * quantity

    const fullVariant = selectedVariant
      ? product.variants.find((v) => v.id === selectedVariant.id)
      : undefined
    const originalUnitPrice = fullVariant?.originalPrice
    const hasDiscount = originalUnitPrice !== undefined && originalUnitPrice > itemPrice
    const originalTotal = hasDiscount && originalUnitPrice ? originalUnitPrice * quantity : null
    const lineDiscount = hasDiscount && originalTotal !== null ? originalTotal - totalPrice : 0

    const displayImage = selectedVariant?.image || product.image

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {onSelectChange && (
            <div className="flex items-center">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked: any) => onSelectChange(!!checked)}
                className="h-5 w-5"
              />
            </div>
          )}

          {/* Product Image - displays color-specific image based on selection */}
          <Link href={`/products/${product.id}`} className="flex-shrink-0">
            <div className="relative h-32 w-32 overflow-hidden rounded-lg bg-muted">
              <Image
                src={displayImage || "/placeholder.svg"}
                alt={`${product.name} - ${selectedVariant?.color || "product"}`}
                fill
                className="object-cover"
              />
            </div>
          </Link>

          {/* Product Info */}
                    <div className="flex items-center justify-between gap-4">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => updateQuantity(product.id, selectedVariant?.id || "", quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => updateQuantity(product.id, selectedVariant?.id || "", quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Price + discount + remove */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-lg font-bold text-foreground">${totalPrice.toFixed(2)}</span>
                  {hasDiscount && originalTotal !== null && lineDiscount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      <span className="mr-1 line-through">${originalTotal.toFixed(2)}</span>
                      <span className="text-emerald-600 font-medium">Save ${lineDiscount.toFixed(2)}</span>
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(product.id, selectedVariant?.id || "")}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          
        </div>
      </CardContent>
    </Card>
  )
}
