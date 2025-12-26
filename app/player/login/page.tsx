'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, AlertCircle } from 'lucide-react';
import { cleanToken } from '@/lib/tokens';

export default function PlayerLoginPage() {
  const router = useRouter();
  const [tableToken, setTableToken] = useState('');
  const [characterToken, setCharacterToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validar tokens
      if (!tableToken.trim() || !characterToken.trim()) {
        throw new Error('Preencha ambos os tokens');
      }

      const cleanedTableToken = cleanToken(tableToken);
      const cleanedCharacterToken = cleanToken(characterToken);

      // Verificar se o personagem existe
      const response = await fetch(
        `/api/characters?table_token=${cleanedTableToken}&character_token=${cleanedCharacterToken}`
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao validar tokens');
      }

      // Salvar tokens no localStorage (temporário até implementar contexto)
      localStorage.setItem('veritas_table_token', cleanedTableToken);
      localStorage.setItem('veritas_character_token', cleanedCharacterToken);

      // Redirecionar para a ficha do jogador
      router.push('/player');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="dossier-card max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <LogIn size={24} className="text-terror-accent" />
          <h1 className="glitch-text text-2xl font-bold text-glow">
            Acesso do Agente
          </h1>
        </div>

        <p className="text-terror-text-secondary text-sm mb-6">
          Insira os tokens fornecidos pelo seu mestre para acessar sua ficha.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-terror-text-secondary text-sm mb-2">
              Token da Mesa
            </label>
            <input
              type="text"
              value={tableToken}
              onChange={(e) => setTableToken(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="w-full bg-terror-bg terminal-border p-3 text-terror-text placeholder-terror-text-secondary focus:outline-none focus:border-terror-accent font-mono text-sm"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-terror-text-secondary text-sm mb-2">
              Token do Personagem
            </label>
            <input
              type="text"
              value={characterToken}
              onChange={(e) => setCharacterToken(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="w-full bg-terror-bg terminal-border p-3 text-terror-text placeholder-terror-text-secondary focus:outline-none focus:border-terror-accent font-mono text-sm"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-4 bg-terror-accent/20 terminal-border flex items-start gap-2">
              <AlertCircle size={18} className="text-terror-accent mt-0.5" />
              <p className="text-terror-accent text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full terminal-border px-6 py-3 text-terror-text hover:bg-terror-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? 'Validando...' : 'Acessar Ficha'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-terror-accent/10 terminal-border">
          <p className="text-terror-text-secondary text-xs">
            <strong>Não tem os tokens?</strong> Solicite ao seu mestre:
            <br />
            • Token da Mesa (compartilhado com todos)
            <br />
            • Token do Personagem (seu token pessoal)
          </p>
        </div>
      </div>
    </div>
  );
}

