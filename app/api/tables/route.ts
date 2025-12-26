import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateTableTokens, isValidTokenFormat, cleanToken } from '@/lib/tokens';

interface TableCreateData {
  name?: string;
  description?: string;
  attribute_mode?: 'ordem_paranormal' | 'mundano_livre';
  master_user_id?: number;
}

interface TableData {
  id: number;
  token: string;
  master_token: string;
  name: string | null;
  description: string | null;
  attribute_mode: 'ordem_paranormal' | 'mundano_livre';
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: TableCreateData = await request.json();
    
    // Gerar tokens únicos
    const { table_token, master_token } = generateTableTokens();

    // Inserir mesa no banco
    const stmt = db.prepare(`
      INSERT INTO tables (token, master_token, name, description, attribute_mode, master_user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      table_token,
      master_token,
      data.name || null,
      data.description || null,
      data.attribute_mode || 'ordem_paranormal',
      data.master_user_id || null
    );

    const insertedTable = db.prepare(`
      SELECT id, token, master_token, name, description, attribute_mode, created_at
      FROM tables
      WHERE id = ?
    `).get(result.lastInsertRowid) as any;

    return NextResponse.json({
      success: true,
      table: {
        id: insertedTable.id,
        table_token: insertedTable.token,
        master_token: insertedTable.master_token,
        name: insertedTable.name,
        description: insertedTable.description,
        attribute_mode: insertedTable.attribute_mode,
        created_at: insertedTable.created_at,
      },
      message: 'Mesa criada com sucesso',
    });
  } catch (error: any) {
    console.error('Erro na Membrana ao criar mesa:', error);
    
    // Verificar se é erro de token duplicado
    if (error.message?.includes('UNIQUE constraint')) {
      return NextResponse.json(
        { error: 'Erro na Membrana: Token duplicado detectado. Tente novamente.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erro na Membrana ao criar mesa. A realidade pode estar distorcida.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const masterToken = searchParams.get('master_token');

    if (!masterToken) {
      return NextResponse.json(
        { error: 'master_token é obrigatório' },
        { status: 400 }
      );
    }

    // Validar formato do token
    if (!isValidTokenFormat(masterToken)) {
      return NextResponse.json(
        { error: 'Token inválido. A Membrana rejeitou sua autenticação.' },
        { status: 400 }
      );
    }

    const cleanedToken = cleanToken(masterToken);

    // Buscar mesa pelo master_token
    const stmt = db.prepare(`
      SELECT id, token, master_token, name, description, attribute_mode, created_at
      FROM tables
      WHERE master_token = ?
    `);

    const table = stmt.get(cleanedToken) as TableData | undefined;

    if (!table) {
      return NextResponse.json(
        { error: 'Mesa não encontrada. O token pode estar incorreto ou a mesa foi apagada.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      table: {
        id: table.id,
        table_token: table.token,
        master_token: table.master_token,
        name: table.name,
        description: table.description,
        attribute_mode: table.attribute_mode,
        created_at: table.created_at,
      },
    });
  } catch (error: any) {
    console.error('Erro na Membrana ao consultar mesa:', error);
    return NextResponse.json(
      { error: 'Erro na Membrana ao consultar mesa. A realidade pode estar distorcida.' },
      { status: 500 }
    );
  }
}

// Validar token de mesa (para uso em outras rotas)
export async function validateTableToken(tableToken: string): Promise<boolean> {
  try {
    if (!isValidTokenFormat(tableToken)) {
      return false;
    }

    const cleanedToken = cleanToken(tableToken);
    
    const stmt = db.prepare(`
      SELECT id FROM tables WHERE token = ?
    `);

    const result = stmt.get(cleanedToken);
    return !!result;
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return false;
  }
}

