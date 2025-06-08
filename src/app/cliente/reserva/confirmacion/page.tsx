'use client';

import Navbar from '@/app/components/Navbar';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

const Confirmacion: FC = () => {
  const rawParams = useSearchParams();
  const [successfulPayment, setSuccessfulPayment] = useState<boolean>(false);

  // Valores iniciales por defecto
  const [terraza, setTerraza] = useState<string>('Sin nombre');
  const [fechaFormateada, setFechaFormateada] = useState<string>('Sin fecha');
  const [price, setPrice] = useState<string>('0');
  const [anfitrion, setAnfitrion] = useState<string>('Sin nombre');
  const [email, setEmail] = useState<string>('Sin correo');

  useEffect(() => {
    if (!rawParams) return;

    const status = rawParams.get('status');
    setSuccessfulPayment(status === 'success');

    const rawFecha = rawParams.get('fecha');

    setTerraza(rawParams.get('terraza') || 'Sin nombre');
    setPrice(rawParams.get('price') || '0');
    setAnfitrion(rawParams.get('anfitrion') || 'Sin nombre');
    setEmail(rawParams.get('email') || 'Sin correo');

    if (rawFecha) {
      const parsed = new Date(rawFecha);
      if (!isNaN(parsed.getTime())) {
        const formatted = parsed.toLocaleDateString('es-MX', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        setFechaFormateada(formatted);
      }
    }
  }, [rawParams]);

  return (
    <div className="min-h-screen bg-[#E0CFAA]">
      <Navbar />
      <div className="flex justify-center items-center px-4 mt-20">
        <div className="bg-[#B6A178] p-10 rounded-3xl shadow-xl max-w-lg w-full">
          {successfulPayment ? (
            <>
              <h1 className="text-3xl font-bold text-[#5A3825] mb-6">
                Reserva confirmada
              </h1>
              <p className="text-lg text-[#794645] mb-2">
                <strong>Terraza:</strong> {terraza}
              </p>
              <p className="text-lg text-[#794645] mb-2">
                <strong>Fecha:</strong> {fechaFormateada}
              </p>
              <p className="text-lg text-[#794645] mb-2">
                <strong>Precio:</strong> ${price} MXN
              </p>
              <p className="text-lg text-[#794645] mb-2">
                <strong>Anfitrión:</strong> {anfitrion}
              </p>
              <p className="text-lg text-[#794645]">
                <strong>Contacto:</strong> {email}
              </p>
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
              <h1 className="text-3xl font-bold text-[#5A3825] mb-6">
                No se pudo confirmar tu reserva
              </h1>
              <strong className="block text-xl text-[#BF2237] mb-6">
                Pago Rechazado
              </strong>
              <div className="flex justify-center items-center mb-6">
                <img
                  src="/CactusJack.png"
                  alt="Logo de Cactus Jack"
                  className="h-40 object-contain"
                />
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