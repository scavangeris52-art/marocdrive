import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
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
    const { name, email, phone, pickupDate, returnDate, pickupCity, carId, notes, lang } = data

    // Calcul automatique du prix total
    const car = await prisma.car.findUnique({ where: { id: parseInt(carId) } })
    const pickup = new Date(pickupDate)
    const returnD = new Date(returnDate)
    const days = Math.max(1, Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)))
    const totalPrice = days * (car?.price || 0)

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone,
        pickupDate: pickup,
        returnDate: returnD,
        pickupCity: pickupCity || 'Nador',
        carId: parseInt(carId),
        notes: notes || '',
        lang: lang || 'fr',
        totalPrice,
      },
    })
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
