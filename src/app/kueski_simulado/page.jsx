'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const KueskiSimuladoPage = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const transaccionId = searchParams.get("transaccion_id");

  const supabase = createClientComponentClient();

  useEffect(() => {
    const aprobarTransaccion = async () => {
      if (status === "success" && transaccionId) {
        const { error } = await supabase
          .from("transacciones")
          .update({ status: "approved" })
          .eq("id", transaccionId)

        if (error) {
          console.error("Error actualizando transacción simulada:", error);
        }
      }
    }

    aprobarTransaccion();
  }, [status, transaccionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0e8e8] text-[#794645]">
      <h1 className="text-4xl font-bold mb-4">Kueski Pay (Simulado)</h1>
      <p className="text-xl">
        Estado del pago: <strong>{status === "success" ? "Éxito" : "Fallido"}</strong>
      </p>
    </div>
  );
};

export default KueskiSimuladoPage;