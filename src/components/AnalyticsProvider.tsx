'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview, saveUTMToSession } from '@/lib/analytics';

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Capturar y guardar parámetros UTM al cargar la página
    saveUTMToSession();
  }, []);

  useEffect(() => {
    // Track pageview cuando cambia la ruta
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
