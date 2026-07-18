# Sessão 004 — Redesign completo + rebrand THE ONE PORCENT

**Data:** 2026-07-18
**Versão:** 1.1.0 → 1.2.0
**Tipo:** Implementação (UI/UX) + decisão estratégica (rebrand)

## O que foi feito

Reforma visual completa pedida pelo usuário: layout "com cara de app feito
por IA", queria sidebar, dashboards, animações, uma seção de Configurações
consolidada, e renomear o projeto para "THE ONE PORCENT".

1. Duas perguntas de escopo feitas antes de começar (ver D008 e D009):
   vídeos do YouTube em Posições ficam pra depois (só animação por agora),
   e o rebrand vai até GitHub/Vercel/URL, não só o app.
2. Instalado `framer-motion` (animações) e `lucide-react` (ícones).
3. `globals.css` reescrito com um design system mais completo: paleta
   ajustada, tokens de superfície elevada, glow radial de fundo, scrollbar
   customizada, classes utilitárias `.card`/`.card-hover`/`.gold-text-gradient`.
4. Todas as páginas autenticadas movidas para `src/app/(app)/` (route
   group) com um `layout.tsx` único renderizando a nova `<Sidebar />` — ver
   D006. Isso exigiu matar o processo do dev server (`npm run dev`) antes
   de conseguir mover a pasta `curso/`, porque o Windows travava a pasta
   por causa do watcher de arquivos ainda ativo.
5. `Sidebar`: fixa à esquerda no desktop (com indicador ativo animado via
   `layoutId`), vira barra superior + barra de abas no rodapé no mobile.
6. Dashboard (Início) reconstruído como painéis: `RadialProgress` (anel SVG
   animado), progresso por bloco (barra animada), atalhos de posições
   (cards com ícone), metas em destaque.
7. `/curso` reconstruído com `CourseList` (cards por bloco, ícones,
   stagger animation, status por ícone em vez de texto).
8. Detalhe da lição com transições suaves e `CompleteLessonButton`
   reescrito com animação de sucesso (`AnimatePresence` + spring).
9. `/posicoes` reconstruído: `PositionField` (diagrama SVG de campo
   com marcadores animados por posição, clicáveis), tabs com transição
   `AnimatePresence`, ícone por seção de conteúdo. Suporta pré-seleção via
   `?pos=` (usado pelos atalhos do dashboard).
10. `/perfil` renomeado para `/configuracoes` e expandido (D007): conta
    (com botão de sair), metas, histórico, e um rodapé "sobre o app".
11. Rebrand in-app: título/metadata, sidebar, tela de login, `package.json`
    (`name` e `version`) — tudo "THE ONE PORCENT".
12. Testado no navegador (desktop): login, dashboard, curso, lição
    (completar com animação), posições (conteúdo trocando via `?pos=`),
    configurações — tudo sem erros de console. Teste interativo em
    viewport mobile encontrou fricção na ferramenta de automação do
    Browser pane (screenshot e alguns cliques não responderam de forma
    confiável) — não foi possível confirmar visualmente o clique na barra
    de abas mobile, mas as classes Tailwind responsivas usadas
    (`hidden md:flex` / `flex md:hidden`) são padrão bem estabelecido.
13. Build de produção limpo, 0 erros.
14. Registros de memória atualizados (`MEMORY.md`, `MEMORY_CORE.md`,
    `CHANGELOG.md`, `DECISIONS.md` D006-D009).

## Detalhes técnicos

- **Route group `(app)`:** mover `curso/`, `dashboard/`, `posicoes/` pra
  dentro de `(app)/` quebrou o cache de tipos do Next.js
  (`.next/dev/types/validator.ts` apontava pro caminho antigo) — resolvido
  com `rm -rf .next` antes do rebuild.
- **Windows file lock:** `mv curso "(app)/"` falhou com "Permission denied"
  enquanto o dev server estava rodando (watcher de arquivo do Next.js
  segurando um handle). Resolvido matando o processo (`taskkill //PID ... //F`)
  antes de mover.
- **Import paths pós-move:** qualquer arquivo fora de `(app)/` que importava
  de dentro do grupo precisou do caminho literal com parênteses (ex.:
  `@/app/(app)/curso/[id]/actions`, `@/app/(app)/configuracoes/actions`).
- Corrigido um erro de tipo em `blockProgress`/agrupamento (não relacionado
  a bugs numerados, resolvido inline durante a implementação, sem impacto
  em runtime).

## Verificação

- `npm run build`: 0 erros.
- Testado no navegador (desktop, 1280×720): fluxo completo login → dashboard
  → curso → lição → concluir (com animação) → posições (troca de posição via
  URL) → configurações. Sem erros no console em nenhuma etapa.
- Teste em viewport mobile (375×812) parcialmente inconclusivo por fricção
  da ferramenta de automação (não é um problema identificado no código).

## Decisões técnicas

Ver `DECISIONS.md`: D006 (sidebar + route group), D007 (Perfil absorvido
por Configurações), D008 (vídeos do YouTube adiados), D009 (escopo do
rebrand inclui GitHub/Vercel/URL).

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `src/app/globals.css` | design system expandido |
| `src/app/layout.tsx` | título "THE ONE PORCENT" |
| `src/app/login/page.tsx` | redesign + rebrand |
| `src/app/(app)/layout.tsx` | novo — layout com sidebar |
| `src/app/(app)/dashboard/page.tsx` | reescrito — painéis |
| `src/app/(app)/curso/page.tsx` | reescrito — usa CourseList |
| `src/app/(app)/curso/[id]/page.tsx` | redesign |
| `src/app/(app)/posicoes/page.tsx` | redesign |
| `src/app/(app)/configuracoes/*` | novo (era `perfil/`) |
| `src/components/sidebar.tsx` | novo |
| `src/components/fade-in.tsx` | novo |
| `src/components/radial-progress.tsx` | novo |
| `src/components/course-list.tsx` | novo |
| `src/components/position-field.tsx` | novo |
| `src/components/positions-view.tsx` | reescrito |
| `src/components/goals-list.tsx` | reescrito |
| `src/components/sign-out-button.tsx` | novo |
| `src/components/complete-lesson-button.tsx` | reescrito |
| `src/components/nav.tsx` | removido (substituído por sidebar) |
| `src/lib/lessons.ts` | + `blockProgress()` |
| `package.json` | nome `the-one-porcent`, versão 1.2.0, + framer-motion/lucide-react |
| `MEMORY.md`, `MEMORY_CORE.md`, `CHANGELOG.md`, `DECISIONS.md` | atualizados |

## Status para retomar

- App redesenhado e funcional, build limpo, sem bugs ativos conhecidos.
- Rebrand in-app completo. Rebrand externo (GitHub/Vercel/URL) pendente de
  execução — próximos passos manuais documentados no fim desta sessão, a
  serem feitos pelo usuário via dashboard (sem ferramenta automática
  disponível para rename de repositório GitHub ou projeto Vercel).
- Decisão em aberto: vídeos do YouTube em Posições (D008) — aguardando
  feedback do usuário sobre o resultado visual das animações.
