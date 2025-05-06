'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Register() {
  const [registered, setRegistered] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEmailVerified(true);
  }, []);

  if (!mounted) return null; 

  return (
    <>
      {!registered ? (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl md:text-4xl font-serif mb-8 text-gray-800">
            ÚNETE AL RODEO
          </h1>

          <div className="bg-[#ccc4aa] py-10 px-6 rounded-2xl border border-blue-900 shadow-lg w-full max-w-sm text-center min-h-[28rem] flex flex-col justify-between">
            <img src="/Jack.png" alt="Jack logo" className="mx-auto mb-4" />

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
                  className="mt-1 bg-white text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700"
                  placeholder="tuemail@ejemplo.com"
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
                  className="mt-1 bg-white text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700"
                  placeholder="Tu contraseña"
                />
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <button
                className="bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow hover:bg-blue-800 transition"
                onClick={() => setRegistered(true)} 
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
            <img src="/Jack.png" alt="Jack logo" className="mx-auto mb-15" />
            <img src="/CactusJack.png" alt="CactusJack logo" className="mx-auto mb-8 scale-140" />
          </div>
          {emailVerified ? (
            <Link href="/profile">
              <button className="bg-blue-700 text-white font-bold py-2 px-50 rounded-full shadow hover:bg-blue-800 transition">
                Continuar
              </button>
            </Link>
          ) : (
            <p className="font-semibold text-lg text-red-500">Esperando confirmación...</p>
          )}
        </div>
      )}
    </>
  );
}
