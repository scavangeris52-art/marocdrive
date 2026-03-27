import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Protect PUT route - requires admin authentication
  const authError = await requireAdminAuth(req)
  if (authError) return authError

  try {
    const { id } = await params
    const data = await req.json()
    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data,
    })
    return NextResponse.json(booking)
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
    await prisma.booking.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
