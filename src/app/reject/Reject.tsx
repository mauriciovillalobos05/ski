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
      const transaccionId = searchParams?.get("transaccion_id");
      const terrazaId = searchParams?.get("terraza_availability_id");

      if (!transaccionId || !terrazaId) return;

      // Obtener la fecha de la reserva
      const { data: transaccion, error: fetchError } = await supabase
        .from("transacciones")
        .select("reservation_date")
        .eq("id", transaccionId)
        .single();

      if (fetchError || !transaccion) {
        console.error("Error obteniendo transacción:", fetchError);
        return;
      }

      // Consultar disponibilidad actual de la terraza
      const { data: disponibilidad, error: errorDisponibilidadFetch } = await supabase
        .from("terraza_availability")
        .select("status")
        .eq("terraza_id", terrazaId)
        .eq("available_date", transaccion.reservation_date)
        .maybeSingle();

      if (errorDisponibilidadFetch || !disponibilidad) {
        console.warn("No se encontró la disponibilidad para actualizar.");
        return;
      }

      if (disponibilidad.status === "confirmed") {
        console.warn("La disponibilidad ya está aprobada. No se puede marcar como rechazada.");
        return;
      }

      // Actualizar estado de transacción a 'rejected'
      const { error: errorTransaccion } = await supabase
        .from("transacciones")
        .update({ status: "rejected" })
        .eq("id", transaccionId);

      if (errorTransaccion) {
        console.error("Error actualizando transacción:", errorTransaccion);
      } else {
        console.log("Transacción actualizada correctamente.");
      }

      // Actualizar disponibilidad de terraza a 'rejected'
      const { error: errorDisponibilidadUpdate } = await supabase
        .from("terraza_availability")
        .update({ status: "rejected" })
        .eq("terraza_id", terrazaId)
        .eq("available_date", transaccion.reservation_date);

      if (errorDisponibilidadUpdate) {
        console.error("Error actualizando disponibilidad:", errorDisponibilidadUpdate);
      } else {
        console.log("Disponibilidad actualizada correctamente.");
      }
    };

    updateStates();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-[#e9d6ae]">
      {/* Navbar */}
      <div className="w-full shadow-md bg-[#bfa576] z-10">
        <Navbar />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-[#bfa576] rounded-3xl p-10 w-full max-w-xl shadow-2xl border-4 border-[#ffffff20] backdrop-blur-sm text-center">
          <h1 className="text-4xl font-extrabold text-black mb-6 drop-shadow-sm">
            Confirmación de tu reserva
          </h1>

          <p className="text-2xl font-bold text-red-700 mb-6 animate-pulse">
            ❌ Pago Rechazado
          </p>

          <div className="flex justify-center mb-6">
            <img
              src="/CactusJack.png"
              alt="Cactus Jack"
              className="w-36 h-auto drop-shadow-lg rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
