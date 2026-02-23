# Merali Studio - Portfólio de Visualização Arquitetônica

![Merali Studio Banner](public/render.jpg)

> **Merali Studio** nasceu da obsessão pelo detalhe. Atuamos como um laboratório de luz e atmosfera, onde cada pixel é esculpido para criar a ilusão perfeita da realidade. Atendemos nomes que moldam o skyline global.

Este é o repositório front-end do portfólio do **Merali Studio**. É uma vitrine altamente interativa e hiper-realista, projetada para elevar projetos arquitetônicos ao patamar de obra de arte. Construído com tecnologias web de ponta, apresenta animações fluidas, rolagem suave (smooth scroll) e uma experiência de usuário imersiva.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando padrões modernos de desenvolvimento web para garantir alta performance e um aspecto visual premium:

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animações:** 
  - [Framer Motion](https://www.framer.com/motion/) para animações declarativas no React
  - [GSAP (GreenSock)](https://gsap.com/) para sequenciamento complexo e rolagem interativa
- **Buscador de Dados:** [TanStack React Query](https://tanstack.com/query/latest) & Axios
- **Componentes de UI:** [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Rolagem Suave:** [Lenis](https://lenis.studiofreight.com/)

---

## ✨ Funcionalidades

- **Seção Inicial Imersiva:** Hero em tela cheia com vídeos/imagens de fundo em camadas e animações de revelação em cascata.
- **Galeria de Portfólio Dinâmica:** Uma galeria de estilo alvenaria (masonry) que busca os projetos "favoritos" através de uma API backend.
- **Visualizador de Imagens (Lightbox) Iterativo:** Visualizador de imagens personalizado com navegação pelo teclado (`Setas direcionais`, `Esc`), desfoque de fundo (backdrop blurs) e transições contínuas.
- **Rolagem Suave (Smooth Scroll):** Integração do plugin GSAP ScrollTo combinada com técnicas modernas de rolagem suave.
- **Design Responsivo:** Layouts cuidadosamente elaborados para Mobile, Tablet e Desktop, garantindo que o padrão premium permaneça intacto em todos os dispositivos.
- **Performance Otimizada:** Uso do `next/image` do Next.js para carregamento sob demanda (lazy loading) e entrega otimizada de recursos visuais.

---

## ⚙️ Como Executar o Projeto

Siga as instruções abaixo para rodar o projeto localmente.

### Pré-requisitos

- Node.js 18.x ou superior
- npm, yarn ou pnpm

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/neveshardd/showcase-merali.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd showcase-merali
   ```

3. Instale todas as dependências:
   ```bash
   npm install
   ```

4. Crie um arquivo `.env.local` na raiz do projeto para especificar a URL da sua API backend (se necessário):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

5. Inicie o servidor de desenvolvimento (atente-se que o pacote principal usa a porta 3001):
   ```bash
   npm run dev
   ```

6. Abra [http://localhost:3001](http://localhost:3001) em seu navegador para ver o resultado.

---

## 📂 Estrutura do Projeto

```text
showcase-merali/
├── public/               # Arquivos estáticos (imagens, fontes, renders)
├── src/
│   ├── app/              # Páginas e layouts do App Router do Next.js
│   │   ├── globals.css   # Estilos globais do Tailwind
│   │   ├── layout.tsx    # Configuração principal do Layout
│   │   └── page.tsx      # Landing Page Principal (Hero, Galeria, Contato)
│   ├── components/       # Componentes de UI reutilizáveis (shadcn/ui, etc.)
│   └── lib/              # Funções utilitárias, integrações de API, animações
├── package.json          # Metadados e dependências do projeto
├── tailwind.config.ts    # Configurações do Tailwind CSS
└── next.config.ts        # Configurações do Next.js
```

---

## 📞 Contato

**Merali Studio**
- **E-mail:** contato@merali.arq.br
- **Localização:** São Paulo, SP, Brasil

© 2026 Merali Studio. Todos os direitos reservados.
