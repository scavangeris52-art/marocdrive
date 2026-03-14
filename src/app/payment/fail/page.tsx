'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function FailContent() {
  const params    = useSearchParams()
  const method    = params.get('method')
  const bookingId = params.get('bookingId')

  return (
    <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>❌</div>
        <h1 style={{ fontFamily: 'Georgia, serif', color: '#0a1628', fontSize: '26px', marginBottom: '8px' }}>
          Paiement annulé
        </h1>
        <p style={{ color: '#555', fontSize: '14px', marginBottom: '8px' }}>
          Le paiement pour la réservation <strong>#{bookingId}</strong> n&apos;a pas abouti.
        </p>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '32px' }}>
          Méthode : {method === 'paypal' ? '💳 PayPal' : '🏦 CMI'}
        </p>
        <p style={{ color: '#555', fontSize: '13px', marginBottom: '32px' }}>
          Votre réservation a été annulée. Vous pouvez réessayer ou contacter notre équipe pour un paiement alternatif.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/fr/cars"
            style={{ display: 'inline-block', padding: '12px 28px', background: '#d4a44c', color: '#0a1628', fontWeight: 700, textDecoration: 'none', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Réessayer
          </Link>
          <Link href="/fr/contact"
            style={{ display: 'inline-block', padding: '12px 28px', background: 'transparent', border: '1px solid #0a1628', color: '#0a1628', fontWeight: 700, textDecoration: 'none', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentFailPage() {
  return (
    <Suspense>
      <FailContent />
    </Suspense>
  )
}
