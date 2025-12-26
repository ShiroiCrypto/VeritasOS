/**
 * Sistema de rolagem de dados para Ordem Paranormal
 * Rola X dados de 20 e retorna o maior valor
 */

export interface DiceResult {
  rolls: number[];
  highest: number;
  total: number;
}

export function rollDice(count: number, sides: number = 20): DiceResult {
  const rolls: number[] = [];
  
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  
  const highest = Math.max(...rolls);
  const total = rolls.reduce((sum, roll) => sum + roll, 0);
  
  return {
    rolls,
    highest,
    total,
  };
}

/**
 * Rola dados baseado no valor de um atributo
 * No sistema de Ordem Paranormal, rola-se Xd20 onde X é o valor do atributo
 */
export function rollAttribute(attributeValue: number): DiceResult {
  if (attributeValue <= 0) {
    return {
      rolls: [1],
      highest: 1,
      total: 1,
    };
  }
  
  return rollDice(attributeValue, 20);
}

