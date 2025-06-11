'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Navbar from '@/app/components/Navbar'

interface Reserva {
  id: string;
  terraza_id: string;
  terraza_nombre: string;
  image_url: string | null;
  cliente_nombre: string;
  cliente_contacto: string;
  amount: number;
  reservation_date: string;
  status: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ReservasAnfitrion() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchReservas = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase.rpc('get_reservas_anfitrion', {
        anfitrion_id_param: userData.user.id,
      })

      if (error) {
        console.error('Error al obtener reservas:', error)
        setErrorMsg('No se pudieron cargar las reservas.')
      } else {
        setReservas(data || [])
      }

      setLoading(false)
    }

    fetchReservas()
  }, [router])

  return (
    <div className="min-h-screen bg-[#E0CFAA]">
      <Navbar />

      <h1 className="text-5xl md:text-4xl font-serif mb-8 text-[#2D2429] px-10 mt-6">
        RESERVAS EN MIS TERRAZAS
      </h1>

      <main className="flex justify-center items-center flex-wrap gap-6 mt-10 px-4">
        {loading ? (
          <p className="text-white text-xl">Cargando reservas...</p>
        ) : errorMsg ? (
          <p className="text-red-600 text-xl">{errorMsg}</p>
        ) : reservas.length > 0 ? (
          reservas.map((reserva) => (
            <div key={reserva.id} className="bg-[#d4d2d5] w-96 rounded-2xl shadow-xl p-4">
              {reserva.image_url ? (
                <img
                  src={reserva.image_url}
                  alt={reserva.terraza_nombre}
                  className="terraza-image"
                />
              ) : (
                <div className="terraza-placeholder">Sin imagen</div>
              )}
              <h2 className="text-lg font-semibold text-[#794645]">{reserva.terraza_nombre}</h2>
              <p className="text-[#794645]">
                Fecha:{' '}
                {new Intl.DateTimeFormat('es-MX', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC',
                }).format(new Date(reserva.reservation_date + 'T00:00:00Z'))}
              </p>
              <p className="text-[#794645]">
                Monto: ${reserva.amount?.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
              </p>
              <p className="text-[#794645]">
                Cliente: {reserva.cliente_nombre ?? 'Desconocido'}
              </p>
              <p className="text-[#794645]">
                Contacto: {reserva.cliente_contacto ?? 'No disponible'}
              </p>
              <p className="text-sm text-white bg-[#7B5E3C] rounded px-2 py-1 inline-block mt-2">
                Estado: {reserva.status ?? 'Desconocido'}
              </p>
            </div>
          ))
        ) : (
          <p className="text-5xl md:text-4xl font-serif mb-8 text-[#2D2429] px-10 mt-6">Aún no tienes reservas en tus terrazas.</p>
        )}
      </main>
    </div>
  )
}