"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Navbar from "@/app/components/Navbar";

const TerrazaPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const supabase = createClientComponentClient();

  const [terraza, setTerraza] = useState<any>(null);
  const [reservedDates, setReservedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from("terrazas")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error cargando terraza:", error);
        return;
      }

      setTerraza(data);

      const { data: reserved, error: resError } = await supabase
        .from("terraza_availability")
        .select("available_date")
        .eq("terraza_id", id);

      if (resError) {
        console.error("Error cargando disponibilidad:", resError);
        return;
      }

      const fechasOcupadas = reserved.map((r) => r.available_date);
      setReservedDates(fechasOcupadas);
    };

    fetchData();
  }, [id, supabase]);

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isoDate = date.toISOString().split("T")[0];
    return date < today || reservedDates.includes(isoDate);
  };

  const handlePago = async () => {
    if (!selectedDate) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userError || !user) {
      alert("Debes iniciar sesión para reservar.");
      return;
    }

    const fechaISO = selectedDate.toISOString().split("T")[0];

    // Paso 1: Verificar si la fecha ya está ocupada
    const { data: disponibilidad, error: checkError } = await supabase
      .from("terraza_availability")
      .select("*")
      .eq("terraza_id", id)
      .eq("available_date", fechaISO);

    if (checkError) {
      console.error("Error al verificar disponibilidad:", checkError);
      alert("Error al verificar disponibilidad.");
      return;
    }

    if (disponibilidad.length > 0) {
      alert("Esta fecha ya está reservada.");
      return;
    }

    // Paso 2: Insertar la transacción (aquí puede haber triggers que verifiquen consistencia)
    const { data: transaccion, error: transError } = await supabase
      .from("transacciones")
      .insert({
        user_id: user.id,
        terraza_id: id,
        reservation_date: fechaISO,
        status: "pending",
        amount: terraza.price,
      })
      .select()
      .single();

    if (transError) {
      console.error("Error al registrar transacción:", transError);
      alert("No se pudo registrar la transacción.");
      return;
    }

    // Paso 3: Insertar la fecha como ocupada
    const { error: availError } = await supabase
      .from("terraza_availability")
      .insert({
        terraza_id: id,
        available_date: fechaISO,
      });

    if (availError) {
      console.error("Error al marcar fecha como ocupada:", availError);
      alert("No se pudo bloquear la fecha seleccionada.");
      return;
    }

    // Simular redirección a pago
    router.push(
      `/kueski_simulado?status=success&transaccion_id=${transaccion.id}`
    );
  };

  if (!terraza) return <p className="text-white p-8">Cargando terraza...</p>;

  return (
    <div className="min-h-screen bg-[#c18f54]">
      <Navbar />
      <main className="flex justify-center items-center mt-16 px-4">
        <div className="bg-[#d4d2d5] rounded-3xl shadow-xl flex p-6 gap-6 w-full max-w-5xl">
          <div className="flex-shrink-0 w-1/2">
            <img
              src={terraza.image_url || "/placeholder.jpg"}
              alt={terraza.name}
              className="rounded-2xl h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between w-1/2">
            <div>
              <h2 className="text-2xl font-bold text-[#794645] mb-1">
                {terraza.name}
              </h2>
              <p className="text-[#794645]">
                {terraza.description || "Sin descripción"}
              </p>
              <p className="text-[#794645] mt-2">${terraza.price} p/día</p>

              <p className="text-sm font-semibold text-[#794645] mt-4">
                Seleccione el día
              </p>
              <div className="bg-white rounded-md mt-2 overflow-hidden w-fit">
                <Calendar
                  onChange={(value) => setSelectedDate(value as Date)}
                  value={selectedDate}
                  tileDisabled={({ date }) => isDateDisabled(date)}
                  locale="es-ES"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handlePago}
                className={`bg-[#d29065] px-6 py-2 rounded-full text-white hover:opacity-90 transition ${
                  !selectedDate ? "pointer-events-none opacity-50" : ""
                }`}
              >
                PAGAR
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TerrazaPage;
