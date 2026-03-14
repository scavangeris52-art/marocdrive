'use client'
import { useState, useEffect } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Stats
  const [stats, setStats] = useState({ cars: 0, bookings: 0, messages: 0 })

  useEffect(() => {
    if (session) {
      Promise.all([
        fetch('/api/cars').then((r) => r.json()),
        fetch('/api/bookings').then((r) => r.json()),
        fetch('/api/contact').then((r) => r.json()),
      ]).then(([cars, bookings, messages]) => {
        setStats({
          cars: Array.isArray(cars) ? cars.length : 0,
          bookings: Array.isArray(bookings) ? bookings.length : 0,
          messages: Array.isArray(messages) ? messages.length : 0,
        })
      })
    }
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

  if (!session) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#0a1628'
    }}>
      <div style={{ background: 'white', padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', color: '#0a1628', marginBottom: '8px' }}>MimounRifCar</h1>
        <p style={{ color: '#d4a44c', marginBottom: '24px', fontSize: '14px' }}>Espace Administrateur</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', border: '1px solid #ddd', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', marginBottom: '6px' }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', border: '1px solid #ddd', padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          {error && <p style={{ color: '#e53e3e', fontSize: '14px' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '12px', background: '#d4a44c', color: '#0a1628', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            {loading ? '...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div>
      {/* Top bar */}
      <div style={{ background: '#0a1628', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ color: 'white', margin: 0, fontFamily: 'Georgia, serif', fontSize: '18px' }}>
          <span style={{ color: '#d4a44c' }}>Maroc</span>Drive Admin
        </h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="/admin/cars" style={{ color: '#d4a44c', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Voitures</a>
          <a href="/admin/bookings" style={{ color: '#d4a44c', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Réservations</a>
          <button
            onClick={() => signOut()}
            style={{ padding: '6px 14px', background: 'transparent', border: '1px solid #d4a44c', color: '#d4a44c', cursor: 'pointer', fontSize: '12px' }}
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: '#0a1628', fontFamily: 'Georgia, serif', marginBottom: '24px' }}>Dashboard</h2>

        {/* Stats cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {[
            { label: 'Voitures', value: stats.cars, color: '#0a1628', link: '/admin/cars' },
            { label: 'Réservations', value: stats.bookings, color: '#d4a44c', link: '/admin/bookings' },
            { label: 'Messages', value: stats.messages, color: '#2d5a27', link: '#' },
          ].map((card) => (
            <a key={card.label} href={card.link} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', padding: '24px', borderLeft: `4px solid ${card.color}` }}>
                <p style={{ fontSize: '36px', fontWeight: 700, color: card.color, margin: '0 0 4px' }}>{card.value}</p>
                <p style={{ fontSize: '13px', color: '#666', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{card.label}</p>
              </div>
            </a>
          ))}
        </div>

        <div style={{ background: 'white', padding: '20px', borderLeft: '4px solid #d4a44c' }}>
          <p style={{ color: '#0a1628', fontWeight: 600, marginBottom: '8px' }}>Bienvenue, {session.user?.name}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Gérez votre flotte et vos réservations depuis ce tableau de bord.
          </p>
        </div>
      </div>
    </div>
  )
}
