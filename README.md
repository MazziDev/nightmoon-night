# Noite de Nightmoon

Uma experiência interativa criada com **React + Vite**, **TailwindCSS**, **Framer Motion** e **GSAP**. O céu minimalista responde ao movimento do cursor, estrelas cintilam e revelam versos ao clique, a lua acompanha suavemente e um botão secreto desperta constelações que escrevem “nightmoon”.

## Scripts úteis

- `npm install` — instala as dependências.
- `npm run dev` — inicia o ambiente de desenvolvimento em `http://localhost:5173`.
- `npm run build` — gera a versão otimizada em `dist/` (ajustada para GitHub Pages com `base: '/nightmoon-night/'`).
- `npm run preview` — serve a build de produção localmente.

## Estrutura principal

- `src/App.jsx` — controla o gradiente dinâmico, áudio ambiente e integrações das animações.
- `src/components/Moon.jsx` — lua responsiva com `useMotionValue` e `useTransform`.
- `src/components/Stars.jsx` — estrelas posicionadas aleatoriamente com cintilância via GSAP.
- `src/components/MessageModal.jsx` — versos com animação de entrada e efeito typewriter.
- `src/components/ConstellationOverlay.jsx` — constelação surpresa desenhando “nightmoon”.
- `tailwind.config.js` — gradientes personalizados e animações utilitárias.

## Deploy no GitHub Pages

1. Execute `npm run build`.
2. Publique o conteúdo da pasta `dist/` no branch configurado para o GitHub Pages (por exemplo, `gh-pages`).
3. O site estará acessível em `https://<seu-usuario>.github.io/nightmoon-night/`.

Sinta a brisa noturna e aproveite a poesia luminosa sob a nightmoon. 🌙
