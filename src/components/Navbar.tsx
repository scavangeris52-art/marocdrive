'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'
import { FaBars, FaTimes } from 'react-icons/fa'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [open, setOpen] = useState(false)

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/cars`, label: t('cars') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
    { href: `/${locale}/faq`, label: t('faq') },
  ]

  return (
    <nav className="sticky top-0 z-40 bg-[#0a1628] shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-xl font-bold tracking-widest text-white uppercase">
          <span className="text-[#d4a44c]">Mimoun</span>RifCar
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-semibold tracking-widest uppercase text-white/80 hover:text-[#d4a44c] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0a1628] border-t border-[#d4a44c]/20 px-4 pb-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-semibold tracking-widest uppercase text-white/80 hover:text-[#d4a44c] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </nav>
  )
}
