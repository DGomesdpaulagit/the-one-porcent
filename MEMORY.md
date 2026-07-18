# 🧬 MEMORY.md — DNA do Projeto

> Arquitetura completa, schema, design system, fluxos. Denso, raramente
> reescrito por inteiro — só a seção que mudou.

## 1. Visão geral

App pessoal de treino mental e tático para um jogador de futebol sub-14,
afastado por lesão. Curso interativo (estilo Duolingo) com 20 lições em 4
blocos, progresso salvo por usuário via Supabase Auth, desbloqueio
sequencial, e uma seção de consulta rápida (Posições) sempre acessível
independente do progresso no curso.

Especificação original completa em `docs/PROTOC_1_spec.md` (cópia do
briefing original do usuário).

## 2. Stack

- **Frontend:** Next.js 16.2.10 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4
- **Backend/dados:** Supabase (Postgres 17 + Auth)
- **Deploy:** Vercel (planejado, não configurado ainda)

## 3. Estrutura de pastas

```
src/
├── app/
│   ├── layout.tsx              ← layout raiz, fontes, metadata
│   ├── page.tsx                ← "/" — redirect para /dashboard
│   ├── globals.css             ← tema preto/dourado (variáveis CSS + @theme)
│   ├── login/page.tsx          ← login + cadastro (client component)
│   ├── dashboard/page.tsx      ← progresso geral, atalhos
│   ├── curso/
│   │   ├── page.tsx            ← lista das 20 lições em 4 blocos
│   │   └── [id]/
│   │       ├── page.tsx        ← detalhe da lição + exercício
│   │       └── actions.ts      ← server action markLessonCompleted
│   └── posicoes/page.tsx       ← consulta por posição (tabs client-side)
├── components/
│   ├── nav.tsx                 ← navegação superior (Início/Curso/Posições/Sair)
│   ├── markdown-lite.tsx       ← renderizador leve (## headers, - listas, **negrito**)
│   ├── complete-lesson-button.tsx ← botão "marcar como concluída" (client)
│   └── positions-view.tsx      ← tabs de posição (client)
├── lib/
│   ├── lessons.ts               ← withStatus() / groupByBlock() — lógica de desbloqueio
│   └── supabase/
│       ├── client.ts            ← cliente browser
│       ├── server.ts             ← cliente server component (cookies)
│       └── middleware.ts         ← updateSession() usado pelo proxy
└── proxy.ts                      ← proteção de rotas (Next.js 16; NÃO middleware.ts)
```

## 4. Schema Supabase (projeto `protocolo-ouro`, ref `pbbzozeztqrenpfnhylp`)

```sql
create table lessons (
  id smallint primary key,           -- 1-20, sequencial — a lógica de desbloqueio depende disso
  block smallint not null,           -- 1=Mentalidade, 2=Posições, 3=Momentos decisivos, 4=Retorno de lesão
  order_in_block smallint not null,  -- posição dentro do bloco (único por bloco! ver B001)
  title text not null,
  content text not null,             -- markdown leve: ## headers, - listas
  exercise_prompt text not null
);

create table positions_content (
  id smallserial primary key,
  position text not null,            -- volante | lateral | meia | zagueiro_libero | geral
  section text not null,             -- funcao_tatica | fundamentos_tecnicos | erros_comuns | treino | mentalidade | intro
  order_in_position smallint not null,
  content text not null
);

create table user_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id smallint not null references lessons (id),
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
```

**RLS:**
- `lessons` e `positions_content`: `select` liberado para qualquer usuário autenticado (conteúdo não é sensível, é o mesmo pra todo mundo).
- `user_progress`: `select`/`insert`/`delete` restritos a `auth.uid() = user_id`.

Ver decisão D005 em `DECISIONS.md` para o raciocínio completo.

## 5. Lógica de desbloqueio (`src/lib/lessons.ts`)

`withStatus(lessons, completedIds)` ordena as lições por `id` e marca cada
uma como `locked` / `available` / `completed`: a primeira lição é sempre
`available` se não concluída; as demais são `available` somente se a lição
anterior (por `id`, não por `order_in_block`) estiver em `completedIds`.
Isso assume que os `id`s são sequenciais 1-20 sem buracos — se um dia uma
lição for removida/inserida no meio, essa lógica precisa ser revisada.

## 6. Conteúdo das lições — mapeamento de blocos

| Bloco | Lições | Fonte |
|---|---|---|
| 1 — Mentalidade | 1-9 | `MENTALIDADE.docx` (8 seções reais) + lição 8 "Autocompaixão" escrita do zero (D003) |
| 2 — Posições | 10-17 | `POSIÇÕES.docx` (função tática/fundamentos e erros/treino/mentalidade × 4 posições) |
| 3 — Momentos decisivos | 18-19 | Conteúdo original (bola parada, liderança) — sem fonte nos documentos, autorizado pelo usuário |
| 4 — Retorno de lesão | 20 | Conteúdo original — sem fonte nos documentos, autorizado pelo usuário |

Zagueiro/Líbero (lições 16-17) tem cobertura de fonte mais fraca no
documento original — o aviso sobre isso foi preservado no conteúdo da lição
16, conforme pedido explícito da spec original.

## 7. Design system

- **Paleta:** fundo `#0a0a0a` / superfícies `#1c1c1c`, dourado `#d4af37` (`--gold`) e `#f5d67a` (`--gold-light`), texto `#f5f5f0`, texto secundário `#9a958a` (`--muted`), bordas `#2e2b23`.
- Definido em `src/app/globals.css` via variáveis CSS + `@theme inline` (Tailwind v4) — classes utilitárias: `bg-background`, `bg-surface`, `text-gold`, `text-gold-light`, `text-muted`, `border-border`.
- Tipografia: Geist Sans/Mono (padrão do template Next.js).
- Mobile-first, tema único (sempre escuro — não segue `prefers-color-scheme`, é intencional pela spec original).

## 8. Autenticação

Supabase Auth com email/senha. Cadastro exige confirmação por e-mail (fluxo
padrão do Supabase — não desativado). `src/proxy.ts` redireciona usuário não
autenticado para `/login` e usuário autenticado tentando acessar `/login`
para `/dashboard`.

## 9. Deploy

- **GitHub:** `DGomesdpaulagit/protocolo-ouro` (público), branch `main`.
- **Vercel:** projeto `protocolo-ouro`, time `davi-gomes-de-paula-s-projects` (`team_MRVYZqokJ4zZjm07oxoS6iqB`), conectado ao GitHub — todo push em `main` builda e publica em produção automaticamente. URL: https://protocolo-ouro.vercel.app.
- Variáveis de ambiente configuradas diretamente no dashboard da Vercel (Project Settings → Environment Variables) — mesmas duas do `.env.local`. Se o projeto Supabase mudar (nova URL/key), atualizar nos dois lugares.

## 10. Convenção de conteúdo (importante)

Este projeto tem uma regra explícita da spec original: **o conteúdo das
lições 1-7, 9-17 vem literalmente dos documentos-fonte** (`MENTALIDADE.docx`,
`POSIÇÕES.docx`) — extraído, não resumido, não reescrito. Qualquer edição
futura nesse conteúdo deve preservar essa regra. As exceções documentadas
(lição 8, lições 18-20) são conteúdo original e estão marcadas como tal em
`DECISIONS.md` D003.
