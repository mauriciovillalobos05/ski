"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PagoClient = () => {
  const [payment, setPayment] = useState(false);
  const searchParams = useSearchParams();
  const fecha = searchParams.get("fecha");
  const router = useRouter();

  const handlePagar = () => {
    router.push(
      `/cliente/reserva/confirmacion?terraza=Oh Jacques!&fecha=${fecha}&price=1500&anfitrion=Jacques Webster&email=laflame@terrazasjack.com`
    );
  };

  const fechaFormateada = fecha
    ? new Date(fecha).toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Sin fecha seleccionada";

  return (
    <div className="min-h-screen bg-[#967B6C]">
      <Navbar />
      <div className="flex justify-center items-center px-4 mt-10">
        {!payment ? (
          <>
            <div className="bg-[#d4d2d5] rounded-3xl shadow-xl flex p-6 gap-6 w-full max-w-5xl mb-3">
              <div className="flex-shrink-0 w-1/2">
                <Image
                  src="/trexx.jpg"
                  alt="Terraza"
                  width={600}
                  height={400}
                  className="rounded-2xl object-cover h-full w-full"
                />
              </div>

              <div className="w-1/2 flex flex-col justify-center bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-3xl font-bold text-[#794645] mb-4 text-center">
                  Resumen de pago
                </h2>

                <div className="text-center">
                  <p className="text-xl text-[#794645] font-semibold mb-2">
                    Oh Jacques!
                  </p>
                  <p className="text-lg text-[#794645] mb-2">$1500</p>
                  <p className="text-md text-[#794645] mb-4">
                    {fechaFormateada}
                  </p>

                  <button
                    onClick={handlePagar}
                    className="bg-[#D9CACF] px-6 py-3 rounded-full text-black hover:opacity-90 transition text-lg"
                  >
                    Pagar con Kueski
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold text-[#191919] mb-10 text-center">
              ¡Revisa tu correo y haz click en el link de pago para continuar
              con el Rodeo!
            </h1>
            <div className="mb-6">
              <img
                src="/CactusJack.png"
                alt="CactusJack logo"
                className="h-120 object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagoClient;
