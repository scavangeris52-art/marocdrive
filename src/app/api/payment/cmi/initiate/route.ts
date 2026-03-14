import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { buildCmiFormParams } from '@/lib/cmi'

/**
 * POST /api/payment/cmi/initiate
 * Body: { bookingId: number }
 * Retourne les paramètres du formulaire à soumettre au gateway CMI
 */
export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json()

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { car: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const oid = `MRC-${booking.id}-${Date.now()}`

    const formParams = buildCmiFormParams({
      amount:      booking.totalPrice.toFixed(2),
      oid,
      okUrl:       `${appUrl}/payment/success?method=cmi&bookingId=${booking.id}`,
      failUrl:     `${appUrl}/payment/fail?method=cmi&bookingId=${booking.id}`,
      callbackUrl: `${appUrl}/api/payment/cmi/callback`,
      email:       booking.email,
      lang:        booking.lang ?? 'fr',
      currency:    '504',
    })

    return NextResponse.json({
      gatewayUrl: process.env.CMI_BASE_URL,
      formParams,
    })
  } catch (error) {
    console.error('CMI initiate error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
