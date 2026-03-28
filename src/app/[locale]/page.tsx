import { getTranslations, getLocale } from 'next-intl/server'
import Hero from '@/components/Hero'
import GoldLine from '@/components/GoldLine'
import CarCard from '@/components/CarCard'
import { prisma } from '@/lib/prisma'

async function getFeaturedCars() {
  try {
    return await prisma.car.findMany({ where: { featured: true, status: 'available' }, take: 6 })
  } catch {
    return []
  }
}

async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const t = await getTranslations()
  const locale = await getLocale()
  const cars = await getFeaturedCars()
  const testimonials = await getTestimonials()

  const stats = [
    { label: t('stats.vehicles') },
    { label: t('stats.clients') },
    { label: t('stats.years') },
    { label: t('stats.support') },
  ]

  return (
    <div>
      <Hero />

      {/* Stats */}
      <section className="bg-[#0d0d0d] border-y border-[#cc0000]/20 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-[#cc0000] font-bold text-xl">{s.label.split(' ')[0]}</p>
              <p className="text-white/60 text-xs tracking-widest uppercase">{s.label.split(' ').slice(1).join(' ')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20 bg-[#111111]">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#cc0000] text-center mb-2">
            {t('cars.title')}
          </p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }} className="text-4xl md:text-5xl text-white text-center mb-2">
            {t('cars.title')}
          </h2>
          <GoldLine />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#cc0000] text-center mb-2">
            {t('testimonials')}
          </p>
          <GoldLine />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, i) => (
              <div key={i} className="bg-white/5 p-6 border border-[#cc0000]/20">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className={`text-sm ${j < test.rating ? 'text-[#cc0000]' : 'text-white/20'}`}>★</span>
                  ))}
                </div>
                <p className="text-white/70 text-sm italic mb-4">"{test.text}"</p>
                <p className="text-white font-semibold text-sm">{test.name}</p>
                <p className="text-[#cc0000] text-xs">{test.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
