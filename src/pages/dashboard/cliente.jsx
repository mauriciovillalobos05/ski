'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import '../../app/styles/Cliente.css'
import '../../app/globals.css'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AnfitrionDashboard() {
  const [terrazas, setTerrazas] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchTerrazas = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user) {
        router.push('/auth/login')
        return
      }
      setUser(userData.user)

      const { data, error } = await supabase
        .from('terrazas_with_owner')
        .select(`
          *
        `)


      if (error) {
        console.error('Error fetching terrazas:', error)
      } else {
        setTerrazas(data || [])
      }
      setLoading(false)
    }

    fetchTerrazas()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const goToUpload = () => {
    router.push('/dashboard/upload')
  }

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <div className="top-bar">
        <h1>Terrazas Jack</h1>
        <button onClick={handleLogout} className="logout-button">
          Cerrar sesión
        </button>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        <h2 className="dashboard-title">Terrazas</h2>

        {loading ? (
          <p className="loading-text">Cargando terrazas...</p>
        ) : (
          <div className="terraza-grid">
            {terrazas.length > 0 ? (
              terrazas.map((terraza) => (
                <div 
                  key={terraza.id} 
                  className="terraza-card"
                >
                  {terraza.image_url ? (
                    <img 
                      src={terraza.image_url} 
                      alt={terraza.name} 
                      className="terraza-image"
                    />
                  ) : (
                    <div className="terraza-placeholder">
                      Sin imagen
                    </div>
                  )}
                  <div className="terraza-info">
                    <h3 className="terraza-name">{terraza.name}</h3>
                    <p className="terraza-description">{terraza.description || 'Sin descripción disponible.'}</p>
                    <p className="terraza-price">${terraza.price} MXN</p>

                    {/* Owner Info */}
                    <div className="terraza-owner">
                      <p className="terraza-owner-name">Anfitrión: {terraza.owner_name}</p>
                      <p className="terraza-owner-email">{terraza.owner_email}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-terrazas-text">No hay terrazas disponibles.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
