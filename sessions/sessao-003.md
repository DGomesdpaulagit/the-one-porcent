# Sessão 003 — Página de Perfil

**Data:** 2026-07-18
**Versão:** 1.0.1 → 1.1.0
**Tipo:** Implementação

## O que foi feito

Implementado o último item opcional do roadmap original (`docs/PROTOC_1_spec.md`
seção 4): a página de Perfil, com metas pessoais e histórico de lições
concluídas por data.

1. Nova tabela `user_goals` no Supabase (`id`, `user_id`, `text`, `achieved`,
   `created_at`) com RLS restrita ao dono (`auth.uid() = user_id`).
2. Server actions (`src/app/perfil/actions.ts`): `addGoal`, `toggleGoal`,
   `deleteGoal` — todas exigem usuário autenticado e fazem `revalidatePath`.
3. Componente client `GoalsList` (`src/components/goals-list.tsx`): form de
   adicionar meta, checkbox pra marcar concluída, botão de remover.
4. Página `/perfil` (`src/app/perfil/page.tsx`, server component): busca
   metas e histórico em paralelo, agrupa o histórico por data formatada em
   pt-BR, renderiza as duas seções.
5. Link "Perfil" adicionado à navegação (`src/components/nav.tsx`).
6. Testado ponta a ponta com usuário de teste: adicionar meta, marcar como
   concluída (confirmado no banco), ver lição no histórico agrupado por
   data — encontrado e corrigido o bug B003 nesse processo.
7. Registros de memória atualizados (`MEMORY.md`, `MEMORY_CORE.md`,
   `CHANGELOG.md`, `BUGS.md`, `package.json`).

## Detalhes técnicos

- **B003:** o cliente Supabase deste projeto não usa tipos gerados
  (`Database` genérico), então o TypeScript infere qualquer relação
  embutida (`lessons(...)` dentro de um `select` de `user_progress`) como
  array por padrão — mas em runtime o PostgREST retorna um objeto único
  quando a relação é muitos-para-um (cada linha de `user_progress` aponta
  pra uma única lição). Resolvido com uma função `lessonTitle()` que trata
  os dois formatos possíveis, em vez de confiar cegamente no tipo inferido.
  Vale lembrar disso em qualquer novo `select` com relação embutida neste
  projeto.

## Verificação

- `npm run build`: 0 erros (precisou de duas correções de tipo até passar,
  ambas documentadas acima).
- Testado no navegador com usuário de teste (criado e removido do banco
  depois, como de costume): meta adicionada e persistida, checkbox
  atualizando `achieved` no banco, lição concluída aparecendo no histórico
  com o título correto.

## Decisões técnicas

Nenhuma decisão arquitetural nova — não foi necessário adicionar entrada em
`DECISIONS.md`.

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `src/app/perfil/page.tsx` | novo — página de Perfil |
| `src/app/perfil/actions.ts` | novo — server actions de metas |
| `src/components/goals-list.tsx` | novo — lista de metas (client) |
| `src/components/nav.tsx` | link "Perfil" adicionado |
| `MEMORY.md` | estrutura de pastas e schema atualizados |
| `MEMORY_CORE.md` | estado atual v1.1.0 |
| `CHANGELOG.md` | nova entrada [1.1.0] |
| `BUGS.md` | B003 registrado e resolvido |
| `package.json` | versão 1.0.1 → 1.1.0 |
| Banco Supabase | tabela `user_goals` + RLS |

## Status para retomar

- Roadmap original 100% entregue (incluindo o item opcional de Perfil).
- App em produção, sem bugs ativos conhecidos.
- Nenhuma tarefa pendente conhecida — próximos passos ficam a critério do
  usuário.
