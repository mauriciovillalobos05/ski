import { Suspense } from 'react';
import Success from './Success';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
      <Success />
    </Suspense>
  );
}