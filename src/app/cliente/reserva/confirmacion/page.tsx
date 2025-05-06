'use client';

import Navbar from '@/app/components/Navbar';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FC, useState } from 'react';

const Confirmacion: FC = () => {
  const [successfulPayment, setSuccessfulPayment] = useState(false);
  const searchParams = useSearchParams();

  const terraza = searchParams.get('terraza') ?? 'Sin nombre';
  const fechaRaw = searchParams.get('fecha');
  const price = searchParams.get('price') ?? '0';
  const anfitrion = searchParams.get('anfitrion') ?? 'Sin nombre';
  const email = searchParams.get('email') ?? 'Sin correo';

  const fechaFormateada = fechaRaw
    ? new Date(fechaRaw).toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Sin fecha';

  return (
    <div className="min-h-screen bg-[#E0CFAA]">
      <Navbar />
      <div className="flex justify-center items-center px-4 mt-20">
        <div className="bg-[#B6A178] p-10 rounded-3xl shadow-xl max-w-lg w-full">
          {successfulPayment ? (
            <>
              <h1 className="text-3xl font-bold text-[#5A3825] mb-6">Reserva confirmada</h1>
              <p className="text-lg text-[#794645] mb-2"><strong>Terraza:</strong> {terraza}</p>
              <p className="text-lg text-[#794645] mb-2"><strong>Fecha:</strong> {fechaFormateada}</p>
              <p className="text-lg text-[#794645] mb-2"><strong>Precio:</strong> ${price} MXN</p>
              <p className="text-lg text-[#794645] mb-2"><strong>Anfitrión:</strong> {anfitrion}</p>
              <p className="text-lg text-[#794645]"><strong>Contacto:</strong> {email}</p>
              <div className="flex justify-end mt-4">
                <Link
                  href="/cliente/dashboard"
                  className="bg-[#8E9700] px-6 py-2 rounded-full text-white hover:opacity-90"
                >
                  CONTINUAR
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-[#5A3825] mb-6">No se pudo confirmar tu reserva</h1>
              <strong className="block text-xl text-[#BF2237] mb-6">
                Pago Rechazado
              </strong>
              <div className="flex justify-center items-center mb-6">
                <img src="/CactusJack.png" alt="CactusJack logo" className="h-40 object-contain" />
              </div>
              <div className="flex justify-end mt-4">
                <Link
                  href="/cliente/dashboard"
                  className="bg-[#8E9700] px-6 py-2 rounded-full text-white hover:opacity-90"
                >
                  REGRESAR A INICIO
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Confirmacion;
