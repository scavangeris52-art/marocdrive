'use client'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch } from 'react-icons/fa'

export default function BookingWidget() {
  const t = useTranslations('booking')
  const locale = useLocale()
  const router = useRouter()

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [form, setForm] = useState({
    city: 'nador',
    pickupDate: today,
    returnDate: tomorrow,
  })

  const handleSearch = () => {
    router.push(`/${locale}/cars`)
  }

  const cities = ['nador', 'oujda', 'berkane', 'selouane', 'arouit'] as const

  return (
    <section className="relative z-20 px-4">
      <div className="max-w-4xl mx-auto -mt-10 bg-white shadow-2xl border-t-4 border-[#d4a44c] p-6">
        <p className="text-center text-xs font-semibold tracking-[0.3em] uppercase text-[#d4a44c] mb-5">
          {t('widgetTitle')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Ville */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">
              <FaMapMarkerAlt size={10} className="text-[#d4a44c]" />
              {t('city')}
            </label>
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#d4a44c] bg-white text-[#0a1628]"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {t(`cities.${c}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Date de départ */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">
              <FaCalendarAlt size={10} className="text-[#d4a44c]" />
              {t('pickup')}
            </label>
            <input
              type="date"
              min={today}
              value={form.pickupDate}
              onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#d4a44c] text-[#0a1628]"
            />
          </div>

          {/* Date de retour */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">
              <FaCalendarAlt size={10} className="text-[#d4a44c]" />
              {t('return')}
            </label>
            <input
              type="date"
              min={form.pickupDate}
              value={form.returnDate}
              onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#d4a44c] text-[#0a1628]"
            />
          </div>

          {/* Bouton */}
          <button
            onClick={handleSearch}
            className="w-full py-2.5 bg-[#d4a44c] text-[#0a1628] font-bold tracking-widest uppercase text-sm hover:bg-[#c4943c] transition-colors flex items-center justify-center gap-2"
          >
            <FaSearch size={13} />
            {t('search')}
          </button>
        </div>
      </div>
    </section>
  )
}
