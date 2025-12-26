import TerminalLayout from '@/components/TerminalLayout';
import { BookOpen } from 'lucide-react';

export default function DiaryPage() {
  return (
    <TerminalLayout mode="player">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={24} className="text-terror-accent" />
          <h1 className="glitch-text text-3xl font-bold text-glow">
            Diário de Agente
          </h1>
        </div>
        
        <div className="dossier-card">
          <p className="text-terror-text-secondary">
            Notas individuais secretas. Apenas você e o mestre podem ler.
            <br />
            <span className="text-terror-accent">Em desenvolvimento...</span>
          </p>
        </div>
      </div>
    </TerminalLayout>
  );
}

