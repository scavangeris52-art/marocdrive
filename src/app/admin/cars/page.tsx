'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Car = {
  id: number
  brand: string
  model: string
  year: number
  price: number
  category: string
  transmission: string
  fuel: string
  image: string
  status: string
  featured: boolean
}

const emptyForm = {
  brand: '', model: '', year: 2024, price: 300,
  category: 'economy', transmission: 'manual', fuel: 'petrol',
  image: '', seats: 5, ac: true, status: 'available', featured: false,
  descEn: '', descFr: '',
}

export default function AdminCarsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin')
  }, [status, router])

  const loadCars = () => {
    fetch('/api/cars?status=all')
      .then((r) => r.json())
      .then(setCars)
  }

  useEffect(() => { if (session) loadCars() }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const url = editId ? `/api/cars/${editId}` : '/api/cars'
    const method = editId ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowForm(false)
    setEditId(null)
    setForm(emptyForm)
    loadCars()
    setLoading(false)
  }

  const handleEdit = (car: Car) => {
    setForm({ ...emptyForm, ...car } as any)
    setEditId(car.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette voiture ?')) return
    await fetch(`/api/cars/${id}`, { method: 'DELETE' })
    loadCars()
  }

  if (status === 'loading') return <p style={{ padding: 24 }}>Chargement...</p>

  const s = {
    bar: { background: '#0a1628', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    navLink: { color: '#d4a44c', textDecoration: 'none', fontSize: '13px', fontWeight: 600 } as React.CSSProperties,
    container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    btn: { padding: '8px 16px', cursor: 'pointer', border: 'none', fontWeight: 600, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' as const },
    input: { width: '100%', border: '1px solid #ddd', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box' as const },
    label: { display: 'block', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#666', marginBottom: '4px' },
  }

  return (
    <div>
      <div style={s.bar}>
        <h2 style={{ color: 'white', margin: 0, fontFamily: 'Georgia, serif', fontSize: '18px' }}>
          <span style={{ color: '#d4a44c' }}>Mimoun</span>RifCar Admin
        </h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="/admin" style={s.navLink}>Dashboard</a>
          <a href="/admin/bookings" style={s.navLink}>Réservations</a>
        </div>
      </div>

      <div style={s.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#0a1628', fontFamily: 'Georgia, serif', margin: 0 }}>Gestion Voitures ({cars.length})</h2>
          <button
            onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm) }}
            style={{ ...s.btn, background: '#d4a44c', color: '#0a1628' }}
          >
            {showForm ? 'Annuler' : '+ Ajouter Voiture'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', marginBottom: '24px', borderLeft: '4px solid #d4a44c' }}>
            <h3 style={{ marginTop: 0, color: '#0a1628' }}>{editId ? 'Modifier' : 'Nouvelle'} Voiture</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
              {[
                { key: 'brand', label: 'Marque' },
                { key: 'model', label: 'Modèle' },
                { key: 'year', label: 'Année', type: 'number' },
                { key: 'price', label: 'Prix (MAD/jour)', type: 'number' },
                { key: 'seats', label: 'Places', type: 'number' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label style={s.label}>{label}</label>
                  <input
                    type={type || 'text'}
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
                    required
                    style={s.input}
                  />
                </div>
              ))}

              {[
                { key: 'category', label: 'Catégorie', options: ['economy', 'compact', 'suv', 'sedan'] },
                { key: 'transmission', label: 'Transmission', options: ['manual', 'automatic'] },
                { key: 'fuel', label: 'Carburant', options: ['petrol', 'diesel', 'hybrid'] },
                { key: 'status', label: 'Statut', options: ['available', 'rented', 'maintenance'] },
              ].map(({ key, label, options }) => (
                <div key={key}>
                  <label style={s.label}>{label}</label>
                  <select
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    style={s.input}
                  >
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={s.label}>Image URL</label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                style={s.input}
                placeholder="https://..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={s.label}>Description (EN)</label>
                <textarea
                  value={form.descEn}
                  onChange={(e) => setForm({ ...form, descEn: e.target.value })}
                  rows={3}
                  style={{ ...s.input, resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={s.label}>Description (FR)</label>
                <textarea
                  value={form.descFr}
                  onChange={(e) => setForm({ ...form, descFr: e.target.value })}
                  rows={3}
                  style={{ ...s.input, resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Voiture en vedette
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.ac} onChange={(e) => setForm({ ...form, ac: e.target.checked })} />
                Climatisation
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...s.btn, background: '#0a1628', color: '#d4a44c', padding: '12px 24px' }}
            >
              {loading ? '...' : (editId ? 'Modifier' : 'Ajouter')}
            </button>
          </form>
        )}

        {/* Table */}
        <div style={{ background: 'white', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0a1628', color: 'white' }}>
                {['ID', 'Marque', 'Modèle', 'Année', 'Prix', 'Catégorie', 'Statut', 'Vedette', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cars.map((car, i) => (
                <tr key={car.id} style={{ background: i % 2 === 0 ? '#fafafa' : 'white', borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 14px', fontSize: '14px', color: '#999' }}>{car.id}</td>
                  <td style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 600 }}>{car.brand}</td>
                  <td style={{ padding: '10px 14px', fontSize: '14px' }}>{car.model}</td>
                  <td style={{ padding: '10px 14px', fontSize: '14px' }}>{car.year}</td>
                  <td style={{ padding: '10px 14px', fontSize: '14px', color: '#d4a44c', fontWeight: 600 }}>{car.price} MAD</td>
                  <td style={{ padding: '10px 14px', fontSize: '12px', background: 'none' }}>
                    <span style={{ padding: '2px 8px', background: '#e8f0fe', color: '#1a73e8', borderRadius: '2px' }}>{car.category}</span>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '12px' }}>
                    <span style={{ padding: '2px 8px', background: car.status === 'available' ? '#e6f4ea' : '#fce8e6', color: car.status === 'available' ? '#137333' : '#c5221f', borderRadius: '2px' }}>
                      {car.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '14px', textAlign: 'center' }}>{car.featured ? '⭐' : '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(car)} style={{ ...s.btn, background: '#0a1628', color: '#d4a44c', padding: '4px 10px' }}>Modifier</button>
                      <button onClick={() => handleDelete(car.id)} style={{ ...s.btn, background: '#e53e3e', color: 'white', padding: '4px 10px' }}>Suppr.</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
