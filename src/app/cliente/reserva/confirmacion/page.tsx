import { Suspense } from 'react';
import Confirmacion from './Confirmacion';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
      <Confirmacion />
    </Suspense>
  );
}
