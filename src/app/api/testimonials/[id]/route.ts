import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { testimonialSchema } from '@/lib/validations'

/**
 * PUT /api/testimonials/[id]
 * Admin only - update a testimonial
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Protect PUT route - requires admin authentication
  const authError = await requireAdminAuth(req)
  if (authError) return authError

  try {
    const { id } = await params
    const data = await req.json()

    // Validate input (partial validation for update)
    const validationResult = testimonialSchema.partial().safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: validationResult.data,
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Témoignage non trouvé' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

/**
 * DELETE /api/testimonials/[id]
 * Admin only - delete a testimonial
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Protect DELETE route - requires admin authentication
  const authError = await requireAdminAuth(req)
  if (authError) return authError

  try {
    const { id } = await params
    await prisma.testimonial.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return NextResponse.json({ error: 'Témoignage non trouvé' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
