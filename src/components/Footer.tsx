import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  const t = useTranslations('footer')
  const tn = useTranslations('nav')
  const locale = useLocale()

  return (
    <footer className="bg-[#0a1628] border-t-2 border-[#d4a44c] mt-0">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold tracking-widest text-white uppercase mb-2">
            <span className="text-[#d4a44c]">Mimoun</span>RifCar
          </h3>
          <p className="text-white/60 text-sm">{t('tagline')}</p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase text-[#d4a44c] mb-4">Navigation</h4>
          <div className="flex flex-col gap-2">
            {(['home', 'cars', 'about', 'contact', 'faq'] as const).map((key) => (
              <Link
                key={key}
                href={`/${locale}/${key === 'home' ? '' : key}`}
                className="text-sm text-white/60 hover:text-[#d4a44c] transition-colors"
              >
                {tn(key)}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase text-[#d4a44c] mb-4">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-white/60">
            <a href="tel:+212661234567" className="flex items-center gap-2 hover:text-[#d4a44c] transition-colors">
              <FaPhone size={12} /> +212 6 61 23 45 67
            </a>
            <a href="mailto:contact@mimounrifcar.ma" className="flex items-center gap-2 hover:text-[#d4a44c] transition-colors">
              <FaEnvelope size={12} /> contact@mimounrifcar.ma
            </a>
            <a
              href="https://wa.me/212661234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-[#d4a44c] transition-colors"
            >
              <FaWhatsapp size={12} /> WhatsApp
            </a>
            <span className="flex items-start gap-2">
              <FaMapMarkerAlt size={12} className="mt-0.5 flex-shrink-0" />
              15 Bd Mohammed V, Centre-ville, Nador 62000
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} MimounRifCar. {t('rights')}
        <a href="/admin" className="ml-3 text-white/10 hover:text-white/30 transition-colors" aria-label="Admin">·</a>
      </div>
    </footer>
  )
}
