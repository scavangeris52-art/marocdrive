import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { createBookingSchema } from '@/lib/validations'
import { sendBookingConfirmation } from '@/lib/email'

export async function GET(req: NextRequest) {
  const authError = await requireAdminAuth(req)
  if (authError) return authError

  try {
    const bookings = await prisma.booking.findMany({
      include: { car: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Zod validation
    const parsed = createBookingSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const { name, email, phone, pickupDate, returnDate, pickupCity, carId, notes, lang } = parsed.data
    const pickup = new Date(pickupDate)
    const returnD = new Date(returnDate)

    // Check vehicle availability - prevent double-booking
    const existingBookings = await prisma.booking.findMany({
      where: {
        carId: carId,
        status: { not: 'cancelled' },
      },
    })

    const isAvailable = !existingBookings.some((b) => {
      const bPickup = new Date(b.pickupDate)
      const bReturn = new Date(b.returnDate)
      return !(returnD <= bPickup || pickup >= bReturn)
    })

    if (!isAvailable) {
      return NextResponse.json(
        { error: 'Le véhicule n\'est pas disponible pour les dates sélectionnées' },
        { status: 409 }
      )
    }

    // Calculate total price
    const car = await prisma.car.findUnique({ where: { id: carId } })
    if (!car) {
      return NextResponse.json({ error: 'Véhicule introuvable' }, { status: 404 })
    }
    const days = Math.max(1, Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)))
    const totalPrice = days * car.price

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone,
        pickupDate: pickup,
        returnDate: returnD,
        pickupCity: pickupCity || 'Nador',
        carId,
        notes: notes || '',
        lang: lang || 'fr',
        totalPrice,
      },
    })

    // Send confirmation email (non-blocking)
    sendBookingConfirmation({
      to: email,
      customerName: name,
      carName: `${car.brand} ${car.model}`,
      pickupDate: pickup.toLocaleDateString('fr-FR'),
      returnDate: returnD.toLocaleDateString('fr-FR'),
      pickupCity: pickupCity || 'Nador',
      totalPrice,
      bookingId: booking.id,
    }).catch((err) => console.error('Email error:', err))

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Erreur lors de la création de la réservation' }, { status: 500 })
  }
}
