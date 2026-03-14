import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { capturePaypalOrder } from '@/lib/paypal'

/**
 * POST /api/payment/paypal/capture
 * Body: { orderId: string, bookingId: number }
 * Capture le paiement PayPal et met à jour la réservation
 */
export async function POST(req: NextRequest) {
  try {
    const { orderId, bookingId } = await req.json()

    const { status } = await capturePaypalOrder(orderId)

    if (status === 'COMPLETED') {
      await prisma.booking.update({
        where: { id: parseInt(bookingId) },
        data:  { status: 'confirmed' },
      })
      return NextResponse.json({ success: true, status })
    }

    return NextResponse.json({ success: false, status }, { status: 400 })
  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json({ error: 'Erreur lors de la capture PayPal' }, { status: 500 })
  }
}
