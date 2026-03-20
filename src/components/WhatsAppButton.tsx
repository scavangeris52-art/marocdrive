'use client'
import { FaWhatsapp } from 'react-icons/fa'

export default function WhatsAppButton() {
  const whatsapp = '+212667422552'
  const message = encodeURIComponent('Bonjour, je souhaite louer une voiture.')
  return (
    <a
      href={`https://wa.me/${whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform"
      aria-label="WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  )
}
