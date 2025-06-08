import { Suspense } from 'react';
import KueskiRedirectionPage from './KueskiRedireccion'

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
      <KueskiRedirectionPage />
    </Suspense>
  );
}
