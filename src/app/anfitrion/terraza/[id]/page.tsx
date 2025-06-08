'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Navbar from "@/app/components/Navbar"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Terraza {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  capacity?: number
}

export default function EditarTerraza() {
  const { id } = useParams() as { id: string }
  const router = useRouter()

  const [terraza, setTerraza] = useState<Terraza | null>(null)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')

  useEffect(() => {
    const fetchTerraza = async () => {
      const { data, error } = await supabase
        .from('terrazas')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error al cargar terraza:', error)
        return
      }

      setTerraza(data)
      setNombre(data.name)
      setDescripcion(data.description || '')
      setPrecio(data.price.toString())
      setPreview(data.image_url || '')
    }

    fetchTerraza()
  }, [id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImagen(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!terraza) return

    let image_url = terraza.image_url

    if (imagen) {
      const filename = `images/${crypto.randomUUID()}-${Date.now()}`

      const { data: authData } = await supabase.auth.getUser()
      if (!authData?.user) {
        console.error('Usuario no autenticado')
        return
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("terrazas")
        .upload(filename, imagen)

      if (uploadError || !uploadData) {
        console.error('Error al subir imagen:', uploadError)
        return
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('terrazas')
        .getPublicUrl(uploadData.path)

      image_url = publicUrlData.publicUrl
    }

    const { error: updateError } = await supabase
      .from('terrazas')
      .update({
        name: nombre,
        description: descripcion,
        price: parseInt(precio),
        image_url: image_url
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error al actualizar terraza:', updateError)
      return
    }

    router.push('/anfitrion/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#c18f54]">
      <Navbar />
      <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-3xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#794645]">Editar Terraza</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#794645] font-semibold mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 rounded border"
              required
            />
          </div>

          <div>
            <label className="block text-[#794645] font-semibold mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-2 rounded border"
              required
            />
          </div>

          <div>
            <label className="block text-[#794645] font-semibold mb-1">Precio por día</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full p-2 rounded border"
              required
            />
          </div>

          <div>
            <label className="block text-[#794645] font-semibold mb-1">Imagen</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="mt-4 rounded-xl object-cover h-48 w-full"
              />
            )}
          </div>

          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/anfitrion/dashboard')}
              className="w-full bg-gray-400 text-white font-semibold py-2 px-4 rounded hover:opacity-90 mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full bg-[#794645] text-white font-semibold py-2 px-4 rounded hover:opacity-90 ml-2"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}