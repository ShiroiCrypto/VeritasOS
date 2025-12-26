import TerminalLayout from '@/components/TerminalLayout';
import { FileText } from 'lucide-react';

export default function InvestigationPage() {
  return (
    <TerminalLayout mode="master">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={24} className="text-terror-accent" />
          <h1 className="glitch-text text-3xl font-bold text-glow">
            Mural de Investigação
          </h1>
        </div>
        
        <div className="dossier-card">
          <p className="text-terror-text-secondary">
            Notas compartilhadas visíveis para todos os jogadores logados.
            <br />
            <span className="text-terror-accent">Em desenvolvimento...</span>
          </p>
        </div>
      </div>
    </TerminalLayout>
  );
}

