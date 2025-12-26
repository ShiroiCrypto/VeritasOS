import crypto from 'crypto';

/**
 * Gera hash de senha usando SHA-256
 * Em produção, considere usar bcrypt ou argon2
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha256')
    .toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifica se a senha corresponde ao hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const [salt, storedHash] = hash.split(':');
  if (!salt || !storedHash) {
    return false;
  }
  
  const computedHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha256')
    .toString('hex');
  
  return computedHash === storedHash;
}

/**
 * Gera um token de sessão
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

