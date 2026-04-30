import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type LoyaltyTier = 'Bronze' | 'Argent' | 'Or' | 'Platine'

export interface Order {
  id: string
  date: string
  status: 'En cours' | 'Expédié' | 'Livré' | 'Annulé'
  items: number
  total: number
  pointsEarned: number
}

export interface Notification {
  id: string
  type: 'order' | 'promo' | 'loyalty' | 'new'
  title: string
  body: string
  date: string
  read: boolean
}

interface UserStore {
  isLoggedIn: boolean
  name: string
  email: string
  avatar?: string
  points: number
  tier: LoyaltyTier
  wishlist: string[]
  orders: Order[]
  notifications: Notification[]
  login: (email: string, name: string) => void
  logout: () => void
  addPoints: (pts: number) => void
  toggleWishlist: (productId: string) => void
  markNotifRead: (id: string) => void
  markAllNotifRead: () => void
  unreadCount: () => number
}

const TIER_THRESHOLDS: Record<LoyaltyTier, number> = {
  Bronze: 0,
  Argent: 500,
  Or: 1500,
  Platine: 3500,
}

const getTier = (points: number): LoyaltyTier => {
  if (points >= 3500) return 'Platine'
  if (points >= 1500) return 'Or'
  if (points >= 500) return 'Argent'
  return 'Bronze'
}

export const getNextTier = (tier: LoyaltyTier): LoyaltyTier | null => {
  if (tier === 'Bronze') return 'Argent'
  if (tier === 'Argent') return 'Or'
  if (tier === 'Or') return 'Platine'
  return null
}

export const getNextTierThreshold = (tier: LoyaltyTier): number => {
  const next = getNextTier(tier)
  if (!next) return TIER_THRESHOLDS.Platine
  return TIER_THRESHOLDS[next]
}

export const getTierProgress = (points: number, tier: LoyaltyTier): number => {
  const current = TIER_THRESHOLDS[tier]
  const next = getNextTierThreshold(tier)
  if (tier === 'Platine') return 100
  return Math.min(100, Math.round(((points - current) / (next - current)) * 100))
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'KV-20241201',
    date: '1 Déc. 2024',
    status: 'Livré',
    items: 2,
    total: 258,
    pointsEarned: 258,
  },
  {
    id: 'KV-20241118',
    date: '18 Nov. 2024',
    status: 'Livré',
    items: 1,
    total: 189,
    pointsEarned: 189,
  },
  {
    id: 'KV-20241205',
    date: '5 Déc. 2024',
    status: 'En cours',
    items: 3,
    total: 399,
    pointsEarned: 0,
  },
]

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Commande expédiée 🚀',
    body: 'Votre commande #KV-20241205 est en route. Livraison estimée : 2-3 jours.',
    date: 'Il y a 2h',
    read: false,
  },
  {
    id: '2',
    type: 'loyalty',
    title: 'Niveau Argent atteint ✨',
    body: 'Félicitations ! Vous bénéficiez maintenant de 10% de remise permanente.',
    date: 'Il y a 1j',
    read: false,
  },
  {
    id: '3',
    type: 'promo',
    title: 'Offre exclusive — 24h',
    body: 'Code OUTSIDE20 : -20% sur toute la collection Vestes. Expire ce soir.',
    date: 'Il y a 2j',
    read: false,
  },
  {
    id: '4',
    type: 'new',
    title: 'Nouvelle collection arrivée',
    body: 'La collection Capsule Hiver est disponible. 12 nouvelles pièces à découvrir.',
    date: 'Il y a 3j',
    read: true,
  },
  {
    id: '5',
    type: 'order',
    title: 'Commande livrée ✅',
    body: 'Votre commande #KV-20241201 a été livrée. Laissez un avis ?',
    date: 'Il y a 5j',
    read: true,
  },
]

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      name: '',
      email: '',
      points: 647,
      tier: 'Argent',
      wishlist: [],
      orders: MOCK_ORDERS,
      notifications: MOCK_NOTIFICATIONS,

      login: (email, name) => set({ isLoggedIn: true, email, name }),
      logout: () => set({ isLoggedIn: false, name: '', email: '' }),

      addPoints: (pts) => {
        const newPts = get().points + pts
        set({ points: newPts, tier: getTier(newPts) })
      },

      toggleWishlist: (productId) => {
        const wl = get().wishlist
        if (wl.includes(productId)) {
          set({ wishlist: wl.filter(id => id !== productId) })
        } else {
          set({ wishlist: [...wl, productId] })
        }
      },

      markNotifRead: (id) => {
        set({
          notifications: get().notifications.map(n => n.id === id ? { ...n, read: true } : n),
        })
      },

      markAllNotifRead: () => {
        set({ notifications: get().notifications.map(n => ({ ...n, read: true })) })
      },

      unreadCount: () => get().notifications.filter(n => !n.read).length,
    }),
    {
      name: 'kievokio-user',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export { TIER_THRESHOLDS, getTier }
