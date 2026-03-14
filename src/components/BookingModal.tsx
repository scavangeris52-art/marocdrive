'use client'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { FaTimes } from 'react-icons/fa'

interface Car {
  id: number
  brand: string
  model: string
  price: number
}

interface BookingModalProps {
  car: Car
  onClose: () => void
}

export default function BookingModal({ car, onClose }: BookingModalProps) {
  const t = useTranslations('booking')
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    pickupDate: '',
    returnDate: '',
    pickupCity: 'nador',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, carId: car.id, lang: locale }),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-['Lora'] text-xl font-bold text-[#0a1628]">{t('title')}</h2>
            <p className="text-sm text-[#d4a44c] font-semibold">{car.brand} {car.model} — {car.price} MAD/jour</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-[#0a1628] font-semibold">{t('success')}</p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-[#0a1628] text-[#d4a44c] text-sm font-semibold tracking-widest uppercase"
            >
              {t('close')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {['name', 'email', 'phone'].map((field) => (
              <div key={field}>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">
                  {t(field as any)}
                </label>
                <input
                  required
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                  value={(form as any)[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#d4a44c]"
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              {(['pickupDate', 'returnDate'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">
                    {t(field === 'pickupDate' ? 'pickup' : 'return')}
                  </label>
                  <input
                    required
                    type="date"
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#d4a44c]"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">
                {t('city')}
              </label>
              <select
                value={form.pickupCity}
                onChange={(e) => setForm({ ...form, pickupCity: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#d4a44c]"
              >
                {(['nador', 'oujda', 'berkane', 'selouane', 'arouit'] as const).map((c) => (
                  <option key={c} value={c}>{t(`cities.${c}`)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">
                {t('notes')}
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#d4a44c] resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#d4a44c] text-[#0a1628] font-bold tracking-widest uppercase text-sm hover:bg-[#c4943c] transition-colors disabled:opacity-50"
            >
              {loading ? '...' : t('submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
