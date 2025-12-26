# 👁️ VeritasOS // Ordo Realitas Management Suite

**VeritasOS** é uma plataforma de suporte para Mestres de RPG baseada no universo de *Ordem Paranormal*. O sistema atua como um terminal da Ordo Realitas, oferecendo ferramentas de automação com IA, gerenciamento de fichas em tempo real e documentação de investigações de terror cósmico e psicológico.

> "A verdade tem um preço. O medo é o juro."

---

## 🛠️ Funcionalidades Planejadas

* **Gerador de NPCs com IA:** Integração nativa com Google Gemini para criar personagens secundários com história, atributos, perícias e segredos obscuros.
* **Fichas de Agente Online:** Gerenciamento completo de NEX, Atributos, PV, PE e Sanidade.
* **Sistema de Tokens:** Acesso seguro para jogadores via códigos gerados pelo Mestre (sem necessidade de contas complexas).
* **Dossiê de Investigação:** * **Notas Compartilhadas:** Mural de evidências visível para toda a equipe.
    * **Diário de Agente:** Notas individuais secretas entre o jogador e o mestre.
* **Rolador de Dados Paranormal:** Lógica customizada (pega o maior valor entre os dados rolados) com animações de interface.
* **Estética de Terror:** Interface "Dark-Industrial" com efeitos de glitch, flicker e ruído visual via CSS.

## 🚀 Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Banco de Dados:** [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3) (Local e veloz)
* **IA:** [Google Gemini API](https://ai.google.dev/)
* **Deployment:** [Discloud](https://discloud.com/)

## 📦 Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/ShiroiCrypto/VeritasOS.git](https://github.com/ShiroiCrypto/VeritasOS.git)
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz e adicione sua chave:
    ```env
    GEMINI_API_KEY=sua_chave_aqui
    ```
4.  **Execute o projeto:**
    ```bash
    npm run dev
    ```

## 🌐 Hospedagem (Discloud)

O projeto está configurado para deploy na Discloud. Certifique-se de que o arquivo `discloud.config` esteja presente na raiz com as especificações de RAM e versão do Node.

---

## 🛡️ Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

**Desenvolvido por [ShiroiCrypto](https://github.com/ShiroiCrypto)**