'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import GoldLine from '@/components/GoldLine'
import { FaChevronDown } from 'react-icons/fa'

export default function FaqPage() {
  const t = useTranslations('faq')
  const [open, setOpen] = useState<number | null>(null)

  const faqs = [1, 2, 3, 4].map((n) => ({
    q: t(`q${n}` as any),
    a: t(`a${n}` as any),
  }))

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <section className="bg-[#0a1628] py-16 text-center">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#d4a44c] mb-2">RafaSurLaLune</p>
        <h1 className="font-['Lora'] text-4xl md:text-5xl font-bold text-white">{t('title')}</h1>
        <GoldLine />
      </section>

      <div className="max-w-2xl mx-auto px-4 py-16 space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-gray-100 hover:border-[#d4a44c]/30 transition-colors">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="font-semibold text-[#0a1628] pr-4">{faq.q}</span>
              <FaChevronDown
                className={`text-[#d4a44c] flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                size={14}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                <p className="pt-3">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
