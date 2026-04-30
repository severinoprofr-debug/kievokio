# KIEVOKIO — Application Mobile

> **Be Outside The Box** · La Mode Qui Ose Tout

Application mobile complète PWA → Vercel → Google Play / App Store.

---

## 🚀 Stack

- **Next.js 14** (App Router) — framework React SSR/SSG
- **Tailwind CSS** — styling utility-first
- **Zustand** — state management (panier + utilisateur, persisté)
- **next-pwa** — PWA avec Service Worker automatique
- **Framer Motion** — animations (optionnel)
- **Capacitor** — export natif Android / iOS (étape 2)

---

## 📱 Fonctionnalités

### E-commerce
- ✅ Page d'accueil avec hero slider éditorial
- ✅ Catalogue shop avec filtres catégories + tri + recherche
- ✅ Page produit détaillée (images, tailles, couleurs, stocks)
- ✅ Panier persisté avec gestion quantités
- ✅ Codes promo (WELCOME15, KIEVOKIO10, OUTSIDE20, VIP25)
- ✅ Livraison gratuite > 100€
- ✅ Wishlist persistée

### Programme Fidélité
- ✅ 4 niveaux : Bronze → Argent → Or → Platine
- ✅ Points gagnés à chaque achat
- ✅ Récompenses échangeables
- ✅ Historique des points
- ✅ Avantages par niveau

### Compte Utilisateur
- ✅ Connexion (email, Apple, Google)
- ✅ Historique des commandes avec statuts
- ✅ Suivi de livraison
- ✅ Paramètres et adresses

### Notifications
- ✅ Centre de notifications in-app
- ✅ Types : commandes, promos, fidélité, nouveautés
- ✅ Badge lu/non-lu
- ✅ Opt-in push notifications

### PWA
- ✅ Manifest installable (Add to Home Screen)
- ✅ Service Worker avec cache offline
- ✅ Icônes 192x192 et 512x512
- ✅ Thème dark natif
- ✅ Safe area insets (iPhone notch/Dynamic Island)
- ✅ Viewport locked portrait

---

## 🛠️ Installation locale

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev

# Ouvrir http://localhost:3000
```

---

## ▲ Déploiement Vercel (étape 1)

### Méthode 1 — CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Build et déployer
vercel

# Production
vercel --prod
```

### Méthode 2 — GitHub + Vercel Dashboard

1. Pusher ce dossier sur un repo GitHub
2. Aller sur https://vercel.com/new
3. Importer le repo
4. Framework : **Next.js** (détecté automatiquement)
5. Cliquer **Deploy**

> ✅ Votre app est en ligne ! Elle est déjà installable comme PWA sur Android et iOS.

---

## 📲 Google Play Store (étape 2)

### Prérequis
- Android Studio installé
- Compte Google Play Developer (25$ one-time)

### Étapes

```bash
# 1. Installer Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android
npm install @capacitor/splash-screen @capacitor/status-bar @capacitor/push-notifications

# 2. Mettre à jour l'URL Vercel dans capacitor.config.ts
# server.url = "https://votre-app.vercel.app"

# 3. Build Next.js en mode static export
# Dans next.config.js, ajouter : output: 'export'
npm run build

# 4. Initialiser Capacitor
npx cap init

# 5. Ajouter Android
npx cap add android

# 6. Copier les assets web
npx cap sync android

# 7. Ouvrir dans Android Studio
npx cap open android

# 8. Dans Android Studio : Build > Generate Signed Bundle/APK
```

### Ressources graphiques à créer
- `public/icon-192.png` — icône PWA 192×192px
- `public/icon-512.png` — icône PWA 512×512px
- Splash screen Android (via Android Studio Asset Studio)

---

## 🍎 App Store iOS (étape 3)

```bash
# 1. Ajouter iOS (nécessite macOS + Xcode)
npx cap add ios

# 2. Sync
npx cap sync ios

# 3. Ouvrir Xcode
npx cap open ios

# 4. Configurer le signing (compte Apple Developer : 99$/an)
# 5. Archive > Distribute App > App Store Connect
```

---

## 🎨 Customisation

### Couleurs (tailwind.config.js)
```js
gold: '#BFA46E'   // Couleur principale
bg: '#080808'     // Fond noir profond
surface: '#111111' // Cartes
```

### Polices (globals.css)
- **Cormorant Garamond** — titres éditoriaux
- **Jost** — corps de texte, labels

### Codes promo actifs
| Code | Remise |
|------|--------|
| WELCOME15 | -15% |
| KIEVOKIO10 | -10% |
| OUTSIDE20 | -20% |
| VIP25 | -25% |

---

## 📁 Structure

```
kievokio-app/
├── app/
│   ├── page.tsx              # Accueil
│   ├── shop/page.tsx         # Catalogue
│   ├── product/[id]/page.tsx # Fiche produit
│   ├── cart/page.tsx         # Panier
│   ├── loyalty/page.tsx      # Fidélité
│   ├── profile/page.tsx      # Profil
│   ├── notifications/page.tsx# Notifications
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── BottomNav.tsx
│   │   └── ProductCard.tsx
│   ├── store/
│   │   ├── cart.ts           # Zustand cart
│   │   └── user.ts           # Zustand user + loyalty
│   └── data/
│       └── products.ts       # 12 produits mock
├── public/
│   └── manifest.json         # PWA manifest
├── capacitor.config.ts       # Config Capacitor (natif)
├── next.config.js            # Config Next.js + PWA
├── tailwind.config.js
└── vercel.json
```

---

## 🔜 Prochaines étapes

- [ ] Connecter un vrai backend (Supabase / Shopify / WooCommerce)
- [ ] Paiement Stripe
- [ ] Authentification Supabase Auth
- [ ] Vraies push notifications (Firebase FCM)
- [ ] Icônes PNG (192 + 512px) à créer avec le logo KIEVOKIO
- [ ] Analytics (Vercel Analytics ou Mixpanel)
