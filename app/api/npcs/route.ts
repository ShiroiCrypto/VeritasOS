import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { isValidTokenFormat, cleanToken } from '@/lib/tokens';

interface NPCCreateData {
  name: string;
  origin: string;
  nex: number;
  agi: number;
  for: number;
  int: number;
  pre: number;
  vig: number;
  highlight_skill: string;
  dark_secret: string;
  table_token?: string;
}

export async function POST(request: NextRequest) {
  try {
    const npcData: NPCCreateData = await request.json();

    // Validação dos dados obrigatórios
    if (!npcData.name || !npcData.origin) {
      return NextResponse.json(
        { error: 'Nome e origem são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar atributos numéricos
    const attributes = ['nex', 'agi', 'for', 'int', 'pre', 'vig'];
    for (const attr of attributes) {
      if (typeof npcData[attr as keyof NPCCreateData] !== 'number') {
        return NextResponse.json(
          { error: `Atributo ${attr} deve ser um número` },
          { status: 400 }
        );
      }
    }

    // Validar e limpar token da mesa
    if (!npcData.table_token) {
      return NextResponse.json(
        { error: 'table_token é obrigatório' },
        { status: 400 }
      );
    }

    if (!isValidTokenFormat(npcData.table_token)) {
      return NextResponse.json(
        { error: 'Token de mesa inválido' },
        { status: 400 }
      );
    }

    const tableToken = cleanToken(npcData.table_token);

    // Verificar se a mesa existe
    const tableCheck = db.prepare(`
      SELECT id FROM tables WHERE token = ?
    `).get(tableToken);

    if (!tableCheck) {
      return NextResponse.json(
        { error: 'Mesa não encontrada. Verifique o token da mesa.' },
        { status: 404 }
      );
    }

    // Inserir NPC no banco de dados
    const stmt = db.prepare(`
      INSERT INTO npcs (
        table_token, name, origin, nex, agi, for, int, pre, vig,
        highlight_skill, dark_secret
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      tableToken,
      npcData.name,
      npcData.origin,
      npcData.nex,
      npcData.agi,
      npcData.for,
      npcData.int,
      npcData.pre,
      npcData.vig,
      npcData.highlight_skill || '',
      npcData.dark_secret || ''
    );

    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid,
      message: 'NPC arquivado no Dossiê com sucesso',
    });
  } catch (error: any) {
    console.error('Erro na Membrana ao acessar banco de dados:', error);
    return NextResponse.json(
      { error: 'Erro na Membrana ao arquivar NPC no Dossiê. A realidade pode estar distorcida.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawTableToken = searchParams.get('table_token');

    if (!rawTableToken) {
      return NextResponse.json(
        { error: 'table_token é obrigatório' },
        { status: 400 }
      );
    }

    if (!isValidTokenFormat(rawTableToken)) {
      return NextResponse.json(
        { error: 'Token de mesa inválido' },
        { status: 400 }
      );
    }

    const tableToken = cleanToken(rawTableToken);

    // Buscar NPCs da mesa
    const stmt = db.prepare(`
      SELECT 
        id, name, origin, nex, agi, for, int, pre, vig,
        highlight_skill, dark_secret, created_at
      FROM npcs
      WHERE table_token = ?
      ORDER BY created_at DESC
    `);

    const npcs = stmt.all(tableToken);

    return NextResponse.json({
      success: true,
      npcs: npcs,
      count: npcs.length,
    });
  } catch (error: any) {
    console.error('Erro na Membrana ao acessar banco de dados:', error);
    return NextResponse.json(
      { error: 'Erro na Membrana ao consultar o Dossiê. A realidade pode estar distorcida.' },
      { status: 500 }
    );
  }
}

