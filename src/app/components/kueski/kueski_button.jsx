import React from "react";

const Kueski_button = () => {

  // Mock
  const handleMockPago = () => {
    alert("Simulando redirección a Kueski Pay...");
    const mockRedirectUrl = "/kueski_simulado?status=success";
    window.location.href = mockRedirectUrl;
  };

  // Funcion de redirección 
  const handlePago = async () => {
    const response = await fetch("/api/pagos/kueski", { method: "POST" });
    const data = await response.json();
    if (data.callback.on_success) {
      window.location.href = data.callback_url;
    } else {
      alert("Error al iniciar pago");
    }
  };

  return (
    <button
      onClick={handleMockPago}
      className="bg-[#D9CACF] px-30 py-3 rounded-full text-black hover:opacity-70 transition text-lg"
    >
      Pagar con Kueski
    </button>
  );
}

export default Kueski_button;
