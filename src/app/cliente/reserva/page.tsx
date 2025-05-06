'use client';

import Navbar from '@/app/components/Navbar';

const Confirmacion = () => {

  return (
    <div className="min-h-screen bg-[#E0CFAA]">
      <Navbar />
      <h1 className="text-5xl md:text-4xl font-serif mb-8 text-brown-3text-5xl md:text-4xl font-serif mb-5 text-[#191919] px-10">
        PONLE UBICACIÓN AL RODEO
      </h1>
      <div className="flex justify-center items-center px-4 mt-20">
        <div className="bg-[#B6A178] p-10 rounded-3xl shadow-xl max-w-lg w-full">
              <h1 className="text-3xl font-bold text-[#5A3825] mb-6">Oh Jacques!</h1>
              <p className="text-lg text-[#794645] mb-2">10 de mayo del 2025</p>
              <p className="text-lg text-[#794645] mb-2">$1500 MXN</p>
              <p className="text-lg text-[#794645] mb-2">Jacques Webster</p>
              <p className="text-lg text-[#794645] mb-4">laflame@terrazasjack.com </p>
              <strong className="text-lg text-[#794645]">RECUERDA NO EXCEDER EL CUPO</strong>             
            </div>
      </div>
    </div>
  );
};

export default Confirmacion;
