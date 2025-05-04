"use client";

import React, { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Terraza: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="min-h-screen bg-[#c18f54]">
      <Navbar />
      <main className="flex justify-center items-center mt-16 px-4">
        <div className="bg-[#d4d2d5] rounded-3xl shadow-xl flex p-6 gap-6 w-full max-w-5xl">
          <div className="flex-shrink-0 w-1/2">
            <img
              src="/trexx.jpg"
              alt="Terraza"
              className="rounded-2xl h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between w-1/2">
            <div>
              <h2 className="text-2xl font-bold text-[#794645] mb-1">
                Oh Jacques!
              </h2>
              <p className="text-[#794645]">Calle LaFlame #12</p>
              <p className="italic text-[#794645]">
                Fall in love with the desert!
              </p>
              <p className="text-[#794645] mt-2">$1500 p/día</p>
              <p className="text-[#794645] mb-2">100 personas</p>

              <p className="text-sm font-semibold text-[#794645]">
                Seleccione el día
              </p>
              <div className="bg-white rounded-md mt-2 overflow-hidden w-fit">
                <Calendar
                  onChange={(value) => setSelectedDate(value as Date)}
                  value={selectedDate}
                  locale="es-ES"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Link
                href={{
                  pathname: "/pago",
                  query: { fecha: selectedDate?.toISOString() || "" },
                }}
                className={`bg-[#d29065] px-6 py-2 rounded-full text-white hover:opacity-90 transition ${
                  !selectedDate ? "pointer-events-none opacity-50" : ""
                }`}
              >
                PAGAR
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terraza;
