# ⚡ MEMORY_CORE.md — Estado Atual do Projeto

> Atualizar a cada sessão. Manter pequeno e rápido de ler.

## 📍 ESTADO ATUAL

**Data:** 2026-07-18
**Versão:** 1.1.0 — build completo + página de Perfil, em produção
**Status:** App no ar em https://protocolo-ouro.vercel.app. GitHub (`DGomesdpaulagit/protocolo-ouro`, público) conectado à Vercel — todo push em `main` dispara deploy automático. Roadmap original 100% entregue, incluindo o item opcional de Perfil.

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
- [x] Repositório GitHub público criado e conectado (`DGomesdpaulagit/protocolo-ouro`)
- [x] Deploy na Vercel configurado com integração Git (auto-deploy) + env vars do Supabase
- [x] Página de Perfil: metas pessoais (adicionar/marcar concluída/remover) + histórico de lições concluídas agrupado por data

## 🎯 PRÓXIMA SESSÃO

Roadmap inicial da spec (`docs/PROTOC_1_spec.md`) 100% entregue, incluindo o item opcional de Perfil, tudo em produção. Nenhuma tarefa obrigatória pendente — próximos passos ficam a critério do usuário (ex.: domínio próprio, mais lições, ajustes de conteúdo).

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
