'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SuccessContent() {
  const params     = useSearchParams()
  const method     = params.get('method')    // 'cmi' | 'paypal'
  const bookingId  = params.get('bookingId')
  const token      = params.get('token')     // PayPal token
  const [captured, setCaptured] = useState<boolean | null>(null)

  useEffect(() => {
    // Pour PayPal : capturer le paiement côté serveur
    if (method === 'paypal' && token && bookingId) {
      fetch('/api/payment/paypal/capture', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ orderId: token, bookingId: parseInt(bookingId) }),
      })
        .then(r => r.json())
        .then(d => setCaptured(d.success))
        .catch(() => setCaptured(false))
    } else {
      setCaptured(true) // CMI : déjà confirmé par callback serveur
    }
  }, [method, token, bookingId])

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>

        {captured === null ? (
          <p style={{ color: '#999', fontSize: '15px' }}>Validation du paiement...</p>
        ) : captured ? (
          <>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
            <h1 style={{ fontFamily: 'Georgia, serif', color: '#0a1628', fontSize: '26px', marginBottom: '8px' }}>
              Paiement confirmé !
            </h1>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '8px' }}>
              Votre réservation <strong>#{bookingId}</strong> a bien été reçue.
            </p>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '32px' }}>
              Méthode : {method === 'paypal' ? '💳 PayPal' : '🏦 CMI'}
            </p>
            <p style={{ color: '#d4a44c', fontSize: '13px', marginBottom: '32px' }}>
              Un email de confirmation vous sera envoyé. Notre équipe vous contactera pour finaliser la remise du véhicule.
            </p>
            <Link href="/"
              style={{ display: 'inline-block', padding: '12px 32px', background: '#d4a44c', color: '#0a1628', fontWeight: 700, textDecoration: 'none', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Retour à l&apos;accueil
            </Link>
          </>
        ) : (
          <>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>⚠️</div>
            <h1 style={{ fontFamily: 'Georgia, serif', color: '#0a1628', fontSize: '22px', marginBottom: '8px' }}>
              Problème de confirmation
            </h1>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '24px' }}>
              Le paiement a peut-être été effectué mais nous n&apos;avons pas pu le confirmer automatiquement. Contactez-nous avec votre numéro de réservation <strong>#{bookingId}</strong>.
            </p>
            <Link href="/fr/contact"
              style={{ display: 'inline-block', padding: '12px 32px', background: '#0a1628', color: '#d4a44c', fontWeight: 700, textDecoration: 'none', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Nous contacter
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
