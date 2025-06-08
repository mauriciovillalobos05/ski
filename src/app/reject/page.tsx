import { Suspense } from 'react';
import Reject from './Reject';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
      <Reject />
    </Suspense>
  );
}