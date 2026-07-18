@AGENTS.md

# CLAUDE.md — Instruções do Projeto

**Protocolo Ouro** — app pessoal de treino mental e tático para um jogador de
futebol sub-14, afastado por lesão. Curso estilo Duolingo (20 lições em 4
blocos, desbloqueio sequencial) + consulta rápida de Posições, sempre
disponível independente do progresso.

## Stack

- **Frontend:** Next.js 16 (App Router, Turbopack), Tailwind CSS v4, TypeScript
- **Backend/dados:** Supabase (Postgres + Auth) — projeto `protocolo-ouro`, ref `pbbzozeztqrenpfnhylp`
- **Deploy:** Vercel (ainda não configurado — ver `MEMORY_CORE.md`)

## Comandos

```
npm run dev      # servidor local em http://localhost:3000
npm run build    # build de produção (rodar antes de considerar algo pronto)
npm run lint     # eslint
```

## Contexto / memória — ler nesta ordem no início de cada sessão

1. `MEMORY_CORE.md` — estado atual (2-3 min)
2. `MEMORY.md` — arquitetura completa, schema, design system (se precisar de profundidade)
3. última `sessions/sessao-0XX.md` — exatamente onde a sessão anterior parou
4. `BUGS.md` — problemas ativos conhecidos

## 📌 ROTINA OBRIGATÓRIA DE FIM DE BLOCO/SESSÃO

Executar sempre ao concluir um bloco de trabalho significativo:

1. **Registros completos:**
   - Criar `sessions/sessao-0XX.md` NOVO (nunca editar um antigo).
   - Atualizar `CHANGELOG.md` (nova entrada, versão + data + resumo + link).
   - Atualizar `MEMORY_CORE.md` (data, versão, status, próxima sessão).
   - Atualizar `MEMORY.md` SE algo estrutural mudou (schema, arquitetura).
   - Atualizar `BUGS.md` e/ou `DECISIONS.md` SE aplicável.
2. **Commit + Push:**
   - `git add` dos arquivos específicos (nunca `git add -A` sem checar antes).
   - Commit descritivo (o quê + por quê).
   - `git push origin main` — remoto: `https://github.com/DGomesdpaulagit/protocolo-ouro` (público).
3. **Deploy:**
   - **Automático.** Vercel está conectado ao GitHub (projeto `protocolo-ouro`, time `davi-gomes-de-paula-s-projects`) — todo push em `main` dispara build e deploy de produção sozinho, não precisa rodar nenhum comando. URL: https://protocolo-ouro.vercel.app.
   - Variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) já configuradas no projeto Vercel — só mudam se o projeto Supabase mudar (ver `docs/SUPABASE_SETUP.md`).
4. **Resumo final pro usuário:** checklist numerado (ver `metodo-registro-e-continuidade.md` na pasta `Documents` para o formato exato), depois 1-2 parágrafos em prosa.

## Convenções

- **Bugs:** `B001`, `B002`... sequencial, nunca reutilizar número.
- **Decisões:** `D001`, `D002`... mesma regra.
- **Sessões:** `sessao-001.md`, `sessao-002.md`... nunca reescrever uma antiga.
- **Versão:** sincronizada entre `package.json` e `CHANGELOG.md` (decisão D004) — sempre bump os dois juntos.

## Coisas específicas deste projeto que vale lembrar

- Conteúdo das lições vem de dois documentos-fonte reais (`MENTALIDADE.docx`,
  `POSIÇÕES.docx`) — **não resumir nem gerar conteúdo novo por conta própria**
  quando for editar o texto das lições existentes. Exceção já feita e
  documentada: lição 8 (Autocompaixão) e lições 18-20 são conteúdo original,
  ver `DECISIONS.md` D003.
- IDs das lições (1-20) são sequenciais e a lógica de desbloqueio depende
  disso (`lesson.id === lesson_anterior.id + 1`) — ver `src/lib/lessons.ts`.
  Ao adicionar/remover lições, cuidado para não quebrar essa sequência.
- `order_in_block` já causou um bug real (B001) por ficar duplicado entre
  lições do mesmo bloco — sempre conferir que é único e sequencial dentro do
  bloco antes de inserir novo conteúdo.
