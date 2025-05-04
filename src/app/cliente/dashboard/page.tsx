import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#c18f54]">
      <Navbar />
      <h1 className="text-5xl md:text-4xl font-serif mb-8 text-brown-3text-5xl md:text-4xl font-serif mb-5 text-[#2D2429] px-10">
        ÚNETE AL RODEO
      </h1>
      <main className="flex justify-center items-center mt-16">
        <div className="bg-[#d4d2d5] w-96 rounded-2xl shadow-xl p-4">
          <img
            src="/trexx.jpg"
            alt="Terraza"
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
          <h2 className="text-lg font-semibold text-[#794645]">Oh Jacques!</h2>
          <p className="text-[#794645]">Calle LaFlame #12</p>
          <p className="italic text-[#794645]">Fall in love with the desert!</p>
          <p className="text-[#794645]">$1500 p/día</p>
          <p className="text-[#794645] mb-2">100 personas</p>
          <p className="text-sm font-semibold text-[#794645]">Anfitrión: Jacques Webster</p>
          <p className="text-sm font-semibold text-[#794645]">laflame@terrazasjack.com</p>
          <div className="flex">
            <Link className="ml-auto mt-4 bg-[#d29065] px-4 py-2 rounded-[20px] hover:opacity-90" href={'/cliente/terraza'}>
            <button>
                RESERVAR
            </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
