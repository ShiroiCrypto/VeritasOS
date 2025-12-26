import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
    const { theme } = await request.json();

    if (!theme || typeof theme !== 'string') {
      return NextResponse.json(
        { error: 'Tema é obrigatório' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY não configurada' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Você é um assistente especializado em criar personagens para o RPG Ordem Paranormal.

Crie um NPC (personagem não-jogador) baseado no seguinte tema: "${theme}"

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

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
  } catch (error) {
    console.error('Erro ao gerar NPC:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

