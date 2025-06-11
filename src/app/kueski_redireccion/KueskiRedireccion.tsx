'use client';
export const dynamic = 'force-dynamic';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Navbar from '../components/Navbar';

const KueskiRedirectionPage = () => {
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const aprobarTransaccion = async () => {
      if (!searchParams) return;

      const status = searchParams.get("status");
      const transaccionId = searchParams.get("transaccion_id");

      if (status === "success" && transaccionId) {
        const { error } = await supabase
          .from("transacciones")
          .update({ status: "approved" })
          .eq("id", transaccionId);

        if (error) {
          console.error("Error actualizando transacción:", error);
        }
      }
    };

    aprobarTransaccion();
  }, [searchParams, supabase]);

  const status = searchParams?.get("status");
  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen bg-[#fdf6e3] flex flex-col">
      {/* Navbar full width */}
      <div className="w-full">
        <Navbar/>
      </div>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md w-full border border-[#e0d7c5]">
          <h1 className="text-4xl font-extrabold text-[#c18f54] mb-4">Kueski Pay</h1>
          <p className="text-lg text-gray-700 mb-4"><b>Revisa tu correo para proceder con el pago.</b></p>
          <p className="text-2xl font-semibold mb-6">
            Estado de la solicitud de pago:{' '}
            <span className={isSuccess ? 'text-green-600' : 'text-red-600'}>
              {isSuccess ? '✅ Éxito' : '❌ Rechazado'}
            </span>
          </p>
          <img
            src="/CactusJack.png"
            alt="CactusJack logo"
            className="h-48 mx-auto object-contain rounded-xl shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default KueskiRedirectionPage;
