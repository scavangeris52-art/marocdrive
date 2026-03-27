/**
 * Authentication middleware for admin API routes
 * Ensures only authenticated admin users can access protected endpoints
 */

import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from './auth'

/**
 * Middleware function to check admin authentication
 * Returns 401 if not authenticated, 403 if not admin
 * Returns null if authenticated and authorized
 */
export async function requireAdminAuth(req: NextRequest): Promise<NextResponse | null> {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if ((session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès refusé - Privilèges administrateur requis' },
        { status: 403 }
      )
    }

    // Authentication passed
    return null
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur d\'authentification' },
      { status: 500 }
    )
  }
}
