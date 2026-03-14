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

type Step = 'form' | 'payment' | 'success'

export default function BookingModal({ car, onClose }: BookingModalProps) {
  const t = useTranslations('booking')
  const locale = useLocale()

  const [step, setStep]         = useState<Step>('form')
  const [bookingId, setBookingId] = useState<number | null>(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading]   = useState(false)
  const [payLoading, setPayLoading] = useState<'cmi' | 'paypal' | null>(null)
  const [error, setError]       = useState('')

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    pickupDate: '', returnDate: '',
    pickupCity: 'nador', notes: '',
  })

  // Calcul durée / prix affiché
  const days = form.pickupDate && form.returnDate
    ? Math.max(1, Math.ceil((new Date(form.returnDate).getTime() - new Date(form.pickupDate).getTime()) / 86400000))
    : 0
  const estimated = days * car.price

  /* ─── ÉTAPE 1 : soumettre le formulaire ─── */
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
      const booking = await res.json()
      setBookingId(booking.id)
      setTotalPrice(booking.totalPrice)
      setStep('payment')
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }

  /* ─── ÉTAPE 2a : paiement CMI ─── */
  const handleCmiPay = async () => {
    if (!bookingId) return
    setPayLoading('cmi')
    try {
      const res = await fetch('/api/payment/cmi/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      })
      const { gatewayUrl, formParams } = await res.json()

      // Créer un formulaire caché et le soumettre vers le gateway CMI
      const form_ = document.createElement('form')
      form_.method = 'POST'
      form_.action = gatewayUrl
      Object.entries(formParams).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value as string
        form_.appendChild(input)
      })
      document.body.appendChild(form_)
      form_.submit()
    } catch {
      setError('Erreur lors de la connexion au gateway CMI.')
      setPayLoading(null)
    }
  }

  /* ─── ÉTAPE 2b : paiement PayPal ─── */
  const handlePaypalPay = async () => {
    if (!bookingId) return
    setPayLoading('paypal')
    try {
      const res = await fetch('/api/payment/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      })
      const { approvalUrl } = await res.json()
      if (approvalUrl) {
        window.location.href = approvalUrl
      } else {
        throw new Error()
      }
    } catch {
      setError('Erreur lors de la connexion à PayPal.')
      setPayLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-['Lora'] text-xl font-bold text-[#0a1628]">{t('title')}</h2>
            <p className="text-sm text-[#d4a44c] font-semibold">{car.brand} {car.model} — {car.price} MAD/jour</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
        </div>

        {/* ─── ÉTAPE : FORMULAIRE ─── */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {['name', 'email', 'phone'].map((field) => (
              <div key={field}>
                <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">{t(field as any)}</label>
                <input required
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
                  <input required type="date"
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#d4a44c]"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">{t('city')}</label>
              <select value={form.pickupCity} onChange={(e) => setForm({ ...form, pickupCity: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#d4a44c]">
                {(['nador', 'oujda', 'berkane', 'selouane', 'arouit'] as const).map((c) => (
                  <option key={c} value={c}>{t(`cities.${c}`)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">{t('notes')}</label>
              <textarea rows={2} value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#d4a44c] resize-none"
              />
            </div>

            {/* Résumé prix */}
            {days > 0 && (
              <div className="bg-[#fdf8f0] border border-[#d4a44c]/30 p-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">{days} jour{days > 1 ? 's' : ''} × {car.price} MAD</span>
                <span className="font-bold text-[#d4a44c] text-lg">{estimated.toLocaleString('fr-FR')} MAD</span>
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#d4a44c] text-[#0a1628] font-bold tracking-widest uppercase text-sm hover:bg-[#c4943c] transition-colors disabled:opacity-50">
              {loading ? '...' : 'Continuer vers le paiement →'}
            </button>
          </form>
        )}

        {/* ─── ÉTAPE : CHOIX DU PAIEMENT ─── */}
        {step === 'payment' && (
          <div className="p-6 space-y-5">
            {/* Résumé */}
            <div className="bg-[#fdf8f0] border border-[#d4a44c]/30 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Récapitulatif · Réservation #{bookingId}</p>
              <p className="font-semibold text-[#0a1628]">{car.brand} {car.model}</p>
              <p className="text-[#d4a44c] font-bold text-xl mt-1">{totalPrice.toLocaleString('fr-FR')} MAD</p>
            </div>

            <p className="text-sm text-gray-600 font-medium text-center">Choisissez votre méthode de paiement</p>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Bouton CMI */}
            <button onClick={handleCmiPay} disabled={payLoading !== null}
              className="w-full flex items-center gap-4 px-5 py-4 border-2 border-[#0a1628] hover:bg-[#0a1628] hover:text-white transition-all group disabled:opacity-50">
              <span className="text-2xl">🏦</span>
              <div className="text-left">
                <p className="font-bold text-sm tracking-wide">Carte bancaire (CMI)</p>
                <p className="text-xs text-gray-500 group-hover:text-white/70">Visa, Mastercard, CIH, Attijariwafa...</p>
              </div>
              {payLoading === 'cmi' && <span className="ml-auto text-sm">...</span>}
            </button>

            {/* Bouton PayPal */}
            <button onClick={handlePaypalPay} disabled={payLoading !== null}
              className="w-full flex items-center gap-4 px-5 py-4 border-2 border-[#003087] hover:bg-[#003087] hover:text-white transition-all group disabled:opacity-50">
              <span className="text-2xl">💳</span>
              <div className="text-left">
                <p className="font-bold text-sm tracking-wide text-[#003087] group-hover:text-white">PayPal</p>
                <p className="text-xs text-gray-500 group-hover:text-white/70">Paiement sécurisé via PayPal</p>
              </div>
              {payLoading === 'paypal' && <span className="ml-auto text-sm">...</span>}
            </button>

            <button onClick={() => { setStep('form'); setError('') }}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1">
              ← Modifier ma réservation
            </button>
          </div>
        )}

        {/* ─── ÉTAPE : SUCCÈS SANS PAIEMENT (fallback) ─── */}
        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-[#0a1628] font-semibold">{t('success')}</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-[#0a1628] text-[#d4a44c] text-sm font-semibold tracking-widest uppercase">
              {t('close')}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
