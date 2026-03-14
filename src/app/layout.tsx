import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MimounRifCar — Location de Voitures au Maroc',
  description: 'Location de voitures à Nador. Flotte premium, prix transparents. Dacia, Renault, Hyundai, Peugeot.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
