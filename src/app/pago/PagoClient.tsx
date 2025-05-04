'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from "@/app/components/Navbar";

const PagoClient = () => {
  const searchParams = useSearchParams();
  const fecha = searchParams.get('fecha');

  const fechaFormateada = fecha
    ? new Date(fecha).toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Sin fecha seleccionada';

  return (
    <div className="min-h-screen bg-[#967B6C]">
      <Navbar />
      <main className="flex justify-center items-center mt-16 px-4">
        <div className="bg-[#d4d2d5] rounded-3xl shadow-xl flex p-6 gap-6 w-full max-w-5xl mb-3">
          <div className="flex-shrink-0 w-1/2">
            <Image
              src="/trexx.jpg"
              alt="Terraza"
              width={600}
              height={400}
              className="rounded-2xl object-cover h-full w-full"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-center bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-3xl font-bold text-[#794645] mb-4 text-center">Resumen de pago</h2>

            <div className="text-center">
              <p className="text-xl text-[#794645] font-semibold mb-2">Oh Jacques!</p>
              <p className="text-lg text-[#794645] mb-2">$1500</p>
              <p className="text-md text-[#794645] mb-4">{fechaFormateada}</p>

              <button
                onClick={() => alert('Conectar con Kueski Pay aquí')}
                className="bg-[#D9CACF] px-6 py-3 rounded-full text-black hover:opacity-90 transition text-lg"
              >
                Pagar con Kueski
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PagoClient;
