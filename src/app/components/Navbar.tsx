'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const Navbar: React.FC = () => {
  const pathname = usePathname();

  const isDashboard = pathname === '/cliente/dashboard';
  const isTerraza = pathname === '/cliente/terraza';
  const isReservas =
  pathname === '/cliente/reserva' ||
  pathname === '/cliente/reserva/confirmacion';
  const isPago = pathname === '/pago';

  const navBg = isDashboard || isTerraza ? 'bg-[#a87e66]' : isReservas ? 'bg-[#8E9700]' : isPago ? 'bg-[#605B5B]' : 'bg-gray-600';
  const buttonBg = isDashboard || isTerraza || isPago ? 'bg-[#d1b7a3]' : isReservas ? 'bg-[#292826]' : 'bg-gray-600';

  return (
    <nav className={`flex justify-between items-center ${navBg} text-white px-6 py-4 transition-colors duration-300 mb-10`}>
      <div className="flex items-center gap-2">
        <img src="/Jack.png" alt="Logo" className="w-20 h-12" />
      </div>
      <div className="flex gap-4">
        <Link href="/cliente/dashboard" className="hover:underline mx-5">Inicio</Link>
        <Link href="/cliente/reserva" className="hover:underline mx-20">Reservas</Link>
        <Link href="/" className={`${buttonBg} text-white px-3 py-1 rounded-md hover:opacity-80 text-sm`}>
          Cerrar Sesión
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
