'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [rolePrefix, setRolePrefix] = useState('cliente'); // Default to 'cliente'

  useEffect(() => {
    if (pathname.startsWith('/anfitrion')) {
      setRolePrefix('anfitrion');
    } else {
      setRolePrefix('cliente');
    }
  }, [pathname]);

  const isDashboard = pathname === `/${rolePrefix}/dashboard`;
  const isTerraza = pathname === `/${rolePrefix}/terraza`;
  const isReservas =
    pathname === `/${rolePrefix}/reserva` ||
    pathname === `/${rolePrefix}/reserva/confirmacion`;
  const isPago = pathname === '/pago';

  const navBg = isDashboard || isTerraza
    ? 'bg-[#a87e66]'
    : isReservas
    ? 'bg-[#8E9700]'
    : isPago
    ? 'bg-[#605B5B]'
    : 'bg-gray-600';

  const buttonBg = isDashboard || isTerraza || isPago
    ? 'bg-[#d1b7a3]'
    : isReservas
    ? 'bg-[#292826]'
    : 'bg-gray-600';

  return (
    <nav className={`flex justify-between items-center ${navBg} text-white px-6 py-4 transition-colors duration-300 mb-10`}>
      <div className="flex items-center gap-2">
        <img src="/Jack.png" alt="Logo" className="w-20 h-12" />
      </div>
      <div className="flex gap-4">
        <Link href={`/${rolePrefix}/dashboard`} className="hover:underline mx-5">Inicio</Link>
        <Link href={`/${rolePrefix}/reserva`} className="hover:underline mx-20">Reservas</Link>
        <Link href="/" className={`${buttonBg} text-white px-3 py-1 rounded-md hover:opacity-80 text-sm`}>
          Cerrar Sesión
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;