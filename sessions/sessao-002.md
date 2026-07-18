# Sessão 002 — GitHub + Deploy em produção na Vercel

**Data:** 2026-07-18
**Versão:** 1.0.0 → 1.0.1
**Tipo:** Implementação (infraestrutura/deploy) + aplicação do método de registro

## O que foi feito

1. Corrigido problema de acesso local: o servidor de preview usado para testar
   na sessão anterior tinha sido desligado e não subiu de novo sozinho.
   Religado diretamente via `npm run dev` em background, confirmado
   escutando em `0.0.0.0:3000`.
2. Aplicado o método de registro e continuidade entre sessões, a pedido do
   usuário (documento `metodo-registro-e-continuidade.md`): criados
   `CLAUDE.md` (reescrito), `MEMORY_CORE.md`, `MEMORY.md`, `CHANGELOG.md`,
   `BUGS.md`, `DECISIONS.md`, `sessions/sessao-001.md`,
   `docs/PROTOC_1_spec.md`, `docs/SUPABASE_SETUP.md`.
3. Primeiro commit local (`928079f`) com todo o build da sessão 001 + o
   sistema de memória.
4. Instalação do `gh` CLI via Chocolatey falhou por falta de permissão de
   administrador — resolvido pelo caminho manual (usuário criou o
   repositório vazio pelo site do GitHub).
5. Repositório remoto criado pelo usuário: `DGomesdpaulagit/protocolo-ouro`
   (público). Branch local renomeada de `master` para `main`, remoto
   adicionado, push inicial feito — sem precisar de login interativo porque
   o Git Credential Manager já tinha uma sessão GitHub salva na máquina.
6. Projeto importado na Vercel pelo usuário (`vercel.com/new` → Import Git
   Repository), time `davi-gomes-de-paula-s-projects`.
7. Primeiro deploy quebrou em runtime (B002 — variáveis de ambiente do
   Supabase não estavam presentes na build). Diagnosticado com
   `get_runtime_errors` da MCP da Vercel.
8. Corrigido: usuário salvou `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` nas configurações do projeto Vercel;
   como o "Redeploy" anterior não tinha gerado uma build nova de fato (só
   havia 1 deployment no histórico), foi feito um commit novo (atualização
   de doc) pra forçar um build real.
9. Novo deploy confirmado `READY`, sem erros de runtime, redirecionando
   corretamente pra `/login` — app em produção em
   https://protocolo-ouro.vercel.app.
10. Atualizados `CLAUDE.md`, `MEMORY_CORE.md`, `BUGS.md`, `CHANGELOG.md`,
    `package.json` (versão) com o resultado desta sessão.

## Detalhes técnicos

- O ambiente de preview interno (Browser pane / `preview_start`) não é a
  mesma coisa que o navegador real do usuário — quando o processo cai, o
  usuário perde acesso mesmo que eu "reinicie" via essa ferramenta se ela
  não persistir. Rodar `npm run dev` direto via Bash em background se
  mostrou mais confiável pra deixar algo acessível de fato no
  `localhost:3000` da máquina do usuário.
- `gh` CLI requer elevação (admin) pra instalar via Chocolatey neste
  ambiente — não vale tentar de novo sem resolver a permissão antes.
- Vercel + GitHub: a integração padrão (import via dashboard) já configura
  auto-deploy a cada push — não precisa de nenhum passo manual adicional
  depois disso.
- Variáveis `NEXT_PUBLIC_*` do Next.js são embutidas no bundle **no
  momento do build** — salvar a variável no dashboard da Vercel não afeta
  deployments já existentes; só a próxima build a usa.

## Verificação

- `curl` no domínio de produção: `307` → `/login` → `200`.
- `get_runtime_errors` (Vercel MCP) nos últimos 5 minutos após o novo
  deploy: nenhum erro.
- Deployment `dpl_DJ6MMM5XXCGNLcneo9VnDEPBe1cQ` com `readyState: READY`,
  `source: git`, alias incluindo `protocolo-ouro.vercel.app`.

## Decisões técnicas

Nenhuma decisão arquitetural nova nesta sessão (só operacional/infra) —
não foi necessário adicionar entrada em `DECISIONS.md`.

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `CLAUDE.md` | reescrito com rotina de fim de sessão, referência ao remoto Git e ao deploy automático |
| `MEMORY_CORE.md` | novo — estado atual v1.0.1, em produção |
| `MEMORY.md` | novo — arquitetura completa |
| `CHANGELOG.md` | nova entrada [1.0.1] |
| `BUGS.md` | novo — B001, B002 |
| `DECISIONS.md` | novo — D001-D005 |
| `docs/PROTOC_1_spec.md` | novo — cópia da spec original |
| `docs/SUPABASE_SETUP.md` | novo — guia de configuração do Supabase |
| `sessions/sessao-001.md` | novo — registro do build inicial |
| `package.json` | versão 1.0.0 → 1.0.1 |
| `.gitignore` | adicionado `.obsidian/` |
| Repositório GitHub | criado (`DGomesdpaulagit/protocolo-ouro`, público) |
| Projeto Vercel | criado e conectado ao GitHub, env vars configuradas |

## Status para retomar

- App em produção, funcionando, sem bugs ativos conhecidos.
- Todo push em `main` dispara deploy automático — não precisa de comando
  manual.
- Único item pendente do roadmap original: página de Perfil (opcional).
