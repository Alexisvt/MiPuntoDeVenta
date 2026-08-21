import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'MiPuntoDeVenta',
  description: 'Punto de venta simple para Costa Rica',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-CR">
      <body>{children}</body>
    </html>
  );
}
