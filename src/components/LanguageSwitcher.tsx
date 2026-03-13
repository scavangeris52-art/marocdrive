'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { locales } from '@/i18n/config'

const labels: Record<string, string> = {
  en: 'EN',
  fr: 'FR',
  ar: 'AR',
  es: 'ES',
}

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-1">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-2 py-1 text-xs font-semibold tracking-widest uppercase transition-colors ${
            l === locale
              ? 'text-[#d4a44c] border-b border-[#d4a44c]'
              : 'text-white/60 hover:text-[#d4a44c]'
          }`}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  )
}
