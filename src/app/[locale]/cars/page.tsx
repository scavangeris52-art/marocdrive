'use client'
import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import CarCard from '@/components/CarCard'
import BookingModal from '@/components/BookingModal'
import GoldLine from '@/components/GoldLine'

type Car = {
  id: number
  brand: string
  model: string
  year: number
  price: number
  category: string
  transmission: string
  fuel: string
  seats: number
  ac: boolean
  image: string
}

export default function CarsPage() {
  const t = useTranslations('cars')
  const locale = useLocale()
  const [cars, setCars] = useState<Car[]>([])
  const [category, setCategory] = useState('all')
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)

  useEffect(() => {
    fetch('/api/cars').then((r) => r.json()).then(setCars)
  }, [])

  const categories = ['all', 'economy', 'compact', 'suv', 'sedan']

  const filtered = category === 'all' ? cars : cars.filter((c) => c.category === category)

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      {/* Header */}
      <section className="bg-[#0a1628] py-16 text-center">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#d4a44c] mb-2">MimounRifCar</p>
        <h1 className="font-['Lora'] text-4xl md:text-5xl font-bold text-white">{t('title')}</h1>
        <GoldLine />
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-colors ${
                category === cat
                  ? 'bg-[#d4a44c] text-[#0a1628]'
                  : 'border border-[#0a1628]/20 text-[#0a1628]/60 hover:border-[#d4a44c] hover:text-[#d4a44c]'
              }`}
            >
              {t(cat as any)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-400">{t('noResults')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((car) => (
              <CarCard key={car.id} car={car} locale={locale} onBook={setSelectedCar} />
            ))}
          </div>
        )}
      </div>

      {selectedCar && (
        <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </div>
  )
}
