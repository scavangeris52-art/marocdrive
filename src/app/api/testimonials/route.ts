import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { testimonialSchema } from '@/lib/validations'

/**
 * GET /api/testimonials
 * Public endpoint - fetch active testimonials
 */
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(testimonials)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération des témoignages' }, { status: 500 })
  }
}

/**
 * POST /api/testimonials
 * Admin only - create a new testimonial
 */
export async function POST(req: NextRequest) {
  // Protect POST route - requires admin authentication
  const authError = await requireAdminAuth(req)
  if (authError) return authError

  try {
    const data = await req.json()

    // Validate input
    const validationResult = testimonialSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const testimonial = await prisma.testimonial.create({
      data: validationResult.data,
    })

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création du témoignage' }, { status: 500 })
  }
}
