"use client";

import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Terraza {
  id: string;
  name: string;
  price: number;
}

const Kueski_button = ({
  selectedDate,
  terraza,
}: {
  selectedDate: Date | null;
  terraza: Terraza;
}) => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handlePago = async () => {
    if (!selectedDate || !terraza) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userError || !user) {
      alert("Debes iniciar sesión para reservar.");
      return;
    }

    const fechaISO = selectedDate.toISOString().split("T")[0];

    const { data: disponibilidad, error: checkError } = await supabase
      .from("terraza_availability")
      .select("*")
      .eq("terraza_id", terraza.id)
      .eq("available_date", fechaISO);

    if (checkError) {
      alert("Error al verificar disponibilidad.");
      return;
    }

    if (disponibilidad.length > 0) {
      alert("Esta fecha ya está reservada.");
      return;
    }

    const { data: transaccion, error: transError } = await supabase
      .from("transacciones")
      .insert({
        cliente_id: user.id,
        terraza_id: terraza.id,
        reservation_date: fechaISO,
        status: "pending",
        amount: terraza.price,
      })
      .select()
      .single();

    if (transError) {
      alert("No se pudo registrar la transacción.");
      return;
    }

    const { data: availability, error: availError } = await supabase
      .from("terraza_availability")
      .insert({
        terraza_id: terraza.id,
        available_date: fechaISO,
        status: "pending",
      })
      .select()
      .single();

    if (availError) {
      alert("No se pudo bloquear la fecha.");
      return;
    }

    const response = await fetch("/api/rename", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionId: transaccion.id,
        availabilityId: availability.id, // 👈 Se pasa availabilityId
        name: user.user_metadata.full_name || "Usuario",
        email: user.email,
        phone: user.user_metadata.phone || "0000000000",
      }),
    });

    const result = await response.json();

    if (result.status === "success") {
      await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: user.email,
          subject: "Confirmación de reserva",
          body: `Hola ${
            user.user_metadata.full_name || "usuario"
          },\n\nTu reserva de la terraza '${
            terraza.name
          }' para el ${fechaISO} ha sido registrada exitosamente.\n\nPara terminar el proceso has click en la siguiente liga y proceder con tu pago`,
          callback_url: result.data.callback_url,
        }),
      });

      router.push(
        `/kueski_redireccion?status=success&transaccion_id=${transaccion.id}&terraza_availability_id=${availability.id}`
      );
    } else {
      alert("Error en la conexión con Kueski.");
    }
  };

  return (
    <button
      onClick={handlePago}
      disabled={!selectedDate}
      className={`flex items-center gap-2 px-3 py-0 rounded-full border border-[#00B5B0] text-[#00B5B0] bg-[#ffffff] font-semibold hover:bg-[#00B5B0]/10 transition ${
        !selectedDate ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <span className="text-sm">Pagar con</span>
      <img src="/kueski_logo.png" className="h-8 w-auto" />
    </button>
  );
};

export default Kueski_button;