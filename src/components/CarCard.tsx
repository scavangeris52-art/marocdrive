'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FaCog, FaGasPump, FaUsers, FaSnowflake } from 'react-icons/fa'

interface Car {
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
  descEn?: string
  descFr?: string
}

interface CarCardProps {
  car: Car
  onBook?: (car: Car) => void
  locale: string
}

export default function CarCard({ car, onBook, locale }: CarCardProps) {
  const t = useTranslations('cars')

  return (
    <div className="bg-white border border-gray-100 hover:border-[#d4a44c]/40 hover:shadow-xl transition-all duration-300 group">
      <div className="relative overflow-hidden h-52">
        <Image
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-[#0a1628] text-[#d4a44c] text-xs font-semibold tracking-widest uppercase">
            {t(car.category as any)}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-['Lora'] text-lg font-bold text-[#0a1628]">
          {car.brand} {car.model}
        </h3>
        <p className="text-sm text-gray-400 mb-3">{car.year}</p>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 flex-wrap">
          <span className="flex items-center gap-1">
            <FaCog size={10} /> {t(car.transmission as any)}
          </span>
          <span className="flex items-center gap-1">
            <FaGasPump size={10} /> {t(car.fuel as any)}
          </span>
          <span className="flex items-center gap-1">
            <FaUsers size={10} /> {car.seats} {t('seats')}
          </span>
          {car.ac && (
            <span className="flex items-center gap-1">
              <FaSnowflake size={10} /> {t('ac')}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-[#d4a44c]">{car.price}</span>
            <span className="text-xs text-gray-400 ml-1">MAD{t('perDay')}</span>
          </div>
          <button
            onClick={() => onBook?.(car)}
            className="px-4 py-2 bg-[#0a1628] text-[#d4a44c] text-xs font-semibold tracking-widest uppercase hover:bg-[#d4a44c] hover:text-[#0a1628] transition-colors"
          >
            {t('bookNow')}
          </button>
        </div>
      </div>
    </div>
  )
}
