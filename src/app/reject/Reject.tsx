"use client";

import Navbar from "../components/Navbar";

export default function Reject() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e9d6ae]">
      <Navbar />
      <div className="bg-[#bfa576] rounded-2xl p-10 w-[90%] max-w-xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-black mb-6">
          Confirmación de tu reserva
        </h1>

        <p className="text-2xl font-bold text-red-600 mb-6">Pago Rechazado</p>

        <div className="flex justify-center mb-6">
          <img
            src="/CactusJack.png"
            alt="Cactus Jack"
            className="w-32 h-auto"
          />
        </div>

        <button
          onClick={() => window.location.href = "/"}
          className="bg-[#9da100] text-black font-semibold px-6 py-2 rounded-full hover:bg-[#7f8200] transition"
        >
          Regresar a Inicio
        </button>
      </div>
    </div>
  );
}
