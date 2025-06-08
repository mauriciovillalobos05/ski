'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from "next/image"

export default function Register() {
  const supabase = createClientComponentClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registered, setRegistered] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (registered) {
      const checkEmailConfirmed = async () => {
        const { data } = await supabase.auth.getUser()
        const user = data?.user
        if (user?.email_confirmed_at) {
          setEmailVerified(true)
        }
      }

      const interval = setInterval(checkEmailConfirmed, 5000)
      return () => clearInterval(interval)
    }
  }, [registered, supabase])

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/profile`,
      },
    })

    if (!error) {
      setRegistered(true)
    } else {
      alert('Error: ' + error.message)
    }
  }

  if (!mounted) return null

  return (
    <>
      {!registered ? (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl md:text-4xl font-serif mb-8 text-gray-800">
            ÚNETE AL RODEO
          </h1>

          <div className="bg-[#ccc4aa] py-10 px-6 rounded-2xl border border-blue-900 shadow-lg w-full max-w-sm text-center min-h-[28rem] flex flex-col justify-between">
            <Image src="/Jack.png" alt="Jack logo" width={120} height={120} className="mx-auto mb-4" />

            <div className="text-left space-y-4 mb-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-lg font-semibold text-gray-700"
                >
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
                <label
                  htmlFor="password"
                  className="block text-lg font-semibold text-gray-700"
                >
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

            <div className="flex justify-end mb-6">
              <button
                className="bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow hover:bg-blue-800 transition"
                onClick={handleRegister}
              >
                REGÍSTRATE
              </button>
            </div>

            <div className="flex items-center space-x-1 text-sm text-gray-700">
              <p className="font-medium">¿Ya tienes cuenta?</p>
              <Link href="/login">
                <span className="font-semibold text-gray-700 cursor-pointer hover:underline">
                  Haz LOGIN
                </span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="confirm-container bg-white text-center min-h-screen flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl font-semibold mb-6 text-gray-800">
            Revisa tu correo y verifica tu cuenta para continuar.
          </h1>
          <div className="py-6 px-3 max-w-sm text-center min-h-[28rem] flex flex-col justify-between">
            <Image src="/Jack.png" alt="Jack logo" width={120} height={120} className="mx-auto mb-6" />
            <Image src="/CactusJack.png" alt="CactusJack logo" width={120} height={120} className="mx-auto mb-8 scale-140" />
          </div>
          {emailVerified ? (
            <Link href="/register">
              <button className="bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow hover:bg-blue-800 transition">
                Continuar
              </button>
            </Link>
          ) : (
            <p className="font-semibold text-lg text-red-500">Esperando confirmación...</p>
          )}
        </div>
      )}
    </>
  )
}