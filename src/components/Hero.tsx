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
      style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #1a0000 50%, #0d0d0d 100%)' }}
    >
      {/* Decorative bg pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #cc0000 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #cc0000 0%, transparent 40%)`
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#cc0000] mb-6">
          Nador, Maroc
        </p>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 8vw, 5.5rem)', letterSpacing: '0.08em', lineHeight: 1.1 }} className="mb-2">
          {t('title')}
        </h1>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 8vw, 5.5rem)', letterSpacing: '0.08em', lineHeight: 1.1 }} className="text-[#cc0000] mb-8">
          {t('titleLine2')}
        </h1>

        {/* Red line */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-px w-20 bg-[#cc0000]" />
          <div className="mx-3 w-2 h-2 rotate-45 bg-[#cc0000]" />
          <div className="h-px w-20 bg-[#cc0000]" />
        </div>

        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link
            href={`/${locale}/cars`}
            className="px-8 py-4 bg-[#cc0000] text-white font-bold tracking-widest uppercase text-sm hover:bg-[#aa0000] transition-colors"
          >
            {t('cta')}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="px-8 py-4 border border-[#cc0000] text-[#cc0000] font-semibold tracking-widest uppercase text-sm hover:bg-[#cc0000]/10 transition-colors"
          >
            {t('cta2')}
          </Link>
        </div>

        {/* Booking widget */}
        <div className="bg-white/5 backdrop-blur-sm border border-[#cc0000]/30 p-6 max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#cc0000] mb-5">
            {tb('widgetTitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold tracking-widest uppercase text-white/60 mb-1">
                <FaMapMarkerAlt size={10} className="text-[#cc0000]" /> {tb('city')}
              </label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full border border-white/20 bg-white/10 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#cc0000]"
              >
                {cities.map((c) => (
                  <option key={c} value={c} className="text-[#0d0d0d]">{tb(`cities.${c}`)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold tracking-widest uppercase text-white/60 mb-1">
                <FaCalendarAlt size={10} className="text-[#cc0000]" /> {tb('pickup')}
              </label>
              <input
                type="date" min={today} value={form.pickupDate}
                onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
                className="w-full border border-white/20 bg-white/10 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#cc0000]"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold tracking-widest uppercase text-white/60 mb-1">
                <FaCalendarAlt size={10} className="text-[#cc0000]" /> {tb('return')}
              </label>
              <input
                type="date" min={form.pickupDate} value={form.returnDate}
                onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                className="w-full border border-white/20 bg-white/10 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-[#cc0000]"
              />
            </div>
            <button
              onClick={() => router.push(`/${locale}/cars`)}
              className="w-full py-2.5 bg-[#cc0000] text-white font-bold tracking-widest uppercase text-sm hover:bg-[#aa0000] transition-colors flex items-center justify-center gap-2"
            >
              <FaSearch size={13} /> {tb('search')}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
