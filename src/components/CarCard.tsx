'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FaCog, FaGasPump, FaUsers, FaSnowflake } from 'react-icons/fa'
import { useState } from 'react'

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
  const [imgError, setImgError] = useState(false)

  const fallbackSrc = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" fill="%231a1a1a"><rect width="400" height="250"/><text x="50%" y="50%" fill="%23666" font-family="Arial" font-size="16" text-anchor="middle" dy=".3em">Image non disponible</text></svg>')}`

  return (
    <div className="bg-[#1a1a1a] border border-white/10 hover:border-[#cc0000]/50 hover:shadow-xl hover:shadow-[#cc0000]/10 transition-all duration-300 group">
      <div className="relative overflow-hidden h-52">
        <Image
          src={imgError ? fallbackSrc : car.image}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
          onError={() => setImgError(true)}
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-[#0d0d0d] text-[#cc0000] text-xs font-semibold tracking-widest uppercase">
            {t(car.category as any)}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em' }} className="text-xl text-white">
          {car.brand} {car.model}
        </h3>
        <p className="text-sm text-white/40 mb-3">{car.year}</p>

        <div className="flex items-center gap-3 text-xs text-white/50 mb-4 flex-wrap">
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
            <span className="text-2xl font-bold text-[#cc0000]">{car.price}</span>
            <span className="text-xs text-white/40 ml-1">MAD{t('perDay')}</span>
          </div>
          <button
            onClick={() => onBook?.(car)}
            className="px-4 py-2 bg-[#cc0000] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#aa0000] transition-colors"
          >
            {t('bookNow')}
          </button>
        </div>
      </div>
    </div>
  )
}
