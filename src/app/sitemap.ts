import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mimounrifcar.ma'
const locales = ['en', 'fr', 'ar', 'es']

async function getCars() {
  try {
    return await prisma.car.findMany({
      where: { status: 'available' },
      select: { id: true, updatedAt: true },
    })
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cars = await getCars()

  // Static pages (homepage, about, cars listing, contact, faq, legal pages)
  const staticPages = [
    '',
    '/about',
    '/cars',
    '/contact',
    '/faq',
    '/legal/terms',
    '/legal/privacy',
  ]

  // Create entries for all locale variations of static pages
  const staticEntries: MetadataRoute.Sitemap = []
  for (const page of staticPages) {
    for (const locale of locales) {
      staticEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : 0.8,
      })
    }
  }

  // Create entries for dynamic car pages
  const carEntries: MetadataRoute.Sitemap = cars.flatMap((car) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/cars/${car.id}`,
      lastModified: new Date(car.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  )

  return [...staticEntries, ...carEntries]
}
