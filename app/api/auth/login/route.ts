import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyPassword, generateSessionToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username e password são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = db.prepare(`
      SELECT id, username, password_hash, is_master
      FROM users
      WHERE username = ?
    `).get(username) as any;

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Verificar senha
    if (!verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Buscar mesas onde o usuário tem personagens
    const tables = db.prepare(`
      SELECT DISTINCT
        t.id,
        t.token as table_token,
        t.name as table_name,
        t.description,
        c.token as character_token,
        c.name as character_name
      FROM tables t
      INNER JOIN characters c ON c.table_token = t.token
      WHERE c.user_id = ?
      ORDER BY t.created_at DESC
    `).all(user.id) as any[];

    // Gerar token de sessão (simplificado - em produção usar JWT)
    const sessionToken = generateSessionToken();

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        is_master: user.is_master === 1,
      },
      session_token: sessionToken,
      tables: tables.map(t => ({
        table_id: t.id,
        table_token: t.table_token,
        table_name: t.table_name,
        description: t.description,
        character_token: t.character_token,
        character_name: t.character_name,
      })),
    });
  } catch (error: any) {
    console.error('Erro na Membrana ao autenticar:', error);
    return NextResponse.json(
      { error: 'Erro na Membrana ao autenticar. A realidade pode estar distorcida.' },
      { status: 500 }
    );
  }
}

