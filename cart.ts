import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product } from '../data/products'

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
  colorHex: string
}

interface CartStore {
  items: CartItem[]
  promoCode: string
  promoDiscount: number
  addItem: (product: Product, size: string, color: string, colorHex: string) => void
  removeItem: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  applyPromo: (code: string) => boolean
  subtotal: () => number
  discount: () => number
  total: () => number
  itemCount: () => number
  loyaltyPointsEarned: () => number
}

const PROMO_CODES: Record<string, number> = {
  KIEVOKIO10: 10,
  WELCOME15: 15,
  OUTSIDE20: 20,
  VIP25: 25,
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: '',
      promoDiscount: 0,

      addItem: (product, size, color, colorHex) => {
        const items = get().items
        const existing = items.find(
          i => i.product.id === product.id && i.size === size && i.color === color
        )
        if (existing) {
          set({
            items: items.map(i =>
              i.product.id === product.id && i.size === size && i.color === color
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
        } else {
          set({ items: [...items, { product, quantity: 1, size, color, colorHex }] })
        }
      },

      removeItem: (productId, size) => {
        set({ items: get().items.filter(i => !(i.product.id === productId && i.size === size)) })
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size)
          return
        }
        set({
          items: get().items.map(i =>
            i.product.id === productId && i.size === size ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [], promoCode: '', promoDiscount: 0 }),

      applyPromo: (code) => {
        const upper = code.toUpperCase()
        if (PROMO_CODES[upper]) {
          set({ promoCode: upper, promoDiscount: PROMO_CODES[upper] })
          return true
        }
        return false
      },

      subtotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      discount: () => {
        const sub = get().subtotal()
        const pct = get().promoDiscount
        return pct ? Math.round(sub * pct / 100) : 0
      },

      total: () => {
        const sub = get().subtotal()
        const disc = get().discount()
        const shipping = sub > 100 ? 0 : 6.9
        return sub - disc + shipping
      },

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      loyaltyPointsEarned: () =>
        get().items.reduce((sum, i) => sum + i.product.loyaltyPoints * i.quantity, 0),
    }),
    {
      name: 'kievokio-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
