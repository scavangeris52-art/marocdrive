'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { locales } from '@/i18n/config'
import { useState, useRef, useEffect } from 'react'
import { FaChevronDown, FaGlobe } from 'react-icons/fa'

const labels: Record<string, string> = {
  en: '🇬🇧 EN',
  fr: '🇫🇷 FR',
  ar: '🇸🇦 AR',
  es: '🇪🇸 ES',
}

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setOpen(false)
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-[#d4a44c]/40 text-xs font-semibold tracking-widest text-white/80 hover:text-[#d4a44c] hover:border-[#d4a44c] transition-colors"
      >
        <FaGlobe size={11} className="text-[#d4a44c]" />
        {labels[locale]}
        <FaChevronDown size={9} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-32 bg-[#0a1628] border border-[#d4a44c]/30 shadow-xl z-50">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className={`w-full text-left px-3 py-2 text-xs font-semibold tracking-widest transition-colors ${
                l === locale
                  ? 'text-[#d4a44c] bg-[#d4a44c]/10'
                  : 'text-white/70 hover:text-[#d4a44c] hover:bg-white/5'
              }`}
            >
              {labels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
