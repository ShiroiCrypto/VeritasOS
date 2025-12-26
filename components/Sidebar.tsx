'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Eye, 
  BookOpen,
  Home,
  Settings,
  UserCog
} from 'lucide-react';

interface SidebarProps {
  mode: 'master' | 'player';
}

export default function Sidebar({ mode }: SidebarProps) {
  const pathname = usePathname();

  const masterLinks = [
    { href: '/master', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/master/setup', label: 'Configuração', icon: Settings },
    { href: '/master/users', label: 'Usuários', icon: UserCog },
    { href: '/master/recruitment', label: 'Recrutamento', icon: Users },
    { href: '/master/investigation', label: 'Mural de Investigação', icon: FileText },
    { href: '/master/monitor', label: 'Monitor de Mesa', icon: Eye },
  ];

  const playerLinks = [
    { href: '/player', label: 'Ficha', icon: LayoutDashboard },
    { href: '/player/diary', label: 'Diário de Agente', icon: BookOpen },
  ];

  const links = mode === 'master' ? masterLinks : playerLinks;

  return (
    <aside className="w-64 terminal-border bg-terror-bg/90 backdrop-blur-sm h-screen fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-terror-accent/30">
        <Link href="/" className="block">
          <h2 className="glitch-text text-xl font-bold text-glow">
            VERITAS<span className="text-terror-accent">OS</span>
          </h2>
        </Link>
        <p className="text-terror-text-secondary text-xs mt-1">
          {mode === 'master' ? 'Terminal do Mestre' : 'Terminal do Agente'}
        </p>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2 transition-colors ${
                    isActive
                      ? 'bg-terror-accent/20 text-terror-accent border-l-2 border-terror-accent'
                      : 'text-terror-text-secondary hover:text-terror-text hover:bg-terror-accent/10'
                  }`}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-terror-text-secondary hover:text-terror-text transition-colors"
        >
          <Home size={18} />
          <span>Início</span>
        </Link>
      </div>
    </aside>
  );
}

