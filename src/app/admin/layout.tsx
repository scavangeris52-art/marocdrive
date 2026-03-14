import type { Metadata } from 'next'
import AdminProviders from './providers'

export const metadata: Metadata = {
  title: 'Admin — RafaSurLaLune',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: 'Inter, sans-serif', background: '#f0f2f5' }}>
        <AdminProviders>
          {children}
        </AdminProviders>
      </body>
    </html>
  )
}
