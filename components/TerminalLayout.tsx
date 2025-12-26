'use client';

import Sidebar from './Sidebar';

interface TerminalLayoutProps {
  children: React.ReactNode;
  mode: 'master' | 'player';
}

export default function TerminalLayout({ children, mode }: TerminalLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar mode={mode} />
      <main className="flex-1 ml-64 p-8 relative z-0">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

