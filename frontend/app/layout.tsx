import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'MiPuntoDeVenta',
  description: 'Punto de venta simple para Costa Rica',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-CR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
