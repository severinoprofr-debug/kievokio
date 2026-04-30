'use client'

import Link from 'next/link'
import { useUserStore } from '../store/user'

interface HeaderProps {
  title?: string
  showBrand?: boolean
  showBack?: boolean
  backHref?: string
  rightAction?: React.ReactNode
  transparent?: boolean
}

export default function Header({
  title,
  showBrand = false,
  showBack = false,
  backHref = '/',
  rightAction,
  transparent = false,
}: HeaderProps) {
  const unread = useUserStore(s => s.unreadCount())

  return (
    <header className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 h-[60px] flex items-center px-4 transition-all
      ${transparent ? 'bg-transparent' : 'bg-bg/95 backdrop-blur-md border-b border-border/50'}`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>

      {/* Left */}
      <div className="w-10">
        {showBack && (
          <Link href={backHref} className="flex items-center justify-center w-10 h-10 press-effect text-offwhite">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* Center */}
      <div className="flex-1 flex items-center justify-center">
        {showBrand ? (
          <span className="font-display text-xl font-semibold tracking-[0.15em] text-offwhite">
            KIEVOKIO
          </span>
        ) : title ? (
          <span className="font-body text-sm font-medium tracking-wide text-offwhite">{title}</span>
        ) : null}
      </div>

      {/* Right */}
      <div className="w-10 flex justify-end">
        {rightAction || (
          <Link href="/notifications" className="relative flex items-center justify-center w-10 h-10 press-effect text-offwhite">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unread > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold" />
            )}
          </Link>
        )}
      </div>
    </header>
  )
}
