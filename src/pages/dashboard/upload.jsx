'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import '../../app/globals.css'
import '../../app/styles/Upload.css'


const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function UploadTerraza() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const goToAnfitrion = () => {
    router.push('/dashboard/anfitrion')
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const user = (await supabase.auth.getUser()).data.user
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

      const { data: uploadData, error: uploadError } = await supabase
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
    router.push('/dashboard/anfitrion') 
  }

  return (
    <div className="upload-page">
      <form onSubmit={handleUpload} className="upload-form">
        <h2 className="upload-title ">Subir Nueva Terraza</h2>
        <input
          type="text"
          placeholder="Nombre de la Terraza"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input"
        />
        <textarea
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="input"
        />
        <button
          type="submit"
          disabled={loading}
          className="button"
        >
          {loading ? 'Subiendo...' : 'Subir Terraza'}
        </button>
        {errorMsg && <p className="text-center text-red-500">{errorMsg}</p>}
        <button onClick={goToAnfitrion} className="back-button">
          Cancelar
        </button>
      </form>
    </div>
  )
}
