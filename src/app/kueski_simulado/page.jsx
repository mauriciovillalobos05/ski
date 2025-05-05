'use client';

import { useSearchParams } from 'next/navigation';

const KueskiSimuladoPage = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

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

