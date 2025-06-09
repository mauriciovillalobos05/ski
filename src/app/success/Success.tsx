// app/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "../components/Navbar";

export default function Success() {
  const [fecha, setFecha] = useState<string | null>(null);
  const [monto, setMonto] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const updateStates = async () => {
      const transaccionId = searchParams?.get("transaccion_id");
      const terrazaId = searchParams?.get("terraza_availability_id");

      if (!transaccionId || !terrazaId) return;

      const { data: transaccion, error: fetchError } = await supabase
        .from("transacciones")
        .select("reservation_date, amount")
        .eq("id", transaccionId)
        .single();

      if (fetchError || !transaccion) {
        console.error("Error obteniendo transacción:", fetchError);
        return;
      }

      setFecha(transaccion.reservation_date);
      setMonto(transaccion.amount);

      const { error: errorTransaccion } = await supabase
        .from("transacciones")
        .update({ status: "approved" })
        .eq("id", transaccionId);

      if (errorTransaccion) {
        console.error("Error actualizando transacción:", errorTransaccion);
      }

      const { data: disponibilidad } = await supabase
        .from("terraza_availability")
        .select("status")
        .eq("terraza_id", terrazaId)
        .eq("available_date", transaccion.reservation_date)
        .maybeSingle();

      if (disponibilidad) {
        const { error: errorDisponibilidad } = await supabase
          .from("terraza_availability")
          .update({ status: "confirmed" })
          .eq("terraza_id", terrazaId)
          .eq("available_date", transaccion.reservation_date);

        if (errorDisponibilidad) {
          console.error("Error actualizando disponibilidad:", errorDisponibilidad);
        }
      } else {
        console.warn("No se encontró la disponibilidad para actualizar.");
      }
    };

    updateStates();
  }, [searchParams]);

  if (!fecha || !monto) {
    return <p className="text-center p-6">Cargando detalles de la reserva...</p>;
  }

  const [year, month, day] = fecha.split("-").map(Number);
  const fechaLocal = new Date(year, month - 1, day);
  const fechaFormateada = fechaLocal.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#dcc9a2]">
      <Navbar />
      <div className="bg-[#b6996e] rounded-2xl p-10 w-[90%] max-w-xl shadow-md">
        <h1 className="text-3xl font-bold text-black mb-6">Confirmación de tu reserva</h1>
        <p className="text-2xl font-bold text-white mb-4">${monto}</p>
        <p className="text-lg text-white font-semibold mb-4">
          Fecha de la reservación: {fechaFormateada}
        </p>
        <div className="mt-8">
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-[#868b04] text-black font-semibold px-6 py-2 rounded-full hover:bg-[#6e7203] transition"
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
}
