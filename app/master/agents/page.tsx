'use client';

import { useState } from 'react';
import TerminalLayout from '@/components/TerminalLayout';
import { UserPlus, Users, AlertCircle, Check, X } from 'lucide-react';

interface Agent {
  id: number;
  username: string;
  character_name: string;
  character_token: string;
  table_name: string;
}

export default function AgentsPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [tableToken, setTableToken] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdAgent, setCreatedAgent] = useState<Agent | null>(null);

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setCreatedAgent(null);
    setIsCreating(true);

    try {
      if (!username.trim() || !password.trim() || !characterName.trim() || !tableToken.trim()) {
        throw new Error('Preencha todos os campos');
      }

      if (username.length < 3) {
        throw new Error('Username deve ter pelo menos 3 caracteres');
      }

      if (password.length < 6) {
        throw new Error('Password deve ter pelo menos 6 caracteres');
      }

      // 1. Criar usuário
      const userResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          is_master: false,
        }),
      });

      if (!userResponse.ok) {
        const data = await userResponse.json();
        throw new Error(data.error || 'Erro ao criar usuário');
      }

      const userData = await userResponse.json();
      const userId = userData.user.id;

      // 2. Criar personagem vinculado ao usuário
      const characterResponse = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_token: tableToken,
          user_id: userId,
          name: characterName,
          // Atributos iniciais serão definidos pelo sistema baseado no modo da mesa
        }),
      });

      if (!characterResponse.ok) {
        const data = await characterResponse.json();
        throw new Error(data.error || 'Erro ao criar personagem');
      }

      const characterData = await characterResponse.json();

      setCreatedAgent({
        id: userId,
        username,
        character_name: characterName,
        character_token: characterData.character.token,
        table_name: 'Mesa',
      });

      setSuccess(true);
      setUsername('');
      setPassword('');
      setCharacterName('');
      setTableToken('');
      
      setTimeout(() => {
        setSuccess(false);
        setCreatedAgent(null);
      }, 5000);
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
          <UserPlus size={24} className="text-terror-accent" />
          <h1 className="glitch-text text-3xl font-bold text-glow">
            Cadastrar Agente
          </h1>
        </div>

        <div className="dossier-card">
          <h2 className="text-terror-accent font-bold mb-4 flex items-center gap-2">
            <Users size={20} />
            Criar Novo Agente
          </h2>
          <p className="text-terror-text-secondary text-sm mb-4">
            Crie uma conta de jogador e vincule um personagem a uma mesa. O agente poderá fazer login e acessar sua ficha.
          </p>

          <form onSubmit={handleCreateAgent} className="space-y-4">
            <div>
              <label className="block text-terror-text-secondary text-sm mb-2">
                Username do Agente
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nome de usuário para login"
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

            <div>
              <label className="block text-terror-text-secondary text-sm mb-2">
                Nome do Personagem
              </label>
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Nome do personagem na mesa"
                className="w-full bg-terror-bg terminal-border p-3 text-terror-text placeholder-terror-text-secondary focus:outline-none focus:border-terror-accent"
                disabled={isCreating}
              />
            </div>

            <div>
              <label className="block text-terror-text-secondary text-sm mb-2">
                Token da Mesa
              </label>
              <input
                type="text"
                value={tableToken}
                onChange={(e) => setTableToken(e.target.value)}
                placeholder="Token da mesa onde o personagem será criado"
                className="w-full bg-terror-bg terminal-border p-3 text-terror-text placeholder-terror-text-secondary focus:outline-none focus:border-terror-accent font-mono text-sm"
                disabled={isCreating}
              />
              <p className="text-terror-text-secondary text-xs mt-1">
                Use o token da mesa criada em Configuração
              </p>
            </div>

            {error && (
              <div className="p-4 bg-terror-accent/20 terminal-border flex items-start gap-2">
                <AlertCircle size={18} className="text-terror-accent mt-0.5" />
                <p className="text-terror-accent text-sm">{error}</p>
              </div>
            )}

            {success && createdAgent && (
              <div className="p-4 bg-terror-accent/20 terminal-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <Check size={18} className="text-terror-accent mt-0.5" />
                    <div>
                      <p className="text-terror-accent text-sm font-bold">Agente cadastrado com sucesso!</p>
                      <p className="text-terror-text-secondary text-xs mt-1">
                        Username: <strong>{createdAgent.username}</strong>
                      </p>
                      <p className="text-terror-text-secondary text-xs">
                        Personagem: <strong>{createdAgent.character_name}</strong>
                      </p>
                      <p className="text-terror-text-secondary text-xs mt-2 font-mono">
                        Token do Personagem: {createdAgent.character_token}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setCreatedAgent(null);
                    }}
                    className="text-terror-text-secondary hover:text-terror-text"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isCreating}
              className="terminal-border px-6 py-3 text-terror-text hover:bg-terror-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <UserPlus size={18} />
              {isCreating ? 'Cadastrando...' : 'Cadastrar Agente'}
            </button>
          </form>
        </div>
      </div>
    </TerminalLayout>
  );
}

