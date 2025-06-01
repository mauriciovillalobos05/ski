'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError || !authData.user) {
      return setErrorMsg(authError?.message || 'Error iniciando sesión.')
    }

    const { data: profileData, error: profileError } = await supabase
      .from('client_profiles')
      .select('type_of_client')
      .eq('user_id', authData.user.id)
      .maybeSingle()

    if (profileError) {
      console.error('Error cargando perfil:', profileError)
      setErrorMsg('Error cargando tu perfil. Intenta de nuevo.')
      return
    }

    if (!profileData) {
      return router.push('/register')
    }

    if (profileData.type_of_client === 'anfitrion') {
      router.push('/anfitrion/dashboard')
    } else if (profileData.type_of_client === 'cliente') {
      router.push('/cliente/dashboard')
    } else {
      setErrorMsg('Tipo de usuario desconocido. Contacta soporte.')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl md:text-4xl font-serif mb-8 text-gray-800">LOGIN</h1>

      <form
        onSubmit={handleLogin}
        className="bg-[#ccc4aa] py-10 px-6 rounded-2xl border border-blue-900 shadow-lg w-full max-w-sm text-center min-h-[28rem] flex flex-col justify-between"
      >
        <img src="/Jack.png" alt="Jack logo" className="mx-auto mb-4" />

        <div className="text-left space-y-4 mb-6">
          <div>
            <label htmlFor="email" className="block text-lg font-semibold text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-white text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700"
              placeholder="tuemail@ejemplo.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-semibold text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-white text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700"
              placeholder="Tu contraseña"
              required
            />
          </div>
        </div>

        {errorMsg && (
          <p className="text-red-600 text-sm mb-4 text-left">{errorMsg}</p>
        )}

        <button
          type="submit"
          className="bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow hover:bg-blue-800 transition"
        >
          Iniciar sesión
        </button>

        <div className="flex items-center space-x-1 text-sm text-gray-700 mt-6">
          <p className="font-medium">¿No tienes cuenta?</p>
          <Link href="/register">
            <span className="font-semibold text-gray-700 cursor-pointer hover:underline">
              Regístrate
            </span>
          </Link>
        </div>
      </form>
    </div>
  )
}
