import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'veritasos.db');
const dbDir = path.dirname(dbPath);

// Garantir que o diretório existe
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Criar tabelas se não existirem
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_master INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE NOT NULL,
    master_token TEXT NOT NULL,
    master_user_id INTEGER,
    name TEXT,
    description TEXT,
    attribute_mode TEXT DEFAULT 'ordem_paranormal' CHECK(attribute_mode IN ('ordem_paranormal', 'mundano_livre')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (master_user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE NOT NULL,
    table_token TEXT NOT NULL,
    user_id INTEGER,
    name TEXT NOT NULL,
    origin TEXT,
    nex INTEGER DEFAULT 0,
    agi INTEGER DEFAULT 0,
    for INTEGER DEFAULT 0,
    int INTEGER DEFAULT 0,
    pre INTEGER DEFAULT 0,
    vig INTEGER DEFAULT 0,
    pv INTEGER DEFAULT 0,
    pe INTEGER DEFAULT 0,
    san INTEGER DEFAULT 0,
    inventory TEXT,
    rituals TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS npcs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_token TEXT NOT NULL,
    name TEXT NOT NULL,
    origin TEXT,
    nex INTEGER DEFAULT 0,
    agi INTEGER DEFAULT 0,
    for INTEGER DEFAULT 0,
    int INTEGER DEFAULT 0,
    pre INTEGER DEFAULT 0,
    vig INTEGER DEFAULT 0,
    highlight_skill TEXT,
    dark_secret TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_token TEXT NOT NULL,
    character_token TEXT,
    type TEXT NOT NULL CHECK(type IN ('individual', 'shared')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;

