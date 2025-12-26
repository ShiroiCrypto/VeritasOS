'use client';

import { useState } from 'react';
import TerminalLayout from '@/components/TerminalLayout';
import { Settings, Copy, Check, AlertCircle } from 'lucide-react';
import { formatToken } from '@/lib/tokens';

interface TableData {
  id: number;
  table_token: string;
  master_token: string;
  name: string | null;
  created_at: string;
}

export default function SetupPage() {
  const [tableName, setTableName] = useState('');
  const [description, setDescription] = useState('');
  const [attributeMode, setAttributeMode] = useState<'ordem_paranormal' | 'mundano_livre'>('ordem_paranormal');
  const [isCreating, setIsCreating] = useState(false);
  const [createdTable, setCreatedTable] = useState<TableData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCreateTable = async () => {
    setIsCreating(true);
    setError(null);
    setCreatedTable(null);

    try {
      // Buscar user_id do localStorage
      const userId = typeof window !== 'undefined' 
        ? localStorage.getItem('veritas_user_id')
        : null;

      const response = await fetch('/api/tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tableName || undefined,
          description: description || undefined,
          attribute_mode: attributeMode,
          master_user_id: userId ? parseInt(userId) : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao criar mesa');
      }

      const data = await response.json();
      setCreatedTable(data.table);
      
      // Salvar tokens no localStorage para uso nas outras páginas
      if (typeof window !== 'undefined') {
        localStorage.setItem('veritas_table_token', data.table.table_token);
        localStorage.setItem('veritas_master_token', data.table.master_token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyToken = async (token: string, type: 'table' | 'master') => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(type);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  return (
    <TerminalLayout mode="master">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings size={24} className="text-terror-accent" />
          <h1 className="glitch-text text-3xl font-bold text-glow">
            Configuração da Mesa
          </h1>
        </div>

        {!createdTable ? (
          <div className="dossier-card">
            <h2 className="text-terror-accent font-bold mb-4">
              Criar Nova Mesa
            </h2>
            <p className="text-terror-text-secondary text-sm mb-4">
              Crie uma nova mesa de jogo. Você receberá dois tokens:
              <br />
              • <strong>Token da Mesa:</strong> Compartilhe com seus jogadores
              <br />
              • <strong>Token do Mestre:</strong> Mantenha em segredo (acesso administrativo)
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-terror-text-secondary text-sm mb-2">
                  Nome da Mesa (opcional)
                </label>
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  placeholder="Ex: Projeto Gaia - Sessão 1"
                  className="w-full bg-terror-bg terminal-border p-3 text-terror-text placeholder-terror-text-secondary focus:outline-none focus:border-terror-accent"
                />
              </div>

              <div>
                <label className="block text-terror-text-secondary text-sm mb-2">
                  Descrição do Cenário (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o cenário, contexto ou tema da mesa. Isso ajudará a IA a gerar NPCs mais contextualizados."
                  rows={4}
                  className="w-full bg-terror-bg terminal-border p-3 text-terror-text placeholder-terror-text-secondary focus:outline-none focus:border-terror-accent resize-none"
                />
                <p className="text-terror-text-secondary text-xs mt-1">
                  Esta descrição será usada pela IA para gerar NPCs contextualizados.
                </p>
              </div>

              <div>
                <label className="block text-terror-text-secondary text-sm mb-2">
                  Sistema de Atributos
                </label>
                <select
                  value={attributeMode}
                  onChange={(e) => setAttributeMode(e.target.value as 'ordem_paranormal' | 'mundano_livre')}
                  className="w-full bg-terror-bg terminal-border p-3 text-terror-text focus:outline-none focus:border-terror-accent"
                >
                  <option value="ordem_paranormal">Ordem Paranormal (1 em tudo + 4 pontos)</option>
                  <option value="mundano_livre">Mundano/Livre (definir manualmente)</option>
                </select>
                <p className="text-terror-text-secondary text-xs mt-1">
                  {attributeMode === 'ordem_paranormal' 
                    ? 'Sistema padrão: todos os atributos começam em 1, com 4 pontos adicionais para distribuir.'
                    : 'Sistema livre: o mestre define os valores iniciais manualmente.'}
                </p>
              </div>

              <button
                onClick={handleCreateTable}
                disabled={isCreating}
                className="terminal-border px-6 py-3 text-terror-text hover:bg-terror-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCreating ? 'Criando...' : 'Criar Mesa'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-terror-accent/20 terminal-border flex items-start gap-2">
                <AlertCircle size={18} className="text-terror-accent mt-0.5" />
                <p className="text-terror-accent text-sm">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="dossier-card">
              <h2 className="text-terror-accent font-bold mb-4 text-xl">
                Mesa Criada com Sucesso
              </h2>
              {createdTable.name && (
                <p className="text-terror-text mb-4">
                  <strong>Nome:</strong> {createdTable.name}
                </p>
              )}

              <div className="space-y-4">
                <div className="terminal-border p-4 bg-terror-accent/10">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-terror-text-secondary text-sm font-bold">
                      Token da Mesa
                    </label>
                    <button
                      onClick={() => handleCopyToken(createdTable.table_token, 'table')}
                      className="text-terror-accent hover:text-terror-text transition-colors flex items-center gap-1"
                    >
                      {copiedToken === 'table' ? (
                        <>
                          <Check size={16} />
                          <span className="text-xs">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-terror-text font-mono text-sm break-all">
                    {formatToken(createdTable.table_token)}
                  </p>
                  <p className="text-terror-text-secondary text-xs mt-2">
                    Compartilhe este token com seus jogadores
                  </p>
                </div>

                <div className="terminal-border p-4 bg-terror-accent/20">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-terror-text font-bold text-sm">
                      Token do Mestre (SECRETO)
                    </label>
                    <button
                      onClick={() => handleCopyToken(createdTable.master_token, 'master')}
                      className="text-terror-accent hover:text-terror-text transition-colors flex items-center gap-1"
                    >
                      {copiedToken === 'master' ? (
                        <>
                          <Check size={16} />
                          <span className="text-xs">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span className="text-xs">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-terror-text font-mono text-sm break-all">
                    {formatToken(createdTable.master_token)}
                  </p>
                  <p className="text-terror-accent text-xs mt-2 font-bold">
                    ⚠️ MANTENHA ESTE TOKEN EM SEGREDO! Ele dá acesso total à mesa.
                  </p>
                </div>
              </div>
            </div>

            <div className="dossier-card">
              <h3 className="text-terror-accent font-bold mb-2">Próximos Passos</h3>
              <ol className="list-decimal list-inside space-y-2 text-terror-text-secondary text-sm">
                <li>Salve os tokens em local seguro</li>
                <li>Compartilhe o Token da Mesa com seus jogadores</li>
                <li>Use o Token do Mestre para acessar o Dashboard do Mestre</li>
                <li>Gere tokens de personagem na página de Recrutamento</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </TerminalLayout>
  );
}

