# 🚀 Guia de Instalação - VeritasOS

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Chave da API do Google Gemini

## Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-2.5-flash
# Opcional: ID do cliente (se necessário)
# GEMINI_CLIENT_ID=gen-lang-client-0413630072
```

**Nota:** Se não especificar `GEMINI_MODEL`, o sistema tentará automaticamente os modelos mais recentes primeiro.

**Modelos disponíveis:**
- `gemini-2.5-flash` (mais recente, recomendado)
- `gemini-2.0-flash-exp` (experimental)
- `gemini-1.5-flash` (mais rápido)
- `gemini-1.5-pro` (mais poderoso, melhor qualidade)

O sistema tentará automaticamente os modelos mais recentes primeiro.

Para obter uma chave da API do Google Gemini:
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma nova API key
3. Cole no arquivo `.env`

### 3. Executar Migrações do Banco de Dados

```bash
npm run db:migrate
```

Isso criará o arquivo `data/veritasos.db` com todas as tabelas necessárias.

### 4. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
VeritasOS/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── master/            # Páginas do Mestre
│   ├── player/            # Páginas do Jogador
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
├── lib/                   # Utilitários e lógica
│   ├── db.ts             # Conexão com SQLite
│   └── dice.ts           # Sistema de rolagem
├── scripts/              # Scripts utilitários
└── data/                 # Banco de dados SQLite (gerado)
```

## Funcionalidades Implementadas

✅ Configuração do Next.js 14 com App Router
✅ Tailwind CSS com tema de terror
✅ Banco de dados SQLite (better-sqlite3)
✅ Layout base com Sidebar e efeito Terminal
✅ Sistema de rolagem de dados (Xd20, pega o maior)
✅ API para gerar NPCs com Google Gemini
✅ Página de Recrutamento (geração de NPCs)

## Próximos Passos

- [ ] Sistema de autenticação por tokens
- [ ] Dashboard completo do mestre
- [ ] Fichas de personagens interativas
- [ ] Mural de investigação (notas compartilhadas)
- [ ] Diário de agente (notas individuais)
- [ ] Monitor de mesa (status dos jogadores)

## Troubleshooting

### Erro: "Cannot find module 'better-sqlite3'"

Certifique-se de que todas as dependências foram instaladas:
```bash
npm install
```

### Erro: "GEMINI_API_KEY não configurada"

Verifique se o arquivo `.env` existe e contém a chave correta.

### Erro ao executar migrações

Certifique-se de que o diretório `data/` pode ser criado. O script criará automaticamente se não existir.

