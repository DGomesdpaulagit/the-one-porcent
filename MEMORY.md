# 🧬 MEMORY.md — DNA do Projeto

> Arquitetura completa, schema, design system, fluxos. Denso, raramente
> reescrito por inteiro — só a seção que mudou.

## 1. Visão geral

**THE ONE PORCENT** (renomeado de "Protocolo Ouro" na sessão 004 — mesmo
projeto, novo nome, referência direta à lição "Geração 1%" do curso). App
pessoal de treino mental e tático para um jogador de futebol sub-14,
afastado por lesão. Curso interativo (estilo Duolingo) com 20 lições em 4
blocos, progresso salvo por usuário via Supabase Auth, desbloqueio
sequencial, e uma seção de consulta rápida (Posições) sempre acessível
independente do progresso no curso.

Especificação original completa em `docs/PROTOC_1_spec.md` (cópia do
briefing original do usuário — nome interno do projeto na spec ainda é
"Protocolo Ouro", é histórico, não foi reescrito).

## 2. Stack

- **Frontend:** Next.js 16.2.10 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4
- **Animação/UI:** framer-motion (transições, listas animadas), lucide-react (ícones)
- **Backend/dados:** Supabase (Postgres 17 + Auth) — projeto interno ainda chamado `protocolo-ouro` no Supabase (não renomeado, é só o nome interno do projeto na Supabase, invisível pro usuário final)
- **Deploy:** Vercel, conectado ao GitHub (ver seção 9)

## 3. Estrutura de pastas

```
src/
├── app/
│   ├── layout.tsx              ← layout raiz, fontes, metadata (título "THE ONE PORCENT")
│   ├── page.tsx                ← "/" — redirect para /dashboard
│   ├── globals.css             ← design system preto/dourado (tokens, .card, scrollbar, etc.)
│   ├── login/page.tsx          ← login + cadastro (client component)
│   └── (app)/                  ← route group: todas as páginas autenticadas, com sidebar
│       ├── layout.tsx          ← renderiza <Sidebar /> + conteúdo
│       ├── dashboard/page.tsx  ← Início: dashboard de painéis (progresso, próxima lição, posições, metas)
│       ├── curso/
│       │   ├── page.tsx            ← lista das 20 lições em 4 blocos (via CourseList)
│       │   └── [id]/
│       │       ├── page.tsx        ← detalhe da lição + exercício
│       │       └── actions.ts      ← server action markLessonCompleted
│       ├── posicoes/page.tsx   ← consulta por posição (campo animado + tabs)
│       └── configuracoes/
│           ├── page.tsx        ← conta, metas pessoais, histórico, sobre (absorveu /perfil)
│           └── actions.ts      ← server actions addGoal/toggleGoal/deleteGoal
├── components/
│   ├── sidebar.tsx              ← nav lateral (desktop) + top bar/bottom tabs (mobile)
│   ├── fade-in.tsx               ← wrapper de animação de entrada (framer-motion)
│   ├── radial-progress.tsx       ← anel de progresso SVG animado
│   ├── course-list.tsx           ← lista de blocos/lições com stagger animation
│   ├── position-field.tsx        ← diagrama SVG de campo com marcadores por posição
│   ├── positions-view.tsx        ← tabs + campo + conteúdo animado (client)
│   ├── goals-list.tsx            ← lista de metas pessoais (add/toggle/remover, client)
│   ├── sign-out-button.tsx       ← botão de logout reutilizável
│   ├── markdown-lite.tsx         ← renderizador leve (## headers, - listas, **negrito**)
│   └── complete-lesson-button.tsx ← botão "marcar como concluída" com animação de sucesso
├── lib/
│   ├── lessons.ts               ← withStatus() / groupByBlock() / blockProgress() — lógica de desbloqueio e progresso
│   └── supabase/
│       ├── client.ts            ← cliente browser
│       ├── server.ts             ← cliente server component (cookies)
│       └── middleware.ts         ← updateSession() usado pelo proxy
└── proxy.ts                      ← proteção de rotas (Next.js 16; NÃO middleware.ts)
```

**Nota sobre o route group `(app)`:** o nome entre parênteses não aparece na
URL (é só organização de pastas do Next.js) — `/dashboard`, `/curso`,
`/posicoes` e `/configuracoes` continuam com as mesmas URLs de antes.
Importar algo de dentro do grupo usa o caminho literal com parênteses, ex.:
`@/app/(app)/curso/[id]/actions`.

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

create table user_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  text text not null,
  achieved boolean not null default false,
  created_at timestamptz not null default now()
);
```

**RLS:**
- `lessons` e `positions_content`: `select` liberado para qualquer usuário autenticado (conteúdo não é sensível, é o mesmo pra todo mundo).
- `user_progress` e `user_goals`: `select`/`insert`/`update`/`delete` restritos a `auth.uid() = user_id`.

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

- **Paleta:** fundo `#08080a` / superfície `#151513` / superfície elevada `#1e1e1a`, dourado `#d4af37` (`--gold`), `#f5d67a` (`--gold-light`), `#8a6f24` (`--gold-dim`), texto `#f5f3ec`, texto secundário `#9a958a` (`--muted`) e `#6b675e` (`--muted-2`), bordas `#2a271e` / `#3a3628` (`--border-light`), vermelho de perigo `#e5484d` (`--danger`).
- Definido em `src/app/globals.css` via variáveis CSS + `@theme inline` (Tailwind v4). Classes utilitárias próprias: `.card` (superfície + borda + radius padrão), `.card-hover` (glow dourado sutil no hover), `.gold-text-gradient` (texto com gradiente dourado, usado na wordmark).
- Fundo com glow radial sutil dourado (`body` em `globals.css`), scrollbar customizada, seleção de texto dourada, `:focus-visible` com outline dourado.
- Tipografia: Geist Sans/Mono (padrão do template Next.js).
- Mobile-first, tema único (sempre escuro — não segue `prefers-color-scheme`, é intencional pela spec original).
- **Animações (framer-motion):** entrada em fade+slide (`FadeIn`), stagger em listas (`CourseList`, `GoalsList`), progresso animado (`RadialProgress`, barras de bloco), transição de aba com `AnimatePresence` (Posições), indicador ativo da sidebar com `layoutId` (efeito de "pílula deslizante"), animação de sucesso ao concluir lição.
- **Navegação:** sidebar fixa à esquerda no desktop (`md:` e acima); no mobile vira barra superior (marca + sair) + barra de abas fixa embaixo (ícones lucide-react). Ver `src/components/sidebar.tsx`.

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
