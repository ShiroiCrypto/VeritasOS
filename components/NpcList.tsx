'use client';

import { useEffect, useState } from 'react';
import { FileText, Eye } from 'lucide-react';

interface NPC {
  id: number;
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
  created_at: string;
}

interface NpcListProps {
  tableToken?: string;
}

export default function NpcList({ tableToken }: NpcListProps) {
  // Se não fornecido, tentar pegar do localStorage (fallback temporário)
  const effectiveTableToken = tableToken || (typeof window !== 'undefined' ? localStorage.getItem('veritas_table_token') : null) || 'PROJETO_GAIA';
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);

  useEffect(() => {
    loadNPCs();
  }, [effectiveTableToken]);

  const loadNPCs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/npcs?table_token=${effectiveTableToken}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao carregar NPCs');
      }

      const data = await response.json();
      setNpcs(data.npcs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dossier-card">
        <p className="text-terror-text-secondary">Consultando o Dossiê...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dossier-card">
        <p className="text-terror-accent text-sm">{error}</p>
      </div>
    );
  }

  if (npcs.length === 0) {
    return (
      <div className="dossier-card">
        <p className="text-terror-text-secondary text-sm">
          Nenhum contato arquivado no Dossiê ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="dossier-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-terror-accent font-bold flex items-center gap-2">
            <FileText size={18} />
            Dossiê de Contatos ({npcs.length})
          </h3>
        </div>

        <div className="space-y-2">
          {npcs.map((npc) => (
            <div
              key={npc.id}
              className="terminal-border p-3 hover:bg-terror-accent/10 transition-colors cursor-pointer"
              onClick={() => setSelectedNPC(selectedNPC?.id === npc.id ? null : npc)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-terror-text font-bold">{npc.name}</p>
                  <p className="text-terror-text-secondary text-xs">
                    {npc.origin} • NEX {npc.nex}%
                  </p>
                </div>
                <Eye size={16} className="text-terror-text-secondary" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedNPC && (
        <div className="dossier-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-terror-accent font-bold text-xl">
              {selectedNPC.name}
            </h3>
            <button
              onClick={() => setSelectedNPC(null)}
              className="text-terror-text-secondary hover:text-terror-text text-sm"
            >
              Fechar
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-terror-text-secondary text-sm">Origem</p>
              <p className="text-terror-text">{selectedNPC.origin}</p>
            </div>

            <div>
              <p className="text-terror-text-secondary text-sm mb-2">Atributos</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                <div>
                  <p className="text-terror-text-secondary text-xs">NEX</p>
                  <p className="text-terror-text font-bold">{selectedNPC.nex}%</p>
                </div>
                <div>
                  <p className="text-terror-text-secondary text-xs">AGI</p>
                  <p className="text-terror-text font-bold">{selectedNPC.agi}</p>
                </div>
                <div>
                  <p className="text-terror-text-secondary text-xs">FOR</p>
                  <p className="text-terror-text font-bold">{selectedNPC.for}</p>
                </div>
                <div>
                  <p className="text-terror-text-secondary text-xs">INT</p>
                  <p className="text-terror-text font-bold">{selectedNPC.int}</p>
                </div>
                <div>
                  <p className="text-terror-text-secondary text-xs">PRE</p>
                  <p className="text-terror-text font-bold">{selectedNPC.pre}</p>
                </div>
                <div>
                  <p className="text-terror-text-secondary text-xs">VIG</p>
                  <p className="text-terror-text font-bold">{selectedNPC.vig}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-terror-text-secondary text-sm">Perícia de Destaque</p>
              <p className="text-terror-text">{selectedNPC.highlight_skill}</p>
            </div>

            <div className="terminal-border p-4 bg-terror-accent/10">
              <p className="text-terror-text-secondary text-sm mb-2">Segredo Obscuro</p>
              <p className="text-terror-text italic">{selectedNPC.dark_secret}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

