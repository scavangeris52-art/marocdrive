/**
 * Utilitaire PayPal REST API v2 (Sandbox / Production)
 */

const BASE_URL = process.env.PAYPAL_BASE_URL ?? 'https://api-m.sandbox.paypal.com'

/** Récupère un access token OAuth2 */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const secret   = process.env.PAYPAL_CLIENT_SECRET!

  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${secret}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) throw new Error('PayPal: impossible de récupérer le token')
  const data = await res.json()
  return data.access_token
}

/** Crée une commande PayPal et retourne { id, approvalUrl } */
export async function createPaypalOrder(params: {
  amount: number      // en MAD → on convertit en EUR (ou USD)
  currency: string    // 'EUR' | 'USD'
  bookingId: number
  returnUrl: string
  cancelUrl: string
}): Promise<{ id: string; approvalUrl: string }> {
  const token = await getAccessToken()

  const res = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: `booking_${params.bookingId}`,
        amount: {
          currency_code: params.currency,
          value: params.amount.toFixed(2),
        },
        description: `MimounRifCar — Réservation #${params.bookingId}`,
      }],
      application_context: {
        brand_name:          'MimounRifCar',
        landing_page:        'NO_PREFERENCE',
        user_action:         'PAY_NOW',
        return_url:          params.returnUrl,
        cancel_url:          params.cancelUrl,
        shipping_preference: 'NO_SHIPPING',
      },
    }),
  })

  if (!res.ok) throw new Error('PayPal: impossible de créer la commande')
  const order = await res.json()

  const approvalUrl = order.links?.find((l: any) => l.rel === 'approve')?.href ?? ''
  return { id: order.id, approvalUrl }
}

/** Capture une commande PayPal approuvée */
export async function capturePaypalOrder(orderId: string): Promise<{ status: string }> {
  const token = await getAccessToken()

  const res = await fetch(`${BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error('PayPal: impossible de capturer la commande')
  const data = await res.json()
  return { status: data.status }
}
