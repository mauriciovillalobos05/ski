import { Suspense } from 'react';
import PagoClient from './PagoClient';

const PagoPage = () => {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Cargando...</div>}>
      <PagoClient />
    </Suspense>
  );
};

export default PagoPage;
