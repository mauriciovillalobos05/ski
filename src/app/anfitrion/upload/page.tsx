'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function UploadTerraza() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) {
      setErrorMsg('Debes iniciar sesión.')
      setLoading(false)
      return
    }

    let imageUrl = ''
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase
        .storage
        .from('terrazas')
        .upload(filePath, imageFile)

      if (uploadError) {
        setErrorMsg('Error subiendo imagen.')
        console.error(uploadError)
        setLoading(false)
        return
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('terrazas')
        .getPublicUrl(filePath)

      imageUrl = publicUrlData.publicUrl
    }

    const { error: insertError } = await supabase
      .from('terrazas')
      .insert([
        {
          user_id: user.id,
          name,
          description,
          price,
          image_url: imageUrl,
        },
      ])

    if (insertError) {
      setErrorMsg('Error registrando la terraza.')
      console.error(insertError)
      setLoading(false)
      return
    }

    setLoading(false)
    router.push('/anfitrion/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#c18f54] to-[#8b5c3e] flex items-center justify-center px-4">
      <form
        onSubmit={handleUpload}
        className="bg-[#2D2429] text-[#F4EDE4] p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-[#FFBA76] tracking-wider">
          Subir Nueva Terraza
        </h2>

        <input
          type="text"
          placeholder="Nombre de la Terraza"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-[#453B3F] border border-[#7e5a48] rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFBA76]"
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#453B3F] border border-[#7e5a48] rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFBA76]"
        />

        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full bg-[#453B3F] border border-[#7e5a48] rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFBA76]"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full text-white bg-transparent file:bg-[#FFBA76] file:text-black file:rounded-full file:px-4 file:py-2 file:border-none"
        />

        {errorMsg && (
          <p className="text-center text-red-500 font-semibold">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FFBA76] text-[#2D2429] font-bold py-2 px-4 rounded-full hover:opacity-90 transition"
        >
          {loading ? 'Subiendo...' : 'Subir Terraza'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/dashboard/anfitrion')}
          className="w-full mt-2 text-[#FFBA76] hover:underline text-center"
        >
          Cancelar
        </button>
      </form>
    </div>
  )
}