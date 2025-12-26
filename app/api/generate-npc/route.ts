import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import db from '@/lib/db';
import { cleanToken } from '@/lib/tokens';

// Configurar cliente Gemini
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

interface NPCData {
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
}

export async function POST(request: NextRequest) {
  try {
    const { theme, table_token } = await request.json();

    if (!theme || typeof theme !== 'string') {
      return NextResponse.json(
        { error: 'Tema é obrigatório' },
        { status: 400 }
      );
    }

    if (!table_token) {
      return NextResponse.json(
        { error: 'table_token é obrigatório' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY não configurada' },
        { status: 500 }
      );
    }

    // Buscar contexto da mesa e notas do mural
    const cleanedTableToken = cleanToken(table_token);

    // Buscar descrição da mesa
    const table = db.prepare(`
      SELECT description, name
      FROM tables
      WHERE token = ?
    `).get(cleanedTableToken) as any;

    // Buscar últimas 5 notas compartilhadas do mural (com conteúdo completo)
    const notes = db.prepare(`
      SELECT title, content
      FROM notes
      WHERE table_token = ? AND type = 'shared'
      ORDER BY created_at DESC
      LIMIT 5
    `).all(cleanedTableToken) as any[];

    // Construir contexto onisciente
    let contextParts: string[] = [];
    
    if (table?.name) {
      contextParts.push(`MESA: ${table.name}`);
    }
    
    if (table?.description) {
      contextParts.push(`CENÁRIO DA CAMPANHA:\n${table.description}`);
    }

    if (notes.length > 0) {
      contextParts.push(`\nMURAL DE INVESTIGAÇÃO - DESCOBERTAS ATUAIS:`);
      notes.forEach((note, index) => {
        contextParts.push(`\n[${index + 1}] ${note.title}`);
        if (note.content) {
          contextParts.push(`   ${note.content.substring(0, 200)}${note.content.length > 200 ? '...' : ''}`);
        }
      });
    } else {
      contextParts.push(`\nMURAL DE INVESTIGAÇÃO: Nenhuma descoberta registrada ainda.`);
    }

    const context = contextParts.length > 0 
      ? contextParts.join('\n')
      : 'Sem contexto adicional disponível.';

    // Modelos disponíveis na API do Google Gemini (tentar em ordem)
    // Priorizando modelos mais recentes primeiro
    const modelOptions = process.env.GEMINI_MODEL 
      ? [process.env.GEMINI_MODEL]
      : [
          'gemini-2.5-flash',
          'gemini-2.0-flash-exp',
          'gemini-1.5-flash-latest',
          'gemini-1.5-pro-latest',
          'gemini-1.5-flash',
          'gemini-1.5-pro',
          'gemini-pro',
        ];

    const prompt = `Você é um assistente ONISCIENTE especializado em criar personagens para o RPG Ordem Paranormal. Você tem acesso completo ao contexto da campanha.

═══════════════════════════════════════════════════════════
CONTEXTO COMPLETO DA CAMPANHA (ONISCIÊNCIA ATIVADA):
═══════════════════════════════════════════════════════════
${context}
═══════════════════════════════════════════════════════════

TEMA SOLICITADO PELO MESTRE: "${theme}"

INSTRUÇÕES CRÍTICAS:
1. O NPC gerado DEVE ter conexões diretas e explícitas com as pistas e descobertas registradas no Mural de Investigação.
2. O NPC deve fazer sentido no cenário descrito e potencialmente se relacionar com as investigações em andamento.
3. O "Segredo Obscuro" do NPC deve estar relacionado às pistas do Mural ou ao cenário da campanha.
4. Se houver descobertas no Mural, o NPC deve ter conhecimento, envolvimento ou conexão com essas descobertas.
5. O NPC não deve ser genérico - deve ser específico e contextualizado para ESTA campanha.

Retorne APENAS um JSON válido com a seguinte estrutura (sem markdown, sem código, apenas o JSON puro):
{
  "name": "Nome do Personagem",
  "origin": "Origem (ex: Acadêmico, Agente de Saúde, etc)",
  "nex": número entre 0 e 99,
  "agi": número entre 0 e 5,
  "for": número entre 0 e 5,
  "int": número entre 0 e 5,
  "pre": número entre 0 e 5,
  "vig": número entre 0 e 5,
  "highlight_skill": "Nome de uma perícia de destaque",
  "dark_secret": "Um segredo obscuro relacionado ao paranormal ou ao passado do personagem"
}

IMPORTANTE: Retorne APENAS o JSON, sem explicações, sem markdown, sem texto adicional.`;

    // Tentar cada modelo até encontrar um que funcione
    let text = '';
    let lastError = null;
    
    for (const modelName of modelOptions) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text();
        console.log(`Modelo usado com sucesso: ${modelName}`);
        break; // Sucesso, sair do loop
      } catch (error: any) {
        lastError = error;
        // Se for erro 404 (modelo não encontrado), tentar próximo
        if (error?.status === 404) {
          console.log(`Modelo ${modelName} não encontrado, tentando próximo...`);
          continue;
        }
        // Se for outro erro (401, 403, etc), propagar
        throw error;
      }
    }
    
    // Se nenhum modelo funcionou
    if (!text && lastError) {
      return NextResponse.json(
        { 
          error: `Nenhum modelo disponível. Modelos testados: ${modelOptions.join(', ')}. Verifique sua chave de API e tente configurar GEMINI_MODEL no .env com um modelo específico.` 
        },
        { status: 500 }
      );
    }

    // Tentar extrair JSON do texto retornado
    let npcData: NPCData;
    
    try {
      // Remover markdown code blocks se existirem
      const cleanedText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      npcData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Erro ao parsear JSON:', text);
      return NextResponse.json(
        { error: 'Erro ao processar resposta da IA' },
        { status: 500 }
      );
    }

    // Validar estrutura
    if (
      !npcData.name ||
      typeof npcData.nex !== 'number' ||
      typeof npcData.agi !== 'number' ||
      typeof npcData.for !== 'number' ||
      typeof npcData.int !== 'number' ||
      typeof npcData.pre !== 'number' ||
      typeof npcData.vig !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Resposta da IA em formato inválido' },
        { status: 500 }
      );
    }

    return NextResponse.json(npcData);
  } catch (error: any) {
    console.error('Erro ao gerar NPC:', error);
    
    // Mensagens de erro mais específicas
    if (error?.status === 404) {
      return NextResponse.json(
        { error: 'Modelo não encontrado. Tente configurar GEMINI_MODEL=gemini-2.5-flash no .env ou verifique os modelos disponíveis na sua conta.' },
        { status: 500 }
      );
    }
    
    if (error?.status === 401 || error?.status === 403) {
      return NextResponse.json(
        { error: 'Chave de API inválida ou sem permissão' },
        { status: 500 }
      );
    }
    
    const errorMessage = error?.message || 'Erro interno do servidor';
    return NextResponse.json(
      { error: `Erro ao gerar NPC: ${errorMessage}` },
      { status: 500 }
    );
  }
}

