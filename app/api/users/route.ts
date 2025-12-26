import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import '@/lib/init'; // Garantir inicialização

interface UserCreateData {
  username: string;
  password: string;
  is_master?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const data: UserCreateData = await request.json();

    if (!data.username || !data.password) {
      return NextResponse.json(
        { error: 'Username e password são obrigatórios' },
        { status: 400 }
      );
    }

    if (data.username.length < 3) {
      return NextResponse.json(
        { error: 'Username deve ter pelo menos 3 caracteres' },
        { status: 400 }
      );
    }

    if (data.password.length < 6) {
      return NextResponse.json(
        { error: 'Password deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar se username já existe
    const existingUser = db.prepare(`
      SELECT id FROM users WHERE username = ?
    `).get(data.username);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username já existe' },
        { status: 409 }
      );
    }

    // Criar hash da senha
    const passwordHash = hashPassword(data.password);

    // Inserir usuário
    const stmt = db.prepare(`
      INSERT INTO users (username, password_hash, is_master)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(
      data.username,
      passwordHash,
      data.is_master ? 1 : 0
    );

    return NextResponse.json({
      success: true,
      user: {
        id: result.lastInsertRowid,
        username: data.username,
        is_master: data.is_master || false,
      },
      message: 'Usuário criado com sucesso',
    });
  } catch (error: any) {
    console.error('Erro na Membrana ao criar usuário:', error);
    
    if (error.message?.includes('UNIQUE constraint')) {
      return NextResponse.json(
        { error: 'Username já existe' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erro na Membrana ao criar usuário. A realidade pode estar distorcida.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'username é obrigatório' },
        { status: 400 }
      );
    }

    const user = db.prepare(`
      SELECT id, username, is_master, created_at
      FROM users
      WHERE username = ?
    `).get(username) as any;

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        is_master: user.is_master === 1,
        created_at: user.created_at,
      },
    });
  } catch (error: any) {
    console.error('Erro na Membrana ao consultar usuário:', error);
    return NextResponse.json(
      { error: 'Erro na Membrana ao consultar usuário. A realidade pode estar distorcida.' },
      { status: 500 }
    );
  }
}

