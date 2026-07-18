# 🐛 BUGS.md

## ✅ RESOLVIDOS

| ID | Bug | Causa | Solução | Data |
|---|---|---|---|---|
| B001 | Lições do Bloco 2 apareciam fora de ordem em `/curso` (agrupadas por "tática" depois "erros", em vez de 10→17) | `order_in_block` foi preenchido com valores repetidos (6/7) copiados do padrão do Bloco 1, em vez de sequencial 1-8 dentro do bloco | `update lessons set order_in_block = id - 9 where id between 10 and 17` | 2026-07-17 |
| B002 | Primeiro deploy em produção (Vercel) quebrava com "Your project's URL and Key are required to create a Supabase client!" no proxy/middleware | O deploy inicial rodou antes das variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY`) serem salvas no projeto Vercel; o "Redeploy" clicado pelo usuário não gerou uma build nova de fato (só havia 1 deployment registrado) | Push de um commit novo (trivial, doc) pra forçar uma build real depois das variáveis salvas — confirmado sem erros de runtime depois | 2026-07-18 |
| B003 | Página de Perfil não mostrava o título da lição no histórico (`entry.lessons?.[0]?.title` vinha `undefined`) | O cliente Supabase sem tipos gerados (`Database`) infere a relação `lessons(...)` embutida como array no TypeScript, mas em runtime o PostgREST retorna um objeto único (relação muitos-para-um) — o código lia `[0]?.title` de algo que já era o objeto | Helper `lessonTitle()` que trata os dois formatos possíveis (array ou objeto) em runtime | 2026-07-18 |

## 🔴 ATIVOS

Nenhum.

## 📝 TEMPLATE

**ID:** BXXX
**Status:** Ativo / Resolvido
**Descrição:** ...
**Causa:** ...
**Solução:** ...
**Data:** YYYY-MM-DD
