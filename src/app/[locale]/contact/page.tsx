'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import GoldLine from '@/components/GoldLine'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa'

export default function ContactPage() {
  const t = useTranslations('contact')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { icon: FaPhone, label: '+212 6 67 42 25 52', href: 'tel:+212667422552' },
    { icon: FaPhone, label: '+212 6 27 56 79 77', href: 'tel:+212627567977' },
    { icon: FaEnvelope, label: 'contact@mimounrifcar.ma', href: 'mailto:contact@mimounrifcar.ma' },
    { icon: FaMapMarkerAlt, label: 'Bouyafar 62022, Maroc', href: 'https://maps.google.com/?q=35.2530031,-3.1145019' },
    { icon: FaClock, label: '08:00–20:00 tous les jours', href: '#' },
  ]

  return (
    <div className="min-h-screen bg-[#111111]">
      <section className="bg-[#0d0d0d] py-16 text-center border-b border-[#cc0000]/20">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#cc0000] mb-2">MimounRifCar</p>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }} className="text-5xl text-white">{t('title')}</h1>
        <GoldLine />
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          {success ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-white font-semibold text-lg">{t('success')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { field: 'name', type: 'text' },
                { field: 'email', type: 'email' },
                { field: 'phone', type: 'tel' },
              ].map(({ field, type }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-white/50 mb-1">
                    {t(field as any)}
                  </label>
                  <input
                    required={field !== 'phone'}
                    type={type}
                    value={(form as any)[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full border border-white/10 px-3 py-2 text-sm bg-white/5 text-white focus:outline-none focus:border-[#cc0000]"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-white/50 mb-1">
                  {t('message')}
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-white/10 px-3 py-2 text-sm bg-white/5 text-white focus:outline-none focus:border-[#cc0000] resize-none"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#cc0000] text-white font-bold tracking-widest uppercase text-sm hover:bg-[#aa0000] transition-colors disabled:opacity-50"
              >
                {loading ? '...' : t('send')}
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#cc0000] mb-4">
              {t('address')} & {t('hours')}
            </h3>
            <div className="space-y-3">
              {contactInfo.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-start gap-3 text-sm text-white/60 hover:text-[#cc0000] transition-colors"
                >
                  <item.icon className="text-[#cc0000] mt-0.5 flex-shrink-0" size={14} />
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* WhatsApp */}
          <div className="bg-[#0d0d0d] border border-[#cc0000]/20 p-6 text-white">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#cc0000] mb-3">WhatsApp</p>
            <p className="text-white/70 text-sm mb-4">Pour une réponse immédiate, contactez-nous sur WhatsApp.</p>
            <a
              href="https://wa.me/212667422552"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20ba57] transition-colors"
            >
              Ouvrir WhatsApp
            </a>
          </div>

          {/* Google Maps */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#cc0000] mb-3">
              Notre localisation
            </h3>
            <div className="border border-[#cc0000]/20 overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=35.2530031,-3.1145019&z=19&output=embed"
                width="100%"
                height="220"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Mimoun Rif Car — Bouyafar, Maroc"
              />
            </div>
            <a
              href="https://maps.google.com/?q=35.2530031,-3.1145019"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-2 text-xs text-white/40 hover:text-[#cc0000] transition-colors"
            >
              <FaMapMarkerAlt size={11} /> Ouvrir dans Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
