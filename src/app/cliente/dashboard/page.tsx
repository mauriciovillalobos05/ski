'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Navbar from '@/app/components/Navbar'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

interface Terraza {
  terraza_id: string
  name: string
  description?: string
  image_url?: string
  price: number
  capacity?: number
  owner_name: string
  owner_email: string
}

export default function ClienteDashboard() {
  const [terrazas, setTerrazas] = useState<Terraza[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchTerrazas = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push('/login')
        return
      }

      setUser(user)

      const { data, error } = await supabase
        .from('terrazas_with_owner')
        .select('*')

      if (error) {
        console.error('Error al cargar terrazas:', error.message)
        setTerrazas([])
      } else {
        setTerrazas(data as Terraza[])
      }

      setLoading(false)
    }

    fetchTerrazas()
  }, [router])

  return (
    <div className="min-h-screen bg-[#c18f54]">
      <Navbar />

      <div className="flex justify-between items-center px-8 py-6">
        <h1 className="text-4xl font-serif text-white">Terrazas disponibles</h1>
      </div>

      <main className="flex flex-wrap justify-center gap-6 px-6 pb-12">
        {loading ? (
          <p className="text-white text-xl mt-10">Cargando terrazas...</p>
        ) : terrazas.length > 0 ? (
          terrazas.map((terraza) => (
            <div
              key={terraza.terraza_id}
              className="bg-[#d4d2d5] w-96 rounded-2xl shadow-xl p-4"
            >
              <img
                src={terraza.image_url || '/placeholder.jpg'}
                alt={terraza.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-semibold text-[#794645]">{terraza.name}</h2>
              <p className="text-[#794645]">{terraza.description || 'Sin descripción.'}</p>
              <p className="text-[#794645] font-semibold mt-2">
                ${terraza.price} MXN p/día
              </p>
              <p className="text-[#794645] mb-2">
                {terraza.capacity || 100} personas
              </p>
              <p className="text-sm font-semibold text-[#794645]">
                Anfitrión: {terraza.owner_name}
              </p>
              <p className="text-sm font-semibold text-[#794645]">
                {terraza.owner_email}
              </p>
              <div className="flex">
                <Link
                  href={`/cliente/terraza/${terraza.terraza_id}`}
                  className="ml-auto mt-4 bg-[#d29065] px-4 py-2 rounded-[20px] hover:opacity-90 text-white font-semibold"
                >
                  Reservar
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-lg">
            No hay terrazas disponibles por el momento.
          </p>
        )}
      </main>
    </div>
  )
}
