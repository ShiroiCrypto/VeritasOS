import TerminalLayout from '@/components/TerminalLayout';
import { Eye } from 'lucide-react';

export default function MonitorPage() {
  return (
    <TerminalLayout mode="master">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Eye size={24} className="text-terror-accent" />
          <h1 className="glitch-text text-3xl font-bold text-glow">
            Monitor de Mesa
          </h1>
        </div>
        
        <div className="dossier-card">
          <p className="text-terror-text-secondary">
            Lista de jogadores online com barras de vida/sanidade editáveis.
            <br />
            <span className="text-terror-accent">Em desenvolvimento...</span>
          </p>
        </div>
      </div>
    </TerminalLayout>
  );
}

