'use client';

import { useState } from 'react';
import TerminalLayout from '@/components/TerminalLayout';
import { Users, Sparkles, Save } from 'lucide-react';

interface NPC {
  name: string;
  origin: string;
  nex: number;
  agi: number;
  for: number;
  int: number;
  pre: number;
  vig: number;
  highlight_skill: string;
  dark_secret: string;
}

export default function RecruitmentPage() {
  const [theme, setTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNPC, setGeneratedNPC] = useState<NPC | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!theme.trim()) {
      setError('Por favor, descreva o tema do NPC');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedNPC(null);

    try {
      // Buscar table_token do localStorage
      const tableToken = typeof window !== 'undefined' 
        ? localStorage.getItem('veritas_table_token') 
        : null;

      if (!tableToken) {
        setError('Token da mesa não encontrado. Configure a mesa primeiro.');
        return;
      }

      const response = await fetch('/api/generate-npc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          theme,
          table_token: tableToken,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao gerar NPC');
      }

      const npc = await response.json();
      setGeneratedNPC(npc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedNPC) return;

    setIsSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      const response = await fetch('/api/npcs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...generatedNPC,
          table_token: localStorage.getItem('veritas_table_token') || 'PROJETO_GAIA', // Fallback temporário
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao salvar NPC');
      }

      setSaved(true);
      
      // Resetar o estado após 2 segundos para permitir novo salvamento se necessário
      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TerminalLayout mode="master">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Users size={24} className="text-terror-accent" />
          <h1 className="glitch-text text-3xl font-bold text-glow">
            Recrutamento
          </h1>
        </div>

        <div className="dossier-card mb-6">
          <h2 className="text-terror-accent font-bold mb-4 flex items-center gap-2">
            <Sparkles size={20} />
            Gerar NPC com IA
          </h2>
          <p className="text-terror-text-secondary text-sm mb-4">
            Descreva o tema ou contexto do NPC que deseja criar. A IA gerará um personagem completo com atributos, origem e um segredo obscuro.
          </p>
          
          <div className="space-y-4">
            <textarea
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ex: Um médico que trabalha em um hospital abandonado, suspeito de experimentos com pacientes..."
              className="w-full bg-terror-bg terminal-border p-4 text-terror-text placeholder-terror-text-secondary focus:outline-none focus:border-terror-accent resize-none"
              rows={4}
            />
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="terminal-border px-6 py-3 text-terror-text hover:bg-terror-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Sparkles size={18} />
              {isGenerating ? 'Gerando...' : 'Gerar NPC'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-terror-accent/20 terminal-border">
              <p className="text-terror-accent text-sm">{error}</p>
            </div>
          )}
        </div>

        {generatedNPC && (
          <div 
            className={`dossier-card transition-all duration-300 ${
              saved 
                ? 'animate-glitch border-terror-accent shadow-[0_0_20px_rgba(153,0,0,0.5)]' 
                : ''
            }`}
            style={saved ? { 
              boxShadow: '0 0 30px rgba(153, 0, 0, 0.8), inset 0 0 30px rgba(153, 0, 0, 0.2)',
              animation: 'glitch 0.3s ease-in-out'
            } : {}}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-terror-accent font-bold text-xl">
                {generatedNPC.name}
              </h2>
              <div className="flex items-center gap-2">
                {saved && (
                  <span className="text-terror-accent text-sm text-glow animate-flicker">
                    ARQUIVADO
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={isSaving || saved}
                  className="terminal-border px-4 py-2 text-terror-text hover:bg-terror-accent/20 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {isSaving ? 'Arquivando...' : saved ? 'Arquivado' : 'Salvar no Dossiê'}
                </button>
              </div>
            </div>

            {saveError && (
              <div className="mb-4 p-3 bg-terror-accent/20 terminal-border">
                <p className="text-terror-accent text-sm">{saveError}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <p className="text-terror-text-secondary text-sm">Origem</p>
                <p className="text-terror-text">{generatedNPC.origin}</p>
              </div>

              <div>
                <p className="text-terror-text-secondary text-sm mb-2">Atributos</p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  <div>
                    <p className="text-terror-text-secondary text-xs">NEX</p>
                    <p className="text-terror-text font-bold">{generatedNPC.nex}%</p>
                  </div>
                  <div>
                    <p className="text-terror-text-secondary text-xs">AGI</p>
                    <p className="text-terror-text font-bold">{generatedNPC.agi}</p>
                  </div>
                  <div>
                    <p className="text-terror-text-secondary text-xs">FOR</p>
                    <p className="text-terror-text font-bold">{generatedNPC.for}</p>
                  </div>
                  <div>
                    <p className="text-terror-text-secondary text-xs">INT</p>
                    <p className="text-terror-text font-bold">{generatedNPC.int}</p>
                  </div>
                  <div>
                    <p className="text-terror-text-secondary text-xs">PRE</p>
                    <p className="text-terror-text font-bold">{generatedNPC.pre}</p>
                  </div>
                  <div>
                    <p className="text-terror-text-secondary text-xs">VIG</p>
                    <p className="text-terror-text font-bold">{generatedNPC.vig}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-terror-text-secondary text-sm">Perícia de Destaque</p>
                <p className="text-terror-text">{generatedNPC.highlight_skill}</p>
              </div>

              <div className="terminal-border p-4 bg-terror-accent/10">
                <p className="text-terror-text-secondary text-sm mb-2">Segredo Obscuro</p>
                <p className="text-terror-text italic">{generatedNPC.dark_secret}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </TerminalLayout>
  );
}

