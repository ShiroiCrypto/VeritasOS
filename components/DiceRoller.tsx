'use client';

import { useState } from 'react';
import { Dices } from 'lucide-react';
import { rollAttribute, type DiceResult } from '@/lib/dice';

interface DiceRollerProps {
  attributeName: string;
  attributeValue: number;
  onRoll?: (result: DiceResult) => void;
}

export default function DiceRoller({ 
  attributeName, 
  attributeValue,
  onRoll 
}: DiceRollerProps) {
  const [result, setResult] = useState<DiceResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    setIsRolling(true);
    
    // Simular animação de rolagem
    setTimeout(() => {
      const rollResult = rollAttribute(attributeValue);
      setResult(rollResult);
      setIsRolling(false);
      onRoll?.(rollResult);
    }, 500);
  };

  return (
    <div className="dossier-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-terror-text font-bold">{attributeName}</h3>
          <p className="text-terror-text-secondary text-sm">
            Valor: {attributeValue} | Rola {attributeValue}d20
          </p>
        </div>
        <button
          onClick={handleRoll}
          disabled={isRolling || attributeValue <= 0}
          className="terminal-border px-4 py-2 text-terror-text hover:bg-terror-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Dices size={18} />
          {isRolling ? 'Rolando...' : 'Rolar Dados'}
        </button>
      </div>
      
      {result && (
        <div className="mt-4 p-4 bg-terror-accent/10 terminal-border">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-terror-text-secondary">Resultado:</span>
            <span className="text-2xl font-bold text-terror-accent text-glow">
              {result.highest}
            </span>
          </div>
          <div className="text-terror-text-secondary text-sm">
            <p>Rolagens: [{result.rolls.join(', ')}]</p>
            <p className="mt-1">Maior valor: <span className="text-terror-text">{result.highest}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}

