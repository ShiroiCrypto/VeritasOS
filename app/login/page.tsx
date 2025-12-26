'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, AlertCircle, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface Table {
  table_id: number;
  table_token: string;
  table_name: string | null;
  description: string | null;
  character_token: string;
  character_name: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [isMaster, setIsMaster] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        throw new Error('Preencha username e password');
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao fazer login');
      }

      const data = await response.json();
      
      // Salvar dados da sessão
      if (typeof window !== 'undefined') {
        localStorage.setItem('veritas_user_id', data.user.id.toString());
        localStorage.setItem('veritas_username', data.user.username);
        localStorage.setItem('veritas_is_master', data.user.is_master ? '1' : '0');
        localStorage.setItem('veritas_session_token', data.session_token);
      }

      setUserId(data.user.id);
      setIsMaster(data.user.is_master);
      setTables(data.tables || []);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTable = (table: Table) => {
    // Salvar tokens da mesa e personagem
    if (typeof window !== 'undefined') {
      localStorage.setItem('veritas_table_token', table.table_token);
      localStorage.setItem('veritas_character_token', table.character_token);
    }

    // Redirecionar baseado no tipo de usuário
    if (isMaster) {
      router.push('/master');
    } else {
      router.push('/player');
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="dossier-card max-w-2xl w-full">
          <div className="flex items-center gap-3 mb-6">
            <LogIn size={24} className="text-terror-accent" />
            <h1 className="glitch-text text-2xl font-bold text-glow">
              Bem-vindo, {username}
            </h1>
          </div>

          {tables.length === 0 ? (
            <div className="space-y-4">
              <p className="text-terror-text-secondary">
                Você ainda não possui personagens em nenhuma mesa.
              </p>
              {isMaster && (
                <Link
                  href="/master/setup"
                  className="terminal-border px-6 py-3 text-terror-text hover:bg-terror-accent/20 transition-colors inline-block"
                >
                  Criar Nova Mesa
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-terror-text-secondary">
                Selecione uma mesa para acessar:
              </p>
              <div className="space-y-2">
                {tables.map((table) => (
                  <button
                    key={table.table_id}
                    onClick={() => handleSelectTable(table)}
                    className="w-full terminal-border p-4 text-left hover:bg-terror-accent/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-terror-text font-bold">
                          {table.table_name || 'Mesa sem nome'}
                        </p>
                        <p className="text-terror-text-secondary text-sm">
                          Personagem: {table.character_name}
                        </p>
                        {table.description && (
                          <p className="text-terror-text-secondary text-xs mt-1">
                            {table.description}
                          </p>
                        )}
                      </div>
                      <LogIn size={20} className="text-terror-accent" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="dossier-card max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <LogIn size={24} className="text-terror-accent" />
          <h1 className="glitch-text text-2xl font-bold text-glow">
            Acesso ao VeritasOS
          </h1>
        </div>

        <p className="text-terror-text-secondary text-sm mb-6">
          Faça login para acessar suas mesas e personagens.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-terror-text-secondary text-sm mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Seu username"
              className="w-full bg-terror-bg terminal-border p-3 text-terror-text placeholder-terror-text-secondary focus:outline-none focus:border-terror-accent"
              disabled={isLoading}
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
              placeholder="Sua senha"
              className="w-full bg-terror-bg terminal-border p-3 text-terror-text placeholder-terror-text-secondary focus:outline-none focus:border-terror-accent"
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
            {isLoading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-terror-accent/10 terminal-border">
          <p className="text-terror-text-secondary text-xs mb-2">
            Não tem uma conta? O mestre pode criar uma para você.
          </p>
          <Link
            href="/master/setup"
            className="text-terror-accent hover:text-terror-text text-sm flex items-center gap-1"
          >
            <UserPlus size={14} />
            Criar conta de mestre
          </Link>
        </div>
      </div>
    </div>
  );
}

