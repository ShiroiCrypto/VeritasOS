import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VeritasOS | Ordo Realitas Management Suite',
  description: 'Plataforma de gerenciamento para mestres de RPG - Ordem Paranormal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

