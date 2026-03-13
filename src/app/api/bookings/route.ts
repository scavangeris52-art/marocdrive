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

    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone,
        pickupDate: new Date(pickupDate),
        returnDate: new Date(returnDate),
        pickupCity: pickupCity || 'Marrakech',
        carId: parseInt(carId),
        notes: notes || '',
        lang: lang || 'en',
      },
    })
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
