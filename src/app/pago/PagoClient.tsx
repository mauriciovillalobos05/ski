import { useRouter } from "next/navigation";
import { useState } from "react";
import Kueski_button from '@/app/components/kueski/kueski_button';

const PagoClient = () => {
  const router = useRouter();
  const [estado, setEstado] = useState(false); // Ejemplo de uso local

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col items-center">
        {estado ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-4 text-center text-[#191919]">
                Confirmación de Pago
              </h2>
              <p className="text-gray-700 text-center mb-6">
                Gracias por tu compra. Tu pago ha sido recibido.
              </p>
              <div className="flex justify-center">
                {/* Botón para pagar con Kueski */}
                <Kueski_button />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold text-[#191919] mb-10 text-center">
              ¡Revisa tu correo y haz click en el link de pago para continuar con el Rodeo!
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
