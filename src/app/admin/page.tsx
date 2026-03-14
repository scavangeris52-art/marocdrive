'use client'
import { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

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
  createdAt: string
  car: { brand: string; model: string; price: number }
}

const BAR = { background: '#0a1628', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const NAV_LINK = { color: '#d4a44c', textDecoration: 'none', fontSize: '13px', fontWeight: 600 } as React.CSSProperties
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:   { bg: '#fff3cd', color: '#856404' },
  confirmed: { bg: '#e6f4ea', color: '#137333' },
  cancelled: { bg: '#fce8e6', color: '#c5221f' },
  completed: { bg: '#e8f0fe', color: '#1a73e8' },
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const [cars, setCars]         = useState(0)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [messages, setMessages] = useState(0)

  useEffect(() => {
    if (!session) return
    Promise.all([
      fetch('/api/cars').then(r => r.json()),
      fetch('/api/bookings').then(r => r.json()),
      fetch('/api/contact').then(r => r.json()),
    ]).then(([c, b, m]) => {
      setCars(Array.isArray(c) ? c.length : 0)
      setBookings(Array.isArray(b) ? b : [])
      setMessages(Array.isArray(m) ? m.length : 0)
    })
  }, [session])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) setError('Email ou mot de passe incorrect.')
    setLoading(false)
  }

  if (status === 'loading') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <p>Chargement...</p>
    </div>
  )

  /* ─── LOGIN ─── */
  if (!session) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a1628' }}>
      <div style={{ background: 'white', padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', color: '#0a1628', marginBottom: '4px' }}>
          <span style={{ color: '#d4a44c' }}>Mimoun</span>RifCar
        </h1>
        <p style={{ color: '#d4a44c', marginBottom: '24px', fontSize: '14px' }}>Espace Administrateur</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Email', type: 'email', val: email, set: setEmail },
            { label: 'Mot de passe', type: 'password', val: password, set: setPassword },
          ].map(({ label, type, val, set }) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', marginBottom: '6px' }}>{label}</label>
              <input type={type} value={val} onChange={e => set(e.target.value)} required
                style={{ width: '100%', border: '1px solid #ddd', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          ))}
          {error && <p style={{ color: '#e53e3e', fontSize: '14px' }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ padding: '12px', background: '#d4a44c', color: '#0a1628', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {loading ? '...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )

  /* ─── CALCULS GAINS ─── */
  const totalRevenue   = bookings.filter(b => ['confirmed','completed'].includes(b.status)).reduce((s, b) => s + b.totalPrice, 0)
  const pendingCount   = bookings.filter(b => b.status === 'pending').length
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length
  const recentBookings = bookings.slice(0, 6)

  /* ─── DASHBOARD ─── */
  return (
    <div>
      {/* Top bar */}
      <div style={BAR}>
        <h2 style={{ color: 'white', margin: 0, fontFamily: 'Georgia, serif', fontSize: '18px' }}>
          <span style={{ color: '#d4a44c' }}>Mimoun</span>RifCar Admin
        </h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="/admin/cars" style={NAV_LINK}>Voitures</a>
          <a href="/admin/bookings" style={NAV_LINK}>Réservations</a>
          <button onClick={() => signOut()}
            style={{ padding: '6px 14px', background: 'transparent', border: '1px solid #d4a44c', color: '#d4a44c', cursor: 'pointer', fontSize: '12px' }}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ padding: '32px 24px', maxWidth: '1300px', margin: '0 auto' }}>
        <h2 style={{ color: '#0a1628', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>Tableau de bord</h2>
        <p style={{ color: '#999', fontSize: '14px', marginBottom: '28px' }}>Bienvenue, {session.user?.name}</p>

        {/* ── Stat cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
          {/* Gains */}
          <div style={{ background: 'white', padding: '28px', borderLeft: '4px solid #d4a44c', gridColumn: '1 / -1' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', margin: '0 0 8px' }}>Gains Totaux (confirmés + complétés)</p>
            <p style={{ fontSize: '42px', fontWeight: 800, color: '#d4a44c', margin: 0 }}>
              {totalRevenue.toLocaleString('fr-FR')} <span style={{ fontSize: '20px' }}>MAD</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Voitures',            value: cars,                       color: '#0a1628', link: '/admin/cars'     },
            { label: 'Total Réservations',  value: bookings.length,             color: '#1a73e8', link: '/admin/bookings' },
            { label: 'En attente',           value: pendingCount,                color: '#856404', link: '/admin/bookings' },
            { label: 'Confirmées',           value: confirmedCount,              color: '#137333', link: '/admin/bookings' },
            { label: 'Messages',             value: messages,                    color: '#6a0dad', link: '#'               },
          ].map((card) => (
            <a key={card.label} href={card.link} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', padding: '20px', borderLeft: `4px solid ${card.color}`, transition: 'box-shadow .2s' }}>
                <p style={{ fontSize: '32px', fontWeight: 700, color: card.color, margin: '0 0 4px' }}>{card.value}</p>
                <p style={{ fontSize: '11px', color: '#888', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{card.label}</p>
              </div>
            </a>
          ))}
        </div>

        {/* ── Réservations récentes ── */}
        <div style={{ background: 'white', padding: '0' }}>
          <div style={{ padding: '16px 20px', borderBottom: '2px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#0a1628', fontFamily: 'Georgia, serif', fontSize: '16px' }}>Réservations Récentes</h3>
            <a href="/admin/bookings" style={{ color: '#d4a44c', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Voir tout →</a>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f8f8' }}>
                  {['Client', 'Voiture', 'Dates', 'Ville', 'Durée', 'Prix Total', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#999', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#bbb' }}>Aucune réservation pour le moment.</td></tr>
                ) : recentBookings.map((b, i) => {
                  const sc = STATUS_COLORS[b.status] || { bg: '#eee', color: '#666' }
                  const days = Math.max(1, Math.ceil((new Date(b.returnDate).getTime() - new Date(b.pickupDate).getTime()) / 86400000))
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f5f5f5', background: i % 2 === 0 ? '#fafafa' : 'white' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#0a1628' }}>{b.name}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{b.phone}</p>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500 }}>
                        {b.car ? `${b.car.brand} ${b.car.model}` : '—'}
                        {b.car && <span style={{ display: 'block', fontSize: '11px', color: '#aaa' }}>{b.car.price} MAD/j</span>}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#666', whiteSpace: 'nowrap' }}>
                        <div>↑ {new Date(b.pickupDate).toLocaleDateString('fr-FR')}</div>
                        <div>↓ {new Date(b.returnDate).toLocaleDateString('fr-FR')}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#555' }}>{b.pickupCity}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#0a1628', textAlign: 'center' }}>{days}j</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: '#d4a44c', whiteSpace: 'nowrap' }}>
                        {b.totalPrice > 0 ? `${b.totalPrice.toLocaleString('fr-FR')} MAD` : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', background: sc.bg, color: sc.color, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
