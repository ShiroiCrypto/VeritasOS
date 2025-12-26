import db from './db';
import { hashPassword } from './auth';

/**
 * Inicializa o banco de dados com dados padrão
 * Executa na primeira inicialização do servidor
 */
export function initializeDatabase() {
  try {
    // Verificar se o usuário mestre padrão existe
    const masterUser = db.prepare(`
      SELECT id FROM users WHERE username = 'mestre'
    `).get() as any;

    if (!masterUser) {
      // Criar usuário mestre padrão
      const passwordHash = hashPassword('mestre123');
      
      db.prepare(`
        INSERT INTO users (username, password_hash, is_master)
        VALUES (?, ?, ?)
      `).run('mestre', passwordHash, 1);

      console.log('✅ Usuário mestre padrão criado: mestre / mestre123');
    }
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  }
}

// Executar na importação do módulo
if (typeof window === 'undefined') {
  initializeDatabase();
}

