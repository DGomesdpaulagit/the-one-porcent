# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/).

## [1.2.0] — 2026-07-18 — Redesign completo + rebrand THE ONE PORCENT

**Detalhes em `sessions/sessao-004.md`.**

### Adicionado
- Navegação em sidebar (desktop) / barra de abas (mobile), substituindo a nav superior
- Dashboard (Início) redesenhado em painéis: progresso radial animado, progresso por bloco, atalhos de posições, metas em destaque
- Animações em todo o app via framer-motion (transições, listas, sucesso ao concluir lição)
- Diagrama de campo animado (SVG) na página de Posições, com marcadores clicáveis
- Página de Configurações consolidando conta, metas pessoais, histórico e "sobre o app"
- Design system expandido em `globals.css` (novos tokens de cor, `.card`, glow, scrollbar customizada)
- Rebrand in-app: "Protocolo Ouro" → "THE ONE PORCENT"

### Alterado
- `/perfil` virou `/configuracoes` (D007)
- Estrutura de pastas: páginas autenticadas movidas para `src/app/(app)/` com layout compartilhado (D006)

## [1.1.0] — 2026-07-18 — Página de Perfil

**Detalhes em `sessions/sessao-003.md`.**

### Adicionado
- Página `/perfil`: metas pessoais (adicionar, marcar como concluída, remover) e histórico de lições concluídas agrupado por data
- Tabela `user_goals` no Supabase (com RLS)
- Link "Perfil" na navegação

### Corrigido
- B003 — título da lição não aparecia no histórico do Perfil (ver `BUGS.md`)

## [1.0.1] — 2026-07-18 — Deploy em produção

**Detalhes em `sessions/sessao-002.md`.**

### Adicionado
- Repositório GitHub público (`DGomesdpaulagit/protocolo-ouro`), conectado à Vercel para deploy automático a cada push em `main`
- App em produção: https://protocolo-ouro.vercel.app

### Corrigido
- B002 — variáveis de ambiente do Supabase não aplicadas no primeiro deploy (ver `BUGS.md`)

## [1.0.0] — 2026-07-17 — Build inicial completo

**Detalhes em `sessions/sessao-001.md`.**

### Adicionado
- Projeto Supabase `protocolo-ouro` (schema `lessons`, `user_progress`, `positions_content` + RLS)
- Scaffold Next.js 16 (App Router, Tailwind v4, TypeScript), tema preto/dourado
- Autenticação (login/cadastro via Supabase Auth)
- Páginas: Dashboard, Curso (lista + detalhe de lição), Posições
- Lógica de progresso e desbloqueio sequencial das 20 lições
- 20 lições populadas nos 4 blocos (Mentalidade, Posições, Momentos decisivos, Retorno de lesão)
- Conteúdo de Posições (4 posições × 5 seções)
- Método de registro e continuidade entre sessões (este conjunto de arquivos)

### Corrigido
- B001 — ordem de exibição das lições do Bloco 2 no `/curso` (ver `BUGS.md`)
