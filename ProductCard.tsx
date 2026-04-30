'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Product } from '../data/products'
import { useUserStore } from '../store/user'

interface ProductCardProps {
  product: Product
  size?: 'sm' | 'md' | 'lg'
}

export default function ProductCard({ product, size = 'md' }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const wishlist = useUserStore(s => s.wishlist)
  const toggleWishlist = useUserStore(s => s.toggleWishlist)
  const isWished = wishlist.includes(product.id)

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <div className="relative flex flex-col group">
      <Link href={`/product/${product.id}`} className="press-effect block">
        {/* Image */}
        <div className={`relative overflow-hidden rounded-xl bg-s2 ${
          size === 'lg' ? 'aspect-[3/4]' : size === 'sm' ? 'aspect-square' : 'aspect-[3/4]'
        }`}>
          {!imgError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-s2">
              <span className="font-display text-2xl text-gold/30">KV</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-gold text-bg text-[10px] font-body font-semibold px-2 py-0.5 rounded">
                NEW
              </span>
            )}
            {discount && (
              <span className="bg-danger text-offwhite text-[10px] font-body font-semibold px-2 py-0.5 rounded">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-2 px-0.5">
          <p className="text-muted text-[11px] font-body uppercase tracking-wider mb-0.5">
            {product.category}
          </p>
          <p className="text-offwhite text-sm font-body font-medium line-clamp-2 leading-snug">
            {product.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gold font-body font-semibold text-sm">{product.price}€</span>
            {product.originalPrice && (
              <span className="text-muted font-body text-xs line-through">{product.originalPrice}€</span>
            )}
          </div>
          {size !== 'sm' && (
            <p className="text-muted text-[10px] font-body mt-0.5">
              +{product.loyaltyPoints} pts
            </p>
          )}
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={e => { e.preventDefault(); toggleWishlist(product.id) }}
        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all press-effect
          ${isWished ? 'bg-gold text-bg' : 'bg-bg/70 backdrop-blur-sm text-offwhite'}`}
        aria-label="Ajouter aux favoris"
      >
        <svg width="14" height="14" viewBox="0 0 24 24"
          fill={isWished ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      </button>
    </div>
  )
}
