// app/reject/page.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "../components/Navbar";

export default function Reject() {
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const updateStates = async () => {
      const transaccionId = searchParams!.get("transaccion_id");
      const terrazaId = searchParams!.get("terraza_availability_id");

      if (!transaccionId || !terrazaId) return;

      const { data } = await supabase
        .from("transacciones")
        .select("reservation_date")
        .eq("id", transaccionId)
        .single();

      await supabase
        .from("transacciones")
        .update({ status: "rejected" })
        .eq("id", transaccionId);

      await supabase
        .from("terraza_availability")
        .update({ status: "rejected" })
        .eq("terraza_id", terrazaId)
        .eq("available_date", data?.reservation_date);
    };

    updateStates();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e9d6ae]">
      <Navbar />
      <div className="bg-[#bfa576] rounded-2xl p-10 w-[90%] max-w-xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-black mb-6">
          Confirmación de tu reserva
        </h1>
        <p className="text-2xl font-bold text-red-600 mb-6">Pago Rechazado</p>
        <div className="flex justify-center mb-6">
          <img src="/CactusJack.png" alt="Cactus Jack" className="w-32 h-auto" />
        </div>
        <button
          onClick={() => (window.location.href = "/")}
          className="bg-[#9da100] text-black font-semibold px-6 py-2 rounded-full hover:bg-[#7f8200] transition"
        >
          Regresar a Inicio
        </button>
      </div>
    </div>
  );
}
