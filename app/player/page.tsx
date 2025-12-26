import TerminalLayout from '@/components/TerminalLayout';
import DiceRoller from '@/components/DiceRoller';

export default function PlayerDashboard() {
  // Exemplo de atributos - em produção viriam do banco de dados
  const attributes = [
    { name: 'AGI', value: 2 },
    { name: 'FOR', value: 1 },
    { name: 'INT', value: 3 },
    { name: 'PRE', value: 2 },
    { name: 'VIG', value: 1 },
  ];

  return (
    <TerminalLayout mode="player">
      <div className="space-y-6">
        <h1 className="glitch-text text-3xl font-bold text-glow mb-6">
          Ficha do Agente
        </h1>
        
        <div className="dossier-card mb-6">
          <h2 className="text-terror-accent font-bold mb-4">Atributos</h2>
          <p className="text-terror-text-secondary text-sm mb-4">
            Clique em "Rolar Dados" para testar um atributo. O sistema rola Xd20 e pega o maior valor.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attributes.map((attr) => (
              <DiceRoller
                key={attr.name}
                attributeName={attr.name}
                attributeValue={attr.value}
              />
            ))}
          </div>
        </div>
        
        <div className="dossier-card">
          <h2 className="text-terror-accent font-bold mb-2">Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-terror-text-secondary text-sm">PV</p>
              <p className="text-terror-text text-xl">-</p>
            </div>
            <div>
              <p className="text-terror-text-secondary text-sm">PE</p>
              <p className="text-terror-text text-xl">-</p>
            </div>
            <div>
              <p className="text-terror-text-secondary text-sm">SAN</p>
              <p className="text-terror-text text-xl">-</p>
            </div>
          </div>
        </div>
      </div>
    </TerminalLayout>
  );
}

