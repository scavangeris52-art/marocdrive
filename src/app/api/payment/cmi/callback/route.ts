import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

/**
 * POST /api/payment/cmi/callback
 * Callback serveur-à-serveur envoyé par CMI après paiement
 * CMI attend la réponse "ACTION=POSTAUTH" ou "APPROVED"
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const params = new URLSearchParams(body)

    const procReturnCode = params.get('ProcReturnCode')  // '00' = succès
    const mdStatus       = params.get('mdStatus')         // '1' = auth 3D OK
    const oid            = params.get('oid') ?? ''        // ex: MRC-42-1712345678
    const hashParam      = params.get('hash') ?? ''

    // Extraire le bookingId depuis l'oid (format MRC-{id}-{timestamp})
    const bookingId = parseInt(oid.split('-')[1] ?? '0')

    // Vérifier la signature (hash de contrôle)
    const storeKey = process.env.CMI_STORE_KEY!
    const verifyStr = [
      params.get('clientid'),
      params.get('oid'),
      params.get('AuthCode'),
      params.get('ProcReturnCode'),
      params.get('Response'),
      params.get('mdStatus'),
      params.get('cavv'),
      params.get('eci'),
      params.get('md'),
      params.get('rnd'),
      storeKey,
    ].join('|')

    const expectedHash = crypto.createHash('sha512').update(verifyStr, 'utf8').digest('base64')

    if (hashParam !== expectedHash) {
      console.warn('CMI callback: hash invalide')
      return new NextResponse('ACTION=FAILURE', { status: 200 })
    }

    // Paiement réussi
    if (procReturnCode === '00' && mdStatus === '1') {
      await prisma.booking.update({
        where: { id: bookingId },
        data:  { status: 'confirmed' },
      })
      return new NextResponse('ACTION=POSTAUTH', { status: 200 })
    }

    // Paiement échoué
    await prisma.booking.update({
      where: { id: bookingId },
      data:  { status: 'cancelled' },
    })
    return new NextResponse('ACTION=FAILURE', { status: 200 })

  } catch (error) {
    console.error('CMI callback error:', error)
    return new NextResponse('ACTION=FAILURE', { status: 200 })
  }
}
