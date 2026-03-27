import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { createContactMessageSchema } from '@/lib/validations'
import { sendContactNotification } from '@/lib/email'

export async function GET(req: NextRequest) {
  const authError = await requireAdminAuth(req)
  if (authError) return authError

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(messages)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Zod validation
    const parsed = createContactMessageSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.errors },
        { status: 400 }
      )
    }

    const { name, email, phone, message } = parsed.data

    const msg = await prisma.contactMessage.create({
      data: { name, email, phone: phone || '', message },
    })

    // Notify admin (non-blocking)
    sendContactNotification({ name, email, phone: phone || '', message })
      .catch((err) => console.error('Contact email error:', err))

    return NextResponse.json(msg, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de l\'envoi du message' }, { status: 500 })
  }
}
