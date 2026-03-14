import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPaypalOrder } from '@/lib/paypal'

/**
 * POST /api/payment/paypal/create-order
 * Body: { bookingId: number }
 * Retourne { approvalUrl } → rediriger le client vers cette URL
 */
export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json()

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    // Conversion MAD → EUR (taux approximatif : 1 EUR ≈ 10.8 MAD)
    const amountEur = booking.totalPrice / 10.8

    const { id, approvalUrl } = await createPaypalOrder({
      amount:    amountEur,
      currency:  'EUR',
      bookingId: booking.id,
      returnUrl: `${appUrl}/payment/success?method=paypal&bookingId=${booking.id}&token={{TOKEN}}`,
      cancelUrl: `${appUrl}/payment/fail?method=paypal&bookingId=${booking.id}`,
    })

    // Sauvegarder l'order ID PayPal pour la capture
    await prisma.booking.update({
      where: { id: bookingId },
      data:  { notes: `[paypal_order:${id}] ${booking.notes ?? ''}`.trim() },
    })

    return NextResponse.json({ approvalUrl, orderId: id })
  } catch (error) {
    console.error('PayPal create-order error:', error)
    return NextResponse.json({ error: 'Erreur PayPal' }, { status: 500 })
  }
}
