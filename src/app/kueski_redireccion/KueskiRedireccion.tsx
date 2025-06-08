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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0e8e8] text-[#794645]">
      <Navbar />
      <h1 className="text-4xl font-bold mb-4">Kueski Pay (Revisa tu correo)</h1>
      <p className="text-xl">
        Estado del pago:{' '}
        <strong>{status === 'success' ? 'Éxito' : 'Fallido'}</strong>
      </p>
      <div className="flex justify-center items-center mb-6">
        <img
          src="/CactusJack.png"
          alt="CactusJack logo"
          className="h-55 object-contain"
        />
      </div>
    </div>
  );
};

export default KueskiRedirectionPage;