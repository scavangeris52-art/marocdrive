import crypto from 'crypto'

export interface CmiParams {
  amount: string        // ex: "350.00"
  oid: string           // order ID unique
  okUrl: string
  failUrl: string
  callbackUrl: string
  email: string
  lang?: string         // 'fr' | 'en' | 'ar'
  currency?: string     // '504' = MAD
  storetype?: string
}

/**
 * Calcule le hash HMAC-SHA512 pour CMI
 * Format: BASE64( SHA-512( val1 | val2 | ... | storekey ) )
 */
export function computeCmiHash(params: CmiParams): string {
  const storeKey = process.env.CMI_STORE_KEY!
  const clientId = process.env.CMI_CLIENT_ID!
  const rnd = Date.now().toString()

  const hashStr = [
    params.amount,
    clientId,
    params.currency ?? '504',
    params.email,
    params.failUrl,
    'SHA-512',          // hashAlgorithm
    params.lang ?? 'fr',
    params.okUrl,
    'Auth',             // payType
    rnd,
    '3D_PAY_HOSTING',   // storetype
    params.oid,
    storeKey,
  ].join('|')

  const hash = crypto.createHash('sha512').update(hashStr, 'utf8').digest('base64')
  return hash
}

/**
 * Construit les paramètres POST à envoyer au gateway CMI
 */
export function buildCmiFormParams(params: CmiParams): Record<string, string> {
  const rnd = Date.now().toString()
  const hash = computeCmiHash(params)

  return {
    clientid:      process.env.CMI_CLIENT_ID!,
    storetype:     '3D_PAY_HOSTING',
    amount:        params.amount,
    currency:      params.currency ?? '504',
    oid:           params.oid,
    okUrl:         params.okUrl,
    failUrl:       params.failUrl,
    callbackUrl:   params.callbackUrl,
    lang:          params.lang ?? 'fr',
    email:         params.email,
    hashAlgorithm: 'SHA-512',
    rnd,
    hash,
    encoding:      'UTF-8',
    payType:       'Auth',
    trantype:      'PreAuth',
  }
}
