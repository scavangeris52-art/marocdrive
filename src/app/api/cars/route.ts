import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'

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
  const authError = await requireAdminAuth(req)
  if (authError) return authError

  try {
    const data = await req.json()

    // Zod validation
    const { createCarSchema } = await import('@/lib/validations')
    const parsed = createCarSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const car = await prisma.car.create({ data: parsed.data })
    return NextResponse.json(car, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création du véhicule' }, { status: 500 })
  }
}
