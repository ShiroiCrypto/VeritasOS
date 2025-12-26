# 👁️ VeritasOS // Ordo Realitas Management Suite

**VeritasOS** é uma plataforma de suporte para Mestres de RPG baseada no universo de *Ordem Paranormal*. O sistema atua como um terminal da Ordo Realitas, oferecendo ferramentas de automação com IA, gerenciamento de fichas em tempo real e documentação de investigações de terror cósmico e psicológico.

> "A verdade tem um preço. O medo é o juro."

---

## 🛠️ Funcionalidades Implementadas

* ✅ **Configuração Completa:** Next.js 14, Tailwind CSS, TypeScript
* ✅ **Banco de Dados SQLite:** Estrutura completa com tabelas (characters, npcs, notes, tables)
* ✅ **Estética de Terror:** Interface "Terminal/Dossiê" com efeitos de glitch, scanlines e paleta de cores temática
* ✅ **Sistema de Rolagem:** Lógica customizada (Xd20, pega o maior valor) com animações
* ✅ **Gerador de NPCs com IA:** Integração com Google Gemini para criar personagens completos
* ✅ **Layout Base:** Sidebar de navegação e layout terminal funcional

## 🚀 Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Banco de Dados:** [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) (Local e veloz)
* **IA:** [Google Gemini API](https://ai.google.dev/)
* **Ícones:** [Lucide React](https://lucide.dev/)

## 📦 Instalação e Configuração

Consulte o arquivo [SETUP.md](./SETUP.md) para instruções detalhadas de instalação.

### Quick Start

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```

3. **Execute as migrações:**
   ```bash
   npm run db:migrate
   ```

4. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

Acesse `http://localhost:3000` no navegador.

## 🎨 Características Visuais

- **Paleta de Cores:**
  - Fundo: `#050505` (preto profundo)
  - Acentos: `#990000` (vermelho sangue)
  - Texto secundário: `#666666` (cinza)

- **Efeitos:**
  - Scanlines animadas no fundo
  - Efeito glitch em títulos e estados de erro
  - Bordas com brilho sutil
  - Cards estilo "dossiê" com efeito de profundidade

## 📁 Estrutura do Projeto

```
VeritasOS/
├── app/
│   ├── api/
│   │   └── generate-npc/    # API para gerar NPCs com IA
│   ├── master/              # Dashboard do Mestre
│   │   ├── recruitment/     # Gerador de NPCs
│   │   ├── investigation/  # Mural de investigação
│   │   └── monitor/         # Monitor de mesa
│   ├── player/              # Dashboard do Jogador
│   │   └── diary/           # Diário de agente
│   └── globals.css          # Estilos globais
├── components/
│   ├── Sidebar.tsx          # Navegação lateral
│   ├── TerminalLayout.tsx   # Layout base
│   └── DiceRoller.tsx       # Componente de rolagem
├── lib/
│   ├── db.ts                # Conexão SQLite
│   └── dice.ts              # Lógica de rolagem
└── scripts/
    └── migrate.js           # Script de migração
```

## 🎲 Sistema de Rolagem

O sistema implementa a mecânica de Ordem Paranormal:
- Rola **X dados de 20** onde X é o valor do atributo
- Retorna o **maior valor** entre as rolagens
- Interface visual com animações e feedback

## 🤖 Gerador de NPCs

A integração com Google Gemini permite criar NPCs completos com:
- Nome e Origem
- NEX e Atributos (AGI, FOR, INT, PRE, VIG)
- Perícia de destaque
- Segredo obscuro relacionado ao paranormal

## 🛡️ Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

**Desenvolvido por [ShiroiCrypto](https://github.com/ShiroiCrypto)**
