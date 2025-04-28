'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import '../../app/styles/Profile.css'
import '../../app/globals.css'

const supabase = createClientComponentClient()

export default function CompleteProfile() {
  const [name, setName] = useState('')
  const [type, setType] = useState('cliente')
  const [userLoaded, setUserLoaded] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      console.log('User data from Supabase:', data)
      setUser(data.user)
      setUserLoaded(true)
    }

    checkUser()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('Submitting profile data:', { user_id: user?.id, name, type_of_client: type })

    if (!user) return

    const { data, error } = await supabase
      .from('client_profiles')
      .insert({ user_id: user.id, name, type_of_client: type })

    if (error) {
      console.log('Insert error:', error)
    } else {
      console.log('Profile successfully inserted:', data)
      router.push(type === 'anfitrion' ? '/dashboard/anfitrion' : '/dashboard/cliente')
    }
  }

  if (!userLoaded) {
    return <p className="text-center">Cargando sesión...</p>
  }

  if (!user) {
    return <p className="text-center text-red">No se pudo cargar la sesión del usuario.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h2 className="profile-title">Completa tu perfil</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre"
        required
        className="input"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="select"
      >
        <option value="cliente">Cliente</option>
        <option value="anfitrion">Anfitrión</option>
      </select>

      <button type="submit" className="button">
        Guardar perfil
      </button>
    </form>
  )
}
