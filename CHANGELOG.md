# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/).

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
