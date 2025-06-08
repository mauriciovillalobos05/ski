'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from "next/image"

type User = {
  id: string
}

export default function CompleteProfile() {
  const [name, setName] = useState<string>('')
  const [type, setType] = useState<'cliente' | 'anfitrion'>('cliente')
  const [userLoaded, setUserLoaded] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      console.log('User data from Supabase:', data)
      setUser(data.user)
      setUserLoaded(true)
    }

    checkUser()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user) return

    if (name.trim().length < 2) {
      setErrorMsg('El nombre es demasiado corto.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    console.log('Submitting profile data:', {
      user_id: user.id,
      name,
      type_of_client: type
    })

    const { data, error } = await supabase
      .from('client_profiles')
      .insert({ user_id: user.id, name, type_of_client: type })

    if (error) {
      console.error('Insert error:', error)
      setErrorMsg('No se pudo guardar tu perfil. Intenta de nuevo.')
    } else {
      console.log('Profile successfully inserted:', data)
      router.push(type === 'anfitrion' ? '/anfitrion/dashboard' : '/cliente/dashboard')
    }

    setLoading(false)
  }

  if (!userLoaded) {
    return <p className="text-center">Cargando sesión...</p>
  }

  if (!user) {
    return <p className="text-center text-red-500">No se pudo cargar la sesión del usuario.</p>
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl md:text-4xl font-serif mb-8 text-gray-800">
        Un paso más el Rodeo ...
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#ccc4aa] py-10 px-6 rounded-2xl border border-blue-900 shadow-lg w-full max-w-sm text-center min-h-[28rem] flex flex-col justify-between"
      >
        <Image src="/Jack.png" alt="Jack logo" width={120} height={120} className="mx-auto mb-4" />

        <div className="text-left space-y-4 mb-6">
          <div>
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 bg-white text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700"
              placeholder="Jacques Webster"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-lg font-semibold text-gray-700">
              Tipo de Usuario
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as 'cliente' | 'anfitrion')}
              className="mt-1 bg-white text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700"
            >
              <option value="cliente">Cliente</option>
              <option value="anfitrion">Anfitrión</option>
            </select>
          </div>
        </div>

        {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}

        <div className="flex justify-end mb-6">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow transition ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'
            }`}
          >
            {loading ? 'Cargando...' : 'IR AL RODEO'}
          </button>
        </div>
      </form>
    </div>
  )
}