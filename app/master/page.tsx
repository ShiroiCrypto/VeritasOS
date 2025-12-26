import TerminalLayout from '@/components/TerminalLayout';
import { LayoutDashboard } from 'lucide-react';
import NpcList from '@/components/NpcList';

export default function MasterDashboard() {
  return (
    <TerminalLayout mode="master">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <LayoutDashboard size={24} className="text-terror-accent" />
          <h1 className="glitch-text text-3xl font-bold text-glow">
            Dashboard do Mestre
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="dossier-card">
            <h3 className="text-terror-accent font-bold mb-2">Recrutamento</h3>
            <p className="text-terror-text-secondary text-sm">
              Gere NPCs usando IA para sua mesa
            </p>
          </div>
          
          <div className="dossier-card">
            <h3 className="text-terror-accent font-bold mb-2">Mural de Investigação</h3>
            <p className="text-terror-text-secondary text-sm">
              Notas compartilhadas com todos os jogadores
            </p>
          </div>
          
          <div className="dossier-card">
            <h3 className="text-terror-accent font-bold mb-2">Monitor de Mesa</h3>
            <p className="text-terror-text-secondary text-sm">
              Acompanhe o status dos agentes em tempo real
            </p>
          </div>
        </div>

        <NpcList />
      </div>
    </TerminalLayout>
  );
}

