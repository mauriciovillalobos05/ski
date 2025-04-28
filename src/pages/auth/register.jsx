'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import '../../app/styles/Register.css'
import '../../app/globals.css'

export default function Register() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registered, setRegistered] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)

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
  }, [registered])

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/profile`,
      },
    })

    if (!error) {
      setRegistered(true)
    } else {
      alert('Error: ' + error.message)
    }
  }

  return (
    <div className="page">
      <h1 className="title">Registro - Terrazas JACK</h1>

      {!registered ? (
        <div className="form-container">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <button onClick={handleRegister} className="button">
            Registrarse
          </button>
        </div>
      ) : (
        <div className="confirm-container text-center">
          <p className="confirm-text">
            Revisa tu correo y verifica tu cuenta para continuar.
          </p>
          {emailVerified ? (
            <button onClick={() => router.push('/auth/profile')} className="button">
              Continuar
            </button>
          ) : (
            <p className="confirm-waiting">Esperando confirmación...</p>
          )}
        </div>
      )}
    </div>
  )
}
