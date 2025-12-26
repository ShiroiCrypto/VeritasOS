import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateCharacterToken, isValidTokenFormat, cleanToken } from '@/lib/tokens';

interface CharacterCreateData {
  table_token: string;
  user_id?: number;
  name: string;
  origin?: string;
  nex?: number;
  agi?: number;
  for?: number;
  int?: number;
  pre?: number;
  vig?: number;
}

export async function POST(request: NextRequest) {
  try {
    const data: CharacterCreateData = await request.json();

    if (!data.table_token || !data.name) {
      return NextResponse.json(
        { error: 'table_token e name são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar token da mesa
    if (!isValidTokenFormat(data.table_token)) {
      return NextResponse.json(
        { error: 'Token de mesa inválido' },
        { status: 400 }
      );
    }

    const cleanedTableToken = cleanToken(data.table_token);

    // Verificar se a mesa existe
    const tableCheck = db.prepare(`
      SELECT id FROM tables WHERE token = ?
    `).get(cleanedTableToken);

    if (!tableCheck) {
      return NextResponse.json(
        { error: 'Mesa não encontrada. Verifique o token da mesa.' },
        { status: 404 }
      );
    }

    // Gerar token único para o personagem
    let characterToken = generateCharacterToken();
    
    // Garantir que o token é único (tentar até encontrar um disponível)
    let attempts = 0;
    while (attempts < 10) {
      const existing = db.prepare(`
        SELECT id FROM characters WHERE token = ?
      `).get(characterToken);

      if (!existing) {
        break; // Token único encontrado
      }
      characterToken = generateCharacterToken();
      attempts++;
    }

    if (attempts >= 10) {
      return NextResponse.json(
        { error: 'Erro na Membrana: Não foi possível gerar token único. Tente novamente.' },
        { status: 500 }
      );
    }

    // Inserir personagem
    const stmt = db.prepare(`
      INSERT INTO characters (
        token, table_token, user_id, name, origin, nex, agi, for, int, pre, vig,
        pv, pe, san
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      characterToken,
      cleanedTableToken,
      data.user_id || null,
      data.name,
      data.origin || null,
      data.nex || 0,
      data.agi || 0,
      data.for || 0,
      data.int || 0,
      data.pre || 0,
      data.vig || 0,
      0, // pv
      0, // pe
      0  // san
    );

    return NextResponse.json({
      success: true,
      character: {
        id: result.lastInsertRowid,
        token: characterToken,
        table_token: cleanedTableToken,
        name: data.name,
      },
      message: 'Personagem criado com sucesso',
    });
  } catch (error: any) {
    console.error('Erro na Membrana ao criar personagem:', error);
    
    if (error.message?.includes('UNIQUE constraint')) {
      return NextResponse.json(
        { error: 'Erro na Membrana: Token duplicado. Tente novamente.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erro na Membrana ao criar personagem. A realidade pode estar distorcida.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const characterToken = searchParams.get('character_token');
    const tableToken = searchParams.get('table_token');

    if (!characterToken || !tableToken) {
      return NextResponse.json(
        { error: 'character_token e table_token são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar tokens
    if (!isValidTokenFormat(characterToken) || !isValidTokenFormat(tableToken)) {
      return NextResponse.json(
        { error: 'Tokens inválidos' },
        { status: 400 }
      );
    }

    const cleanedCharacterToken = cleanToken(characterToken);
    const cleanedTableToken = cleanToken(tableToken);

    // Buscar personagem
    const stmt = db.prepare(`
      SELECT 
        id, token, table_token, name, origin, nex,
        agi, for, int, pre, vig,
        pv, pe, san, inventory, rituals,
        created_at, updated_at
      FROM characters
      WHERE token = ? AND table_token = ?
    `);

    const character = stmt.get(cleanedCharacterToken, cleanedTableToken);

    if (!character) {
      return NextResponse.json(
        { error: 'Personagem não encontrado. Verifique os tokens fornecidos.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      character,
    });
  } catch (error: any) {
    console.error('Erro na Membrana ao consultar personagem:', error);
    return NextResponse.json(
      { error: 'Erro na Membrana ao consultar personagem. A realidade pode estar distorcida.' },
      { status: 500 }
    );
  }
}

