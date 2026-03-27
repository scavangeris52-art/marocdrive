import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const car = await prisma.car.findUnique({
      where: { id: parseInt(id) },
      include: { images: true },
    })
    if (!car) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(car)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdminAuth(req)
  if (authError) return authError

  try {
    const { id } = await params
    const data = await req.json()

    const { updateCarSchema } = await import('@/lib/validations')
    const parsed = updateCarSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const car = await prisma.car.update({
      where: { id: parseInt(id) },
      data: parsed.data,
    })
    return NextResponse.json(car)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Protect DELETE route - requires admin authentication
  const authError = await requireAdminAuth(req)
  if (authError) return authError

  try {
    const { id } = await params
    await prisma.car.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
