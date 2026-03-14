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

export default async function HomePage() {
  const t = await getTranslations()
  const locale = await getLocale()
  const cars = await getFeaturedCars()

  const stats = [
    { label: t('stats.vehicles') },
    { label: t('stats.clients') },
    { label: t('stats.years') },
    { label: t('stats.support') },
  ]

  const testimonials = [
    { name: 'Pierre M.', city: 'Paris, France', text: 'Impeccable service! Clean car and very competitive pricing. 100% recommend.' },
    { name: 'Emily R.', city: 'London, UK', text: 'Very professional. The car was in perfect condition and the process was seamless.' },
    { name: 'Carlos D.', city: 'Madrid, Spain', text: 'Excellent value for money. The team is very responsive and always available.' },
  ]

  return (
    <div>
      <Hero />

      {/* Stats */}
      <section className="bg-[#0a1628] py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-[#d4a44c] font-bold text-xl">{s.label.split(' ')[0]}</p>
              <p className="text-white/60 text-xs tracking-widest uppercase">{s.label.split(' ').slice(1).join(' ')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Cars */}
      {cars.length > 0 && (
        <section className="py-20 bg-[#faf8f4]">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#d4a44c] text-center mb-2">
              {t('cars.title')}
            </p>
            <h2 className="font-['Lora'] text-3xl md:text-4xl font-bold text-[#0a1628] text-center mb-2">
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
      )}

      {/* Testimonials */}
      <section className="py-20 bg-[#0a1628]">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#d4a44c] text-center mb-2">
            {t('testimonials')}
          </p>
          <GoldLine />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, i) => (
              <div key={i} className="bg-white/5 p-6 border border-[#d4a44c]/20">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-[#d4a44c] text-sm">★</span>
                  ))}
                </div>
                <p className="text-white/70 text-sm italic mb-4">"{test.text}"</p>
                <p className="text-white font-semibold text-sm">{test.name}</p>
                <p className="text-[#d4a44c] text-xs">{test.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
