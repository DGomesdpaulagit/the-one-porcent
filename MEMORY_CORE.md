# ⚡ MEMORY_CORE.md — Estado Atual do Projeto

> Atualizar a cada sessão. Manter pequeno e rápido de ler.

## 📍 ESTADO ATUAL

**Data:** 2026-07-18
**Versão:** 1.3.0 — sistema de metas com coaching + polish (favicon, streak, som, skeletons)
**Status:** App no ar em https://the-one-porcent.vercel.app. Repositório: `DGomesdpaulagit/the-one-porcent`.

## ✅ O QUE ESTÁ PRONTO

- [x] Projeto Supabase `protocolo-ouro` (ref `pbbzozeztqrenpfnhylp`, região us-east-2) criado, plano grátis
- [x] Schema: tabelas `lessons`, `user_progress`, `positions_content` + RLS
- [x] Scaffold Next.js 16 (App Router, Tailwind v4, TypeScript), tema preto/dourado, mobile-first
- [x] Auth via Supabase (login/cadastro com confirmação por e-mail)
- [x] 20 lições populadas nos 4 blocos, com o texto real de `MENTALIDADE.docx` e `POSIÇÕES.docx` (exceto lição 8 e lições 18-20, ver `DECISIONS.md` D003)
- [x] Posições: 4 posições × 5 seções, texto real de `POSIÇÕES.docx`
- [x] Páginas: Login, Dashboard, Curso (lista + detalhe de lição), Posições
- [x] Lógica de progresso e desbloqueio sequencial (lição N só abre se N-1 concluída)
- [x] Testado ponta a ponta no navegador com usuário de teste (criado e removido do banco depois)
- [x] Método de registro/continuidade (este arquivo e os outros da lista) aplicado
- [x] Repositório GitHub público criado e conectado
- [x] Deploy na Vercel configurado com integração Git (auto-deploy) + env vars do Supabase
- [x] Página de Perfil (agora parte de Configurações): metas pessoais + histórico de lições por data
- [x] Redesign completo: sidebar (desktop) / barra de abas (mobile), dashboard em painéis (progresso radial animado, progresso por bloco, atalhos de posições, metas em destaque), animações framer-motion em todo o app
- [x] Página de Configurações consolidando conta, metas, histórico e informações do app
- [x] Diagrama de campo animado (SVG) na página de Posições, com marcadores clicáveis por posição
- [x] Rebrand in-app para "THE ONE PORCENT" (título, sidebar, login, package.json)
- [x] Favicon "1%" dourado gerado via `icon.tsx` (Next.js `ImageResponse`)
- [x] Página `/metas` dedicada: metas com plano de coaching (etapas sequenciais desbloqueáveis + práticas contínuas), templates para "capitão" e "cobrador de bola parada", fallback genérico para qualquer outra meta
- [x] Streak (sequência de dias) no dashboard, calculada a partir de `user_progress.completed_at`
- [x] Som de sucesso (Web Audio API, sintetizado) ao concluir uma lição
- [x] Loading states (skeleton) em todas as rotas autenticadas via `loading.tsx`
- [x] Posições redesenhado como carrossel passo a passo (uma seção por vez, setas + pontos de navegação) com animações contextuais no diagrama de campo por tipo de seção

## 🎯 PRÓXIMA SESSÃO

Roadmap funcional, rebrand e polish 100% entregues, tudo em produção.
Nenhuma tarefa obrigatória pendente. Decisão em aberto pro usuário: se
quiser vídeos reais do YouTube na página de Posições (D008) — ele já viu
as animações e por enquanto não pediu vídeo, mas pode revisitar.

## 🐛 BUGS CONHECIDOS

Nenhum ativo. Ver `BUGS.md` para o histórico (3 bugs resolvidos — B001, B002, B003).

## ⚠️ Observação sobre teste no navegador (sessão 005)

O Browser pane usado pra testar (Claude_Browser) ficou instável durante
essa sessão — cliques por `ref` frequentemente resolviam pra coordenada
`(0,0)` e não registravam, mesmo em elementos comuns (botões de nav,
formulários). Não é um bug do app: abrir uma aba nova geralmente resolve;
quando o clique continuou falhando, a validação foi feita inserindo dados
de teste direto via SQL e conferindo a renderização com `read_page`, que
funcionou normalmente o tempo todo. Se isso acontecer de novo, tentar aba
nova primeiro antes de assumir que é regressão no código.

## 🔑 ARQUIVOS CRÍTICOS

| Arquivo | Importância |
|---|---|
| `src/lib/lessons.ts` | Lógica de desbloqueio sequencial — mexer com cuidado |
| `src/lib/supabase/{client,server,middleware}.ts` | Clientes Supabase (browser/server/proxy) |
| `src/proxy.ts` | Proteção de rotas (redireciona não-autenticado para `/login`) — convenção Next.js 16, não `middleware.ts` |
| `.env.local` | `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` — nunca commitar (já no `.gitignore`) |
| `docs/SUPABASE_SETUP.md` | Como recriar/entender a config do Supabase deste projeto |

## Projeto Supabase

- **Nome:** protocolo-ouro
- **Ref:** `pbbzozeztqrenpfnhylp`
- **URL:** `https://pbbzozeztqrenpfnhylp.supabase.co`
- **Org:** `mbgjntfcclvtwcojrpun`
- Detalhes completos de schema em `MEMORY.md`.
