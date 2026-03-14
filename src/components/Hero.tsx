'use client'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center text-center text-white overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #1a2d4a 100%)',
      }}
    >
      {/* Decorative bg pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #d4a44c 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #d4a44c 0%, transparent 40%)`
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#d4a44c] mb-6">
          Nador, Maroc
        </p>

        <h1 className="font-['Lora'] text-5xl md:text-7xl font-bold leading-tight mb-2">
          <em className="italic">{t('title')}</em>
        </h1>
        <h1 className="font-['Lora'] text-5xl md:text-7xl font-bold leading-tight mb-8">
          <em className="italic text-[#d4a44c]">{t('titleLine2')}</em>
        </h1>

        {/* Gold line */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-px w-20 bg-[#d4a44c]" />
          <div className="mx-3 w-2 h-2 rotate-45 bg-[#d4a44c]" />
          <div className="h-px w-20 bg-[#d4a44c]" />
        </div>

        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/cars`}
            className="px-8 py-4 bg-[#d4a44c] text-[#0a1628] font-bold tracking-widest uppercase text-sm hover:bg-[#c4943c] transition-colors"
          >
            {t('cta')}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="px-8 py-4 border border-[#d4a44c] text-[#d4a44c] font-semibold tracking-widest uppercase text-sm hover:bg-[#d4a44c]/10 transition-colors"
          >
            {t('cta2')}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#d4a44c]" />
      </div>
    </section>
  )
}
