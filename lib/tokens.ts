import crypto from 'crypto';

/**
 * Gera um token único e seguro
 * @param length - Tamanho do token (padrão: 16 caracteres)
 * @returns Token hexadecimal
 */
export function generateToken(length: number = 16): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Gera um token formatado para exibição (com separadores)
 * @param token - Token hexadecimal
 * @param chunkSize - Tamanho de cada chunk (padrão: 4)
 * @returns Token formatado (ex: "a1b2-c3d4-e5f6-g7h8")
 */
export function formatToken(token: string, chunkSize: number = 4): string {
  const chunks: string[] = [];
  for (let i = 0; i < token.length; i += chunkSize) {
    chunks.push(token.slice(i, i + chunkSize));
  }
  return chunks.join('-').toUpperCase();
}

/**
 * Remove formatação de um token (remove hífens e converte para minúsculo)
 * @param formattedToken - Token formatado
 * @returns Token limpo
 */
export function cleanToken(formattedToken: string): string {
  return formattedToken.replace(/-/g, '').toLowerCase();
}

/**
 * Valida se um token tem formato válido
 * @param token - Token a validar
 * @returns true se válido
 */
export function isValidTokenFormat(token: string): boolean {
  const cleaned = cleanToken(token);
  // Token deve ter entre 16 e 64 caracteres hexadecimais
  return /^[a-f0-9]{16,64}$/i.test(cleaned);
}

/**
 * Gera um par de tokens para uma mesa
 * @returns Objeto com table_token e master_token
 */
export function generateTableTokens(): {
  table_token: string;
  master_token: string;
} {
  return {
    table_token: generateToken(16), // Token compartilhado com jogadores
    master_token: generateToken(24), // Token secreto do mestre (mais longo)
  };
}

/**
 * Gera um token para um personagem
 * @returns character_token
 */
export function generateCharacterToken(): string {
  return generateToken(16);
}

