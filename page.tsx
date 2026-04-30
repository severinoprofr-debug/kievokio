'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import ProductCard from '../components/ProductCard'
import { products, categories, getByCategory } from '../data/products'
import type { Product } from '../data/products'

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'new' | 'rating'

function ShopContent() {
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const [showSort, setShowSort] = useState(false)
  const [displayCount, setDisplayCount] = useState(8)

  useEffect(() => {
    const cat = searchParams.get('cat')
    if (cat === 'new') setActiveCategory('all')
    else if (cat === 'sale') setActiveCategory('all')
    else if (cat) setActiveCategory(cat)
  }, [searchParams])

  let filtered: Product[] = getByCategory(activeCategory)

  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    )
  }

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    if (sortBy === 'new') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  const visible = sorted.slice(0, displayCount)

  const SORT_LABELS: Record<SortOption, string> = {
    default: 'Pertinence',
    'price-asc': 'Prix croissant',
    'price-desc': 'Prix décroissant',
    new: 'Nouveautés',
    rating: 'Mieux notés',
  }

  return (
    <div>
      <Header title="Collection" showBack backHref="/" />

      <div className="page-scroll">
        {/* Search */}
        <div className="px-4 mb-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="16" height="16"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              className="input-dark w-full pl-9"
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="scroll-x flex gap-2 px-4 pb-1 mb-4">
          {categories.map(cat => (
            <button key={cat.slug}
              onClick={() => { setActiveCategory(cat.slug); setDisplayCount(8) }}
              className={`flex-shrink-0 font-body text-xs font-medium px-4 py-2 rounded-full border transition-all press-effect
                ${activeCategory === cat.slug
                  ? 'bg-gold text-bg border-gold'
                  : 'bg-transparent text-muted border-border'}`}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 mb-4">
          <p className="font-body text-xs text-muted">{sorted.length} produit{sorted.length !== 1 ? 's' : ''}</p>
          <div className="relative">
            <button onClick={() => setShowSort(v => !v)}
              className="flex items-center gap-1.5 font-body text-xs text-offwhite border border-border rounded-lg px-3 py-1.5 press-effect">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" />
                <line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="7" y2="18" />
              </svg>
              {SORT_LABELS[sortBy]}
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1 bg-s2 border border-border rounded-xl overflow-hidden z-30 min-w-[160px]">
                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([val, label]) => (
                  <button key={val}
                    onClick={() => { setSortBy(val); setShowSort(false) }}
                    className={`w-full text-left px-4 py-3 font-body text-xs transition-colors
                      ${sortBy === val ? 'text-gold bg-gold/5' : 'text-offwhite'}`}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {visible.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 px-4">
              {visible.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {displayCount < sorted.length && (
              <div className="px-4 mt-6">
                <button onClick={() => setDisplayCount(c => c + 8)}
                  className="w-full py-3 border border-gold/30 text-gold font-body text-sm rounded-xl press-effect">
                  Charger plus ({sorted.length - displayCount} restants)
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <span className="text-4xl mb-3">🔍</span>
            <p className="font-display text-xl text-offwhite mb-1">Aucun résultat</p>
            <p className="font-body text-sm text-muted">Essayez un autre terme ou catégorie</p>
          </div>
        )}

        <div className="h-4" />
      </div>

      <BottomNav />
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><span className="text-gold">...</span></div>}>
      <ShopContent />
    </Suspense>
  )
}
