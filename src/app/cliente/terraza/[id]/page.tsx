"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Navbar from "@/app/components/Navbar";
import KueskiButton from "@/app/components/kueski/kueski_button";

const TerrazaPage = () => {
  const { id } = useParams();
  const supabase = createClientComponentClient();

  const [terraza, setTerraza] = useState<any>(null);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      // Cargar datos de la terraza
      const { data, error } = await supabase
        .from("terrazas")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error cargando terraza:", error);
        return;
      }

      setTerraza(data);

      // Cargar fechas bloqueadas (ya reservadas)
      const { data: blocked, error: blockError } = await supabase
        .from("terraza_availability")
        .select("available_date")
        .eq("terraza_id", id);

      if (blockError) {
        console.error("Error cargando disponibilidad:", blockError);
        return;
      }

      setBlockedDates(blocked.map((r) => r.available_date)); // formato 'yyyy-mm-dd'
      setLoading(false);
    };

    fetchData();
  }, [id, supabase]);

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const iso = date.toISOString().split("T")[0];
    return date < today || blockedDates.includes(iso);
  };

  if (loading) return <p className="text-white p-8">Cargando terraza...</p>;

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
              <p className="text-[#794645]">{terraza.description || "Sin descripción"}</p>
              <p className="text-[#794645] mt-2">${terraza.price} p/día</p>

              <p className="text-sm font-semibold text-[#794645] mt-4">
                Selecciona el día
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
              <KueskiButton selectedDate={selectedDate} terraza={terraza} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TerrazaPage;

