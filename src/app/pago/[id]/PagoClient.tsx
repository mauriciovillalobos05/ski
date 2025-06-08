"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "@/app/components/Navbar"
import Kueski_button from "@/app/components/kueski/kueski_button"
import { createClient } from "@supabase/supabase-js"
import Image from "next/image"

type Terraza = {
  id: string
  name: string
  image_url: string
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PagoPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const id = params?.id as string | undefined
  const fecha = searchParams?.get("fecha")

  const [fechaValida, setFechaValida] = useState<string | null>(null)
  const [terraza, setTerraza] = useState<Terraza | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError("ID de terraza no especificado")
      return
    }

    if (!fecha) {
      setError("Falta la fecha en la URL")
      return
    }

    const parsed = new Date(fecha)
    if (isNaN(parsed.getTime())) {
      setError("La fecha es inválida")
      return
    }

    setFechaValida(parsed.toISOString())

    const fetchTerraza = async () => {
      const { data, error } = await supabase
        .from("terrazas")
        .select("*")
        .eq("id", id)
        .single()

      if (error || !data) {
        setError("Terraza no encontrada")
        return
      }

      setTerraza(data as Terraza)
    }

    fetchTerraza()
  }, [id, fecha])

  if (error) {
    return (
      <div className="min-h-screen bg-[#967B6C] text-white p-12">
        <Navbar />
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error}</p>
      </div>
    )
  }

  if (!terraza || !fechaValida) {
    return (
      <div className="min-h-screen bg-[#967B6C] text-white p-12">
        <Navbar />
        <p>Cargando detalles de la terraza...</p>
      </div>
    )
  }

  const fechaFormateada = new Date(fechaValida).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-[#967B6C]">
      <Navbar />
      <main className="flex justify-center items-center mt-16 px-4">
        <div className="bg-[#ABABB1] rounded-3xl shadow-xl flex p-6 gap-6 w-full max-w-5xl">
          <div className="flex-shrink-0 w-1/2 relative h-[400px]">
            <Image
              src={terraza.image_url || "/placeholder.jpg"}
              alt={terraza.name}
              fill
              className="rounded-2xl object-cover"
            />
          </div>

          <div className="flex flex-col justify-center w-1/2">
            <h2 className="text-5xl font-bold mb-10 text-center text-[#191919]">
              Resumen de Pago
            </h2>
            <p className="text-xl font-semibold text-center text-[#191919] mb-2">
              Reservación de terraza {terraza.name}
            </p>
            <p className="text-xl font-semibold text-center text-[#191919] mb-10">
              {fechaFormateada}
            </p>
            <div className="flex justify-center">
              <Kueski_button
                selectedDate={new Date(fechaValida)}
                terraza={terraza}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}