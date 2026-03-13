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
    { icon: FaPhone, label: '+212 6 61 23 45 67', href: 'tel:+212661234567' },
    { icon: FaEnvelope, label: 'contact@marocdrive.ma', href: 'mailto:contact@marocdrive.ma' },
    { icon: FaMapMarkerAlt, label: '123 Av. Mohammed V, Gueliz, Marrakech 40000', href: '#' },
    { icon: FaClock, label: '08:00–20:00 tous les jours', href: '#' },
  ]

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <section className="bg-[#0a1628] py-16 text-center">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#d4a44c] mb-2">MarocDrive</p>
        <h1 className="font-['Lora'] text-4xl md:text-5xl font-bold text-white">{t('title')}</h1>
        <GoldLine />
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          {success ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-[#0a1628] font-semibold text-lg">{t('success')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { field: 'name', type: 'text' },
                { field: 'email', type: 'email' },
                { field: 'phone', type: 'tel' },
              ].map(({ field, type }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">
                    {t(field as any)}
                  </label>
                  <input
                    required={field !== 'phone'}
                    type={type}
                    value={(form as any)[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#d4a44c]"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">
                  {t('message')}
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#d4a44c] resize-none"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#d4a44c] text-[#0a1628] font-bold tracking-widest uppercase text-sm hover:bg-[#c4943c] transition-colors disabled:opacity-50"
              >
                {loading ? '...' : t('send')}
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#d4a44c] mb-4">
              {t('address')} & {t('hours')}
            </h3>
            <div className="space-y-3">
              {contactInfo.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="flex items-start gap-3 text-sm text-gray-600 hover:text-[#d4a44c] transition-colors"
                >
                  <item.icon className="text-[#d4a44c] mt-0.5 flex-shrink-0" size={14} />
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="bg-[#0a1628] p-6 text-white">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#d4a44c] mb-3">WhatsApp</p>
            <p className="text-white/70 text-sm mb-4">Pour une réponse immédiate, contactez-nous sur WhatsApp.</p>
            <a
              href="https://wa.me/212661234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20ba57] transition-colors"
            >
              Ouvrir WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
