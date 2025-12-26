const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.cwd(), 'data', 'veritasos.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE NOT NULL,
    table_token TEXT NOT NULL,
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
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

  CREATE TABLE IF NOT EXISTS tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE NOT NULL,
    master_token TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✅ Database migrated successfully!');
db.close();

