'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Booking = {
  id: number
  name: string
  email: string
  phone: string
  pickupDate: string
  returnDate: string
  pickupCity: string
  status: string
  totalPrice: number
  notes: string
  lang: string
  createdAt: string
  car: { brand: string; model: string; price: number }
}

export default function AdminBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin')
  }, [status, router])

  const loadBookings = () => {
    fetch('/api/bookings').then((r) => r.json()).then(setBookings)
  }

  useEffect(() => { if (session) loadBookings() }, [session])

  const updateStatus = async (id: number, newStatus: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    loadBookings()
  }

  const deleteBooking = async (id: number) => {
    if (!confirm('Supprimer cette réservation ?')) return
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
    loadBookings()
  }

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)

  const statusColors: Record<string, { bg: string; color: string }> = {
    pending: { bg: '#fff3cd', color: '#856404' },
    confirmed: { bg: '#e6f4ea', color: '#137333' },
    cancelled: { bg: '#fce8e6', color: '#c5221f' },
    completed: { bg: '#e8f0fe', color: '#1a73e8' },
  }

  const s = {
    bar: { background: '#0a1628', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    navLink: { color: '#d4a44c', textDecoration: 'none', fontSize: '13px', fontWeight: 600 } as React.CSSProperties,
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
  }

  if (status === 'loading') return <p style={{ padding: 24 }}>Chargement...</p>

  return (
    <div>
      <div style={s.bar}>
        <h2 style={{ color: 'white', margin: 0, fontFamily: 'Georgia, serif', fontSize: '18px' }}>
          <span style={{ color: '#d4a44c' }}>Maroc</span>Drive Admin
        </h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="/admin" style={s.navLink}>Dashboard</a>
          <a href="/admin/cars" style={s.navLink}>Voitures</a>
        </div>
      </div>

      <div style={s.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#0a1628', fontFamily: 'Georgia, serif', margin: 0 }}>Réservations ({bookings.length})</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: '6px 14px', border: 'none', cursor: 'pointer', fontSize: '12px',
                  fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                  background: filter === s ? '#0a1628' : '#e0e0e0',
                  color: filter === s ? '#d4a44c' : '#666',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0a1628', color: 'white' }}>
                {['#', 'Client', 'Voiture', 'Dates', 'Ville', 'Statut', 'Langue', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const sc = statusColors[b.status] || { bg: '#f0f0f0', color: '#666' }
                return (
                  <tr key={b.id} style={{ background: i % 2 === 0 ? '#fafafa' : 'white', borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '10px 14px', fontSize: '13px', color: '#999' }}>{b.id}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>{b.name}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{b.email}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{b.phone}</p>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '14px' }}>
                      {b.car ? `${b.car.brand} ${b.car.model}` : '—'}
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '12px' }}>
                      <p style={{ margin: 0 }}>↑ {new Date(b.pickupDate).toLocaleDateString('fr-FR')}</p>
                      <p style={{ margin: 0 }}>↓ {new Date(b.returnDate).toLocaleDateString('fr-FR')}</p>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '13px' }}>{b.pickupCity}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        style={{ padding: '4px 8px', background: sc.bg, color: sc.color, border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        {['pending', 'confirmed', 'cancelled', 'completed'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: '13px', textTransform: 'uppercase' }}>{b.lang}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <button
                        onClick={() => deleteBooking(b.id)}
                        style={{ padding: '4px 10px', background: '#e53e3e', color: 'white', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
                      >
                        Suppr.
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p style={{ padding: '24px', textAlign: 'center', color: '#999' }}>Aucune réservation.</p>
          )}
        </div>
      </div>
    </div>
  )
}
