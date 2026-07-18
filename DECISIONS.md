# 📐 DECISIONS.md — Architecture Decision Records

## D001 — Stack: Next.js + Supabase + Vercel

**Data:** 2026-07-17 · sessao-001
**Contexto:** Precisava de um app com auth, banco relacional simples e deploy fácil, para uso pessoal de um único usuário real.
**Decisão:** Next.js (App Router) no frontend, Supabase (Postgres + Auth) no backend, deploy planejado na Vercel.
**Motivo:** Definido na spec original do usuário (`docs/PROTOC_1_spec.md`) — combinação padrão, sem custo pra começar, e o usuário já tinha conta Supabase de outro projeto.
**Trade-off:** Nenhum custo hoje (tier grátis), mas amarra o projeto ao ecossistema Vercel/Supabase caso cresça muito.
**Revisitar quando:** Se o app precisar de múltiplos usuários reais ou volume que estoure o tier grátis.

## D002 — `src/proxy.ts` em vez de `middleware.ts`

**Data:** 2026-07-17 · sessao-001
**Contexto:** Next.js 16 emitiu warning de depreciação para o arquivo `middleware.ts`, recomendando a nova convenção `proxy.ts`.
**Decisão:** Renomear para `src/proxy.ts` com `export default async function proxy(...)`.
**Motivo:** Eliminar o warning agora, já que o projeto está começando do zero nesta versão do Next.js — mais barato migrar já do que depois.
**Trade-off:** Nenhum — mesma funcionalidade, só o nome do arquivo/export muda.
**Revisitar quando:** Nunca, a menos que o Next.js mude a convenção de novo.

## D003 — Lição 8 (Autocompaixão) e lições 18-20 são conteúdo original, não extraído dos documentos-fonte

**Data:** 2026-07-17 · sessao-001
**Contexto:** A spec original (`docs/PROTOC_1_spec.md`) esperava 9 seções no `MENTALIDADE_ampliado.docx` (incluindo uma seção de "Autocompaixão"), mas o arquivo `MENTALIDADE.docx` realmente enviado só tinha 8 seções — sem autocompaixão. Além disso, as lições 18-20 (bola parada, liderança, retorno de lesão) nunca tiveram fonte nos documentos — a spec já avisava isso.
**Decisão:** Perguntado ao usuário; ele escolheu que eu escrevesse a seção de Autocompaixão do zero, no mesmo estilo/tom do resto do documento, como lição 8 (empurrando a antiga seção 8 "Conclusão" para lição 9). Lições 18-20 também escritas do zero, com autorização prévia do usuário.
**Motivo:** Preferência explícita do usuário sobre as alternativas (usar só 8 lições, ou esperar o arquivo `_ampliado` real).
**Trade-off:** Esse conteúdo não vem de um vídeo/fonte real como o resto — é a "voz" do Claude imitando o tom do documento original, não uma transcrição.
**Revisitar quando:** Se o usuário conseguir o `MENTALIDADE_ampliado.docx` real com a seção de Autocompaixão original — nesse caso, substituir o conteúdo da lição 8 pelo texto real.

## D004 — Versão do `package.json` sincronizada com `CHANGELOG.md`

**Data:** 2026-07-17 · sessao-001
**Contexto:** O método de registro avisa que a versão do changelog pode divergir da versão do `package.json` se não for decidido explicitamente.
**Decisão:** Manter os dois sempre sincronizados — todo bump de versão no `CHANGELOG.md` deve ser acompanhado do mesmo bump em `package.json`.
**Motivo:** Projeto pequeno, um único mantenedor — não há ganho em versionar os dois de forma independente, só risco de confusão.
**Trade-off:** Nenhum relevante neste porte de projeto.
**Revisitar quando:** Nunca, a menos que o projeto vire algo com release process mais formal (ex.: publicado como pacote).

## D005 — RLS: conteúdo (`lessons`, `positions_content`) legível por qualquer autenticado; progresso restrito ao dono

**Data:** 2026-07-17 · sessao-001
**Contexto:** Definir as políticas de Row Level Security do Supabase para as três tabelas.
**Decisão:** `lessons` e `positions_content` têm `select` liberado para qualquer usuário autenticado (`using (true)`); `user_progress` tem `select`/`insert`/`delete` restritos a `auth.uid() = user_id`.
**Motivo:** O conteúdo do curso é o mesmo para todo mundo (não é dado sensível), só o progresso individual precisa ser privado.
**Trade-off:** Se um dia o app precisar de conteúdo diferente por usuário (ex.: múltiplos alunos com currículos distintos), esse modelo precisa mudar.
**Revisitar quando:** Se o app deixar de ser uso pessoal único e passar a ter múltiplos usuários com necessidades diferentes.

## D006 — Sidebar + route group `(app)` em vez de nav superior por página

**Data:** 2026-07-18 · sessao-004
**Contexto:** Usuário pediu redesign visual completo, incluindo trocar a navegação superior por uma barra lateral separando Início/Curso/Posições/Configurações.
**Decisão:** Todas as páginas autenticadas foram movidas para dentro de um route group `src/app/(app)/`, com um único `layout.tsx` renderizando `<Sidebar />` uma vez (em vez de cada página importar `<Nav />` individualmente). A sidebar é fixa à esquerda no desktop e vira barra de abas no rodapé no mobile.
**Motivo:** Elimina duplicação (uma navegação declarada uma única vez), e o route group não muda nenhuma URL (`(app)` não aparece na rota), então não quebra nada que já estava linkado.
**Trade-off:** Qualquer import de dentro do grupo por outro arquivo precisa do caminho literal com parênteses (ex.: `@/app/(app)/curso/[id]/actions`) — um pouco menos óbvio de descobrir se alguém não souber que o grupo existe. Documentado em `MEMORY.md` seção 3.
**Revisitar quando:** Se precisar de layouts diferentes para sub-seções dentro de `(app)` (ex.: uma página sem sidebar), pode exigir quebrar em grupos aninhados.

## D007 — Perfil absorvido por Configurações (não é mais item separado na navegação)

**Data:** 2026-07-18 · sessao-004
**Contexto:** O usuário pediu explicitamente 4 itens na sidebar (Início, Curso, Posições, Configurações) — não mencionou "Perfil" como item separado, e pediu uma página de Configurações pra "globalizar tudo relacionado a configurações".
**Decisão:** A rota `/perfil` foi renomeada para `/configuracoes` e passou a incluir, além de conta e "sobre o app": as metas pessoais e o histórico de lições que antes viviam em `/perfil`.
**Motivo:** Manter exatamente os 4 itens pedidos na navegação, sem inventar uma quinta seção que o usuário não pediu.
**Trade-off:** "Configurações" agora contém coisa que não é estritamente configuração (metas, histórico) — é um catch-all deliberado, não uma tela de settings pura.
**Revisitar quando:** Se o app crescer e justificar separar "Perfil" de "Configurações" de novo.

## D008 — Posições: animações e diagrama próprios primeiro, vídeo do YouTube fica pra depois

**Data:** 2026-07-18 · sessao-004
**Contexto:** Perguntado se deveria buscar os vídeos reais do YouTube citados como fonte no `POSIÇÕES.docx` e embutir como player em cada posição, ou focar em animações/diagramas próprios sem vídeo externo.
**Decisão:** Usuário pediu pra ver primeiro como fica só com animações (diagrama de campo SVG animado, transições de aba) antes de decidir sobre os vídeos.
**Motivo:** Preferência explícita do usuário — quer avaliar visualmente antes de comprometer com conteúdo de vídeo externo.
**Trade-off:** Nenhum ainda — decisão está em aberto.
**Revisitar quando:** Assim que o usuário der feedback sobre o resultado das animações. Se pedir vídeo, buscar os títulos exatos já citados como fonte em `positions_content` (preservando a mesma proveniência do texto).

## D009 — Rebrand "Protocolo Ouro" → "THE ONE PORCENT" inclui GitHub, Vercel e URL

**Data:** 2026-07-18 · sessao-004
**Contexto:** Usuário pediu rebrand completo, e perguntado se isso deveria incluir só o app ou também os recursos externos (repositório GitHub, projeto Vercel, URL de produção).
**Decisão:** Escopo completo — GitHub, Vercel e a URL também são renomeados, não só o texto dentro do app. O projeto Supabase (`protocolo-ouro` internamente) **não** foi renomeado, por não ser visível ao usuário final e não ter sido pedido explicitamente.
**Motivo:** Preferência explícita do usuário.
**Trade-off:** A URL de produção muda (de `protocolo-ouro.vercel.app` pra algo como `the-one-porcent.vercel.app`) — qualquer link salvo do endereço antigo deixa de funcionar. Sem ferramenta automática disponível pra renomear repositório GitHub ou projeto Vercel (nem `gh` CLI headless nem endpoint MCP) — depende de passos manuais do usuário no dashboard de cada serviço.
**Revisitar quando:** N/A — decisão definitiva, só falta execução (ver `sessions/sessao-004.md`).

## D010 — Planos de meta como templates estáticos por palavra-chave, não geração por IA em tempo real

**Data:** 2026-07-18 · sessao-005
**Contexto:** Usuário pediu que, ao criar uma meta, o sistema funcione "como um psicólogo" — gerando um plano passo a passo personalizado (etapas sequenciais + práticas contínuas ligadas a situações de jogo) pra ajudar a alcançar aquela meta específica.
**Decisão:** Implementado como correspondência estática por palavra-chave (`src/lib/goal-templates.ts`) contra um pequeno conjunto de templates que eu (Claude) escrevi com antecedência — hoje: capitão, cobrador de bola parada, e um genérico de fallback — em vez de chamar uma API de LLM em tempo real pra gerar um plano sob medida pra qualquer texto de meta.
**Motivo:** Uma integração de IA real em tempo de execução exigiria uma chave de API paga (ex.: Anthropic/OpenAI), gerenciamento de custo por geração, tratamento de erro de rede/latência, e potencialmente moderação de conteúdo pra entradas arbitrárias do usuário — escopo bem maior que o pedido original, e um novo componente de custo recorrente que o usuário não pediu explicitamente. Os templates estáticos cobrem os dois exemplos que o próprio usuário deu (capitão, cobrador — que já são citados como exemplo na spec original) com qualidade alta, e o fallback genérico garante que nenhuma meta fique sem plano.
**Trade-off:** Metas que não batem com nenhuma palavra-chave conhecida recebem o plano genérico, que é bom mas não específico pra aquele objetivo em particular. Não escala pra metas muito variadas sem eu escrever mais templates manualmente.
**Revisitar quando:** Se o usuário pedir explicitamente geração dinâmica por IA (aceitando o custo e a complexidade de integrar uma API de LLM), ou se aparecerem padrões claros de metas recorrentes que mereçam um template dedicado (ex.: "ser titular", "ganhar velocidade").

## D011 — Metas ganha página própria (`/metas`), sai de dentro de Configurações

**Data:** 2026-07-18 · sessao-005
**Contexto:** Na sessão 004, metas tinham sido movidas pra dentro de Configurações (D007) porque o usuário só tinha pedido 4 itens de sidebar. Nesta sessão, o usuário pediu explicitamente "uma página pra metas" com o sistema de plano/coaching.
**Decisão:** Criada a rota `/metas` como quinto item da sidebar (ícone `Target`), com o formulário de criar meta e a lista de `GoalCard`. Configurações perde a seção de metas — fica só com conta, atalho pra `/metas`, histórico de lições e "sobre o app".
**Motivo:** Preferência explícita do usuário, e faz sentido dado o tamanho novo da funcionalidade (plano com múltiplas etapas por meta não cabe bem dentro de uma seção de Configurações).
**Trade-off:** A sidebar volta a ter 5 itens em vez dos 4 que o usuário tinha pedido originalmente — mudança de requisito explícita, não um desvio silencioso.
**Revisitar quando:** N/A — decisão atual, revisitar só se o usuário pedir pra consolidar de novo.
