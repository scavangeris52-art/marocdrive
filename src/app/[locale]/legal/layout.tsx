import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documents Légaux — MimounRifCar',
  description: 'Conditions d\'utilisation et politique de confidentialité',
}

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#111111] min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto text-white">
        {children}
      </div>
    </div>
  )
}
