'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/app/components/Navbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Reserva {
  id: string;
  terraza_id: string;
  terraza_nombre: string;
  image_url: string | null;
  anfitrion_nombre: string;
  anfitrion_contacto: string;
  amount: number;
  reservation_date: string;
  status: string;
}

const Reserva = () => {
  const supabase = createClientComponentClient();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchReservas = async () => {
      setLoading(true);
      setErrorMsg('');

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error al obtener usuario:', userError);
        setErrorMsg('No se pudo obtener el usuario. Intenta iniciar sesión de nuevo.');
        setLoading(false);
        return;
      }

      console.log('🧾 ID del usuario autenticado:', user.id);

      const { data, error } = await supabase.rpc('get_reservas_usuario', {
        cliente_id_param: user.id,
      });

      if (error) {
        console.error('❌ Error al obtener las reservas:', error);
        setErrorMsg('Hubo un problema al cargar tus reservas. Intenta de nuevo más tarde.');
      } else {
        console.log('📦 Reservas obtenidas:', data);
        setReservas(data || []);
      }

      setLoading(false);
    };

    fetchReservas();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#E0CFAA]">
      <Navbar />
      <h1 className="text-5xl font-serif mb-8 text-[#191919] px-10 pt-10">
        PONLE UBICACIÓN AL RODEO
      </h1>

      <div className="flex flex-wrap justify-center gap-8 px-4 mt-10">
        {loading ? (
          <p className="text-white text-xl mt-20 animate-pulse">Cargando reservas...</p>
        ) : errorMsg ? (
          <p className="text-red-700 text-lg mt-20">{errorMsg}</p>
        ) : reservas.length > 0 ? (
          reservas.map((reserva) => (
            <div
              key={reserva.id}
              className="bg-[#B6A178] p-6 rounded-3xl shadow-xl max-w-sm w-full"
            >
              {reserva.image_url && (
                <img
                  src={reserva.image_url}
                  alt={reserva.terraza_nombre}
                  className="w-full h-48 object-cover rounded-2xl mb-4"
                />
              )}
              <h2 className="text-2xl font-bold text-[#5A3825] mb-2">
                {reserva.terraza_nombre}
              </h2>
              <p className="text-[#794645] mb-1">
                Fecha:{' '}
                {new Intl.DateTimeFormat('es-MX', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC',
                }).format(new Date(reserva.reservation_date))}
              </p>
              <p className="text-[#794645] mb-1">
                Monto: ${reserva.amount?.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
              </p>
              <p className="text-[#794645] mb-1">
                Anfitrión: {reserva.anfitrion_nombre ?? 'Desconocido'}
              </p>
              <p className="text-[#794645] mb-2">
                Contacto: {reserva.anfitrion_contacto ?? 'No disponible'}
              </p>
              <p className="text-sm text-white bg-[#7B5E3C] rounded px-2 py-1 inline-block">
                Estado: {reserva.status ?? 'Desconocido'}
              </p>
            </div>
          ))
        ) : (
          <p className="text-white text-lg mt-20">Aún no tienes reservas.</p>
        )}
      </div>
    </div>
  );
};

export default Reserva;