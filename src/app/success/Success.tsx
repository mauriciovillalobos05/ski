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

      // 1. Obtener la transacción actual
      const { data: transaccion, error: fetchError } = await supabase
        .from("transacciones")
        .select("reservation_date, amount, status")
        .eq("id", transaccionId)
        .single();

      if (fetchError || !transaccion) {
        console.error("Error obteniendo transacción:", fetchError);
        return;
      }

      setFecha(transaccion.reservation_date);
      setMonto(transaccion.amount);

      // 2. Solo actualizamos si aún está en 'pending'
      if (transaccion.status === "pending") {
        const { error: errorTransaccion } = await supabase
          .from("transacciones")
          .update({ status: "approved" })
          .eq("id", transaccionId);

        if (errorTransaccion) {
          console.error("Error actualizando transacción:", errorTransaccion);
        }
      }

      // 3. Confirmar disponibilidad solo si está en 'pending'
      const { data: disponibilidad } = await supabase
        .from("terraza_availability")
        .select("status")
        .eq("terraza_id", terrazaId)
        .eq("available_date", transaccion.reservation_date)
        .maybeSingle();

      if (disponibilidad && disponibilidad.status === "pending") {
        const { error: errorDisponibilidad } = await supabase
          .from("terraza_availability")
          .update({ status: "confirmed" })
          .eq("terraza_id", terrazaId)
          .eq("available_date", transaccion.reservation_date);

        if (errorDisponibilidad) {
          console.error("Error actualizando disponibilidad:", errorDisponibilidad);
        }
      } else {
        console.warn("No se encontró la disponibilidad o ya estaba confirmada.");
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
    <div className="min-h-screen bg-[#dcc9a2] flex flex-col">
      <div className="w-full shadow-lg bg-[#b6996e] z-10">
        <Navbar />
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-[#b6996e] rounded-3xl p-10 w-full max-w-xl shadow-2xl border-4 border-[#ffffff30] backdrop-blur-sm">
          <h1 className="text-4xl font-extrabold text-black mb-6 text-center drop-shadow-sm">
            Confirmación de tu reserva
          </h1>

          <p className="text-3xl font-bold text-white mb-4 text-center">
            ${monto}
          </p>

          <p className="text-lg text-white font-medium mb-6 text-center">
            Fecha de la reservación: <span className="font-semibold">{fechaFormateada}</span>
          </p>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-[#868b04] text-black font-semibold px-6 py-3 rounded-full hover:bg-[#6e7203] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Continuar →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}