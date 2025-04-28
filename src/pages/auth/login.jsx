'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import '../../app/styles/Login.css'
import '../../app/globals.css'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
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
      return router.push('/auth/register')
    }

    if (profileData.type_of_client === 'anfitrion') {
      router.push('/dashboard/anfitrion')
    } else if (profileData.type_of_client === 'cliente') {
      router.push('/dashboard/cliente')
    } else {
      setErrorMsg('Tipo de usuario desconocido. Contacta soporte.')
    }
  }

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-form">
        <h2 className="login-title">Cactus Login</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="JackMail"
          required
          className="input"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Cactus Password"
          required
          className="input"
        />

        <button type="submit" className="button">
          Enter the Rodeo
        </button>

        {errorMsg && <p className="error-message">{errorMsg}</p>}
      </form>
    </div>
  )
}
