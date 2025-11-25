const DOMAIN = process.env.NEXT_PUBLIC_API_BASE_URL || "https://electrostore.example.com"

export const SEO_CONFIG = {
  domain: DOMAIN,
  title: "ElectroStore - Premium Electronics Store",
  description: "Shop premium smartphones, laptops, headphones, cameras & accessories from top brands.",
  keywords: [
    "electronics",
    "smartphones",
    "laptops",
    "headphones",
    "cameras",
    "gadgets",
    "online shopping",
    "best prices",
  ],
  ogImage: `${DOMAIN}/og-image.png`,
  twitterHandle: "@electrostore",
}

export function generateProductSchema(product: any) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: `${DOMAIN}/products/${product.id}`,
      priceCurrency: "USD",
      price: product.basePrice,
      availability: product.stock > 0 ? "InStock" : "OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "124",
    },
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ElectroStore",
    url: DOMAIN,
    logo: `${DOMAIN}/logo.png`,
    sameAs: [
      "https://facebook.com/electrostore",
      "https://twitter.com/electrostore",
      "https://instagram.com/electrostore",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@electrostore.example.com",
      telephone: "+1-800-ELECTRONICS",
    },
  }
}
