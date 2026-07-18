# ⚡ MEMORY_CORE.md — Estado Atual do Projeto

> Atualizar a cada sessão. Manter pequeno e rápido de ler.

## 📍 ESTADO ATUAL

**Data:** 2026-07-18
**Versão:** 1.2.0 — redesign completo + rebrand para THE ONE PORCENT
**Status:** App redesenhado (sidebar, dashboards, animações framer-motion, página de Configurações) e renomeado de "Protocolo Ouro" para "THE ONE PORCENT" dentro do app. Rename externo (GitHub/Vercel/URL) em andamento — ver seção Deploy abaixo e `sessions/sessao-004.md`.

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

## 🎯 PRÓXIMA SESSÃO

Roadmap funcional 100% entregue. Pendente apenas a finalização do rebrand
externo: renomear o repositório no GitHub e o projeto na Vercel para
`the-one-porcent` (a URL de produção muda). Ver `sessions/sessao-004.md`
para o passo a passo — depende de ações manuais do usuário (renomear via
dashboard), sem ferramenta automática disponível pra isso.

Se o usuário topar, o próximo passo natural depois disso seria decidir
sobre os vídeos do YouTube em Posições (ele pediu pra ver as animações
primeiro e decidir depois).

## 🐛 BUGS CONHECIDOS

Nenhum ativo. Ver `BUGS.md` para o histórico (3 bugs resolvidos — B001, B002, B003).

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
