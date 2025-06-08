'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Navbar from "@/app/components/Navbar"
import Link from "next/link"
import type { User } from '@supabase/supabase-js'
import Image from "next/image"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Terraza {
  terraza_id: string;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  owner_name: string;
  owner_email: string;
  user_id: string;
}

export default function AnfitrionDashboard() {
  const [terrazas, setTerrazas] = useState<Terraza[]>([]);
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchTerrazas = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user) {
        router.push('/login')
        return
      }

      setUser(userData.user)

      const { data, error } = await supabase
        .from('terrazas_with_owner')
        .select('*')
        .eq('user_id', userData.user.id)

      if (error) {
        console.error('Error fetching terrazas:', error)
      } else {
        setTerrazas(data || [])
      }
      setLoading(false)
    }

    fetchTerrazas()
  }, [router])

  const goToUpload = () => {
    router.push('/anfitrion/upload')
  }

  return (
    <div className="min-h-screen bg-[#c18f54]">
      <Navbar />

      <h1 className="text-5xl md:text-4xl font-serif mb-8 text-[#2D2429] px-10 mt-6">
        MIS TERRAZAS EN EL RODEO
      </h1>

      <main className="flex justify-center items-center flex-wrap gap-6 mt-10 px-4">
        {loading ? (
          <p className="text-white text-xl">Cargando terrazas...</p>
        ) : terrazas.length > 0 ? (
          terrazas.map((terraza) => (
            <div key={terraza.terraza_id} className="bg-[#d4d2d5] w-96 rounded-2xl shadow-xl p-4">
              {terraza.image_url ? (
                <Image
                  src={terraza.image_url} 
                  alt={terraza.name} 
                  className="terraza-image"
                />
              ) : (
                <div className="terraza-placeholder">
                  Sin imagen
                </div>
              )}
              <h2 className="text-lg font-semibold text-[#794645]">{terraza.name}</h2>
              <p className="text-[#794645]">{terraza.description || 'Sin descripción'}</p>
              <p className="text-[#794645]">${terraza.price} p/día</p>
              <p className="text-sm font-semibold text-[#794645]">Anfitrión: {terraza.owner_name}</p>
              <p className="text-sm font-semibold text-[#794645]">{terraza.owner_email}</p>
              <div className="flex">
                <Link
                  href={`/anfitrion/terraza/${terraza.terraza_id}`}
                  className="ml-auto mt-4 bg-[#d29065] px-4 py-2 rounded-[20px] hover:opacity-90"
                >
                  <button>EDITAR</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-xl">Aún no tienes terrazas registradas.</p>
        )}
      </main>

      {user && (
        <div className="flex justify-center mt-10">
          <button
            onClick={goToUpload}
            className="bg-[#794645] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:opacity-90"
          >
            Subir nueva terraza
          </button>
        </div>
      )}
    </div>
  )
}
