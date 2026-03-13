import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const statusParam = searchParams.get('status')

    const where: Record<string, any> = {}
    if (category && category !== 'all') where.category = category
    if (featured === 'true') where.featured = true
    if (statusParam !== 'all') where.status = 'available'

    const cars = await prisma.car.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(cars)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const car = await prisma.car.create({ data })
    return NextResponse.json(car, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 })
  }
}
