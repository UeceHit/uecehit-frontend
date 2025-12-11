This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.






=================================================================================================================================================================================

UeceHit é um sistema web desenvolvido em Next.js + React, voltado para facilitar processos acadêmicos como controle de presença, visualização de calendário, fluxo de aulas e gerenciamento de turmas.

O sistema foi estruturado para ser modular, escalável e responsivo, utilizando componentes reutilizáveis e páginas dedicadas ao fluxo de alunos e administração.



=================================================================================================================================================================================





uecehit-frontend/
│
├── public/                     # Imagens e arquivos públicos
│   ├── logo.png
│   └── ...
│
├── src/
│   ├── app/
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── Sidebar/
│   │   │   │   ├── index.jsx
│   │   │   │   └── styles.css
│   │   │   ├── Header/
│   │   │   │   ├── index.jsx
│   │   │   │   └── styles.css
│   │   │   ├── Calendar/
│   │   │   │   ├── index.jsx
│   │   │   │   └── styles.css
│   │   │   ├── CalendarViewSwitcher/
│   │   │   │   ├── index.jsx
│   │   │   │   └── styles.css
│   │   │   ├── TabelaPresencas/
│   │   │   │   ├── index.jsx
│   │   │   │   └── styles.css
│   │   │   └── ...
│   │   │
│   │   ├── aluno/              # Página principal do aluno
│   │   │   ├── page.jsx
│   │   │   └── styles.css
│   │   │
│   │   ├── consultar-presencas/ # Página da consulta de presença
│   │   │   ├── page.jsx
│   │   │   └── styles.css
│   │   │
│   │   ├── login-everyone/     # Página de login comum
│   │   │   ├── page.jsx
│   │   │   ├── style.css
│   │   │   └── esqueci-senha/
│   │   │       ├── page.jsx
│   │   │       └── style.css
│   │   │
│   │   ├── calendario/         # Página do calendário acadêmico
│   │   │   ├── page.jsx
│   │   │   └── styles.css
│   │   │
│   │   ├── layout.js           # Layout global da aplicação
│   │   ├── globals.css         # Estilos globais
│   │   ├── page.js             # Página inicial (landing ou dashboard)
│   │   └── page.module.css     # CSS da página inicial
│   │
│   ├── styles/                 # Estilos extras (opcional)
│   └── ...
│
├── package.json
├── next.config.js
└── README.md
