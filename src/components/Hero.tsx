'use client'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const t = useTranslations('hero')
  const tb = useTranslations('booking')
  const locale = useLocale()
  const router = useRouter()

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
  const [form, setForm] = useState({ city: 'nador', pickupDate: today, returnDate: tomorrow })
  const cities = ['nador', 'oujda', 'berkane', 'selouane', 'arouit'] as const

  return (
    <section
      className="relative flex items-center justify-center text-center text-white overflow-hidden pb-16 pt-24"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #1a2d4a 100%)' }}
    >
      {/* Decorative bg pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #d4a44c 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #d4a44c 0%, transparent 40%)`
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
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

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
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

        {/* Booking widget */}
        <div className="bg-white/10 backdrop-blur-sm border border-[#d4a44c]/30 p-6 max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#d4a44c] mb-5">
            {tb('widgetTitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold tracking-widest uppercase text-white/60 mb-1">
                <FaMapMarkerAlt size={10} className="text-[#d4a44c]" /> {tb('city')}
              </label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border border-white/20 bg-white/10 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#d4a44c]"
              >
                {cities.map((c) => (
                  <option key={c} value={c} className="text-[#0a1628]">{tb(`cities.${c}`)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold tracking-widest uppercase text-white/60 mb-1">
                <FaCalendarAlt size={10} className="text-[#d4a44c]" /> {tb('pickup')}
              </label>
              <input
                type="date" min={today} value={form.pickupDate}
                onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
                className="w-full border border-white/20 bg-white/10 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#d4a44c]"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold tracking-widest uppercase text-white/60 mb-1">
                <FaCalendarAlt size={10} className="text-[#d4a44c]" /> {tb('return')}
              </label>
              <input
                type="date" min={form.pickupDate} value={form.returnDate}
                onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                className="w-full border border-white/20 bg-white/10 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#d4a44c]"
              />
            </div>
            <button
              onClick={() => router.push(`/${locale}/cars`)}
              className="w-full py-2.5 bg-[#d4a44c] text-[#0a1628] font-bold tracking-widest uppercase text-sm hover:bg-[#c4943c] transition-colors flex items-center justify-center gap-2"
            >
              <FaSearch size={13} /> {tb('search')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
