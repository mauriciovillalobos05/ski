"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Kueski_button from "@/app/components/kueski/kueski_button";

const PagoClient: React.FC = () => {
  const searchParams = useSearchParams();
  const [estado] = useState(true);

  const fecha = searchParams.get("fecha");
  const terraza = searchParams.get("terraza");

  const fechaFormateada = fecha
    ? new Date(fecha).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-[#967B6C]">
      <Navbar />
      <main className="flex justify-center items-center mt-16 px-4">
        <div className="bg-[#ABABB1] rounded-3xl shadow-xl flex p-6 gap-6 w-full max-w-5xl">
          {/* Left: Image */}
          <div className="flex-shrink-0 w-1/2">
            <img
              src="/trexx.jpg"
              alt="Terraza"
              className="rounded-2xl h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center w-1/2">
            <h2 className="text-5xl font-bold mb-10 text-center text-[#191919]">
              Resumen de Pago
            </h2>
            <p className="text-xl font-semibold text-center text-[#191919] mb-2">
              Reservación de terraza Oh Jacques!
            </p>
            <p className="text-xl font-semibold text-center text-[#191919] mb-10">
              {fechaFormateada || "Sin fecha"}
            </p>
            <div className="flex justify-center">
              <Kueski_button />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PagoClient;
