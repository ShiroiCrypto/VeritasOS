'use client';

import { useState } from 'react';
import TerminalLayout from '@/components/TerminalLayout';
import { Users, UserPlus, AlertCircle, Check } from 'lucide-react';

interface User {
  id: number;
  username: string;
  is_master: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isMaster, setIsMaster] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsCreating(true);

    try {
      if (!username.trim() || !password.trim()) {
        throw new Error('Preencha username e password');
      }

      if (username.length < 3) {
        throw new Error('Username deve ter pelo menos 3 caracteres');
      }

      if (password.length < 6) {
        throw new Error('Password deve ter pelo menos 6 caracteres');
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          is_master: isMaster,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao criar usuário');
      }

      setSuccess(true);
      setUsername('');
      setPassword('');
      setIsMaster(false);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <TerminalLayout mode="master">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Users size={24} className="text-terror-accent" />
          <h1 className="glitch-text text-3xl font-bold text-glow">
            Gerenciar Usuários
          </h1>
        </div>

        <div className="dossier-card">
          <h2 className="text-terror-accent font-bold mb-4 flex items-center gap-2">
            <UserPlus size={20} />
            Criar Novo Usuário
          </h2>
          <p className="text-terror-text-secondary text-sm mb-4">
            Crie contas para seus jogadores. Eles poderão fazer login e acessar suas mesas.
          </p>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-terror-text-secondary text-sm mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nome do usuário"
                className="w-full bg-terror-bg terminal-border p-3 text-terror-text placeholder-terror-text-secondary focus:outline-none focus:border-terror-accent"
                disabled={isCreating}
              />
            </div>

            <div>
              <label className="block text-terror-text-secondary text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha (mínimo 6 caracteres)"
                className="w-full bg-terror-bg terminal-border p-3 text-terror-text placeholder-terror-text-secondary focus:outline-none focus:border-terror-accent"
                disabled={isCreating}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isMaster"
                checked={isMaster}
                onChange={(e) => setIsMaster(e.target.checked)}
                className="w-4 h-4 terminal-border"
                disabled={isCreating}
              />
              <label htmlFor="isMaster" className="text-terror-text-secondary text-sm">
                É mestre? (pode criar mesas)
              </label>
            </div>

            {error && (
              <div className="p-4 bg-terror-accent/20 terminal-border flex items-start gap-2">
                <AlertCircle size={18} className="text-terror-accent mt-0.5" />
                <p className="text-terror-accent text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-terror-accent/20 terminal-border flex items-start gap-2">
                <Check size={18} className="text-terror-accent mt-0.5" />
                <p className="text-terror-accent text-sm">Usuário criado com sucesso!</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isCreating}
              className="terminal-border px-6 py-3 text-terror-text hover:bg-terror-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <UserPlus size={18} />
              {isCreating ? 'Criando...' : 'Criar Usuário'}
            </button>
          </form>
        </div>
      </div>
    </TerminalLayout>
  );
}

