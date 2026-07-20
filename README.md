# ERP NossoZelo

ERP interno para gestão da empresa responsável pela operação, evolução e controle administrativo do marketplace NossoZelo.

Este repositório contém a documentação funcional, técnica e operacional para construir um ERP enxuto, sustentável e adequado à realidade de uma empresa brasileira em fase inicial, aberta como MEI, que precisa gerenciar o desenvolvimento e a operação do NossoZelo por pelo menos 2 anos.

## Objetivo

Criar um ERP próprio para centralizar a gestão da empresa que opera o NossoZelo, com foco em:

- financeiro;
- obrigações MEI;
- notas fiscais registradas manualmente;
- clientes e prestadores;
- assinaturas e pagamentos;
- suporte;
- tarefas internas;
- fechamento mensal;
- backup e exportação manual;
- auditoria administrativa;
- relatórios de operação.

## Contexto

O NossoZelo é um marketplace. A empresa precisa controlar não apenas receitas e despesas, mas também o ciclo operacional do negócio: prestadores, clientes, assinaturas, inadimplência, suporte, documentos, fiscal, custos de infraestrutura e evolução do produto.

O ERP não deve ser um sistema genérico gigante. Ele deve ser um sistema interno focado na operação real do NossoZelo.

## Princípios

1. Simplicidade antes de automação excessiva.
2. Baixo custo nos primeiros meses.
3. Controle financeiro desde o primeiro dia.
4. Separação entre dinheiro da empresa e dinheiro pessoal.
5. Auditoria para ações administrativas sensíveis.
6. Evolução incremental por módulos.
7. Integração com o marketplace NossoZelo.
8. Documentação clara para implementação por IA, Codex ou devs.

## Escopo inicial

O MVP do ERP deve conter:

- dashboard da empresa;
- financeiro básico;
- contas a pagar;
- contas a receber;
- obrigações MEI;
- notas fiscais manuais;
- assinaturas;
- clientes e prestadores;
- suporte/chamados;
- tarefas internas;
- fechamento mensal;
- backup e exportação manual;
- auditoria;
- relatórios básicos.

## Fora do escopo inicial

Não faz parte da primeira versão:

- emissão automática de NFS-e;
- conciliação bancária automática;
- Open Finance;
- folha de pagamento;
- controle de estoque;
- multiempresa;
- BI avançado;
- app mobile;
- CRM complexo.

## Estrutura da documentação

A documentação principal está em `docs/`.

A pasta `prompts/` contém prompts operacionais para orientar agentes de IA no desenvolvimento do sistema.

## Documentos principais

1. `docs/00-visao-geral.md`
2. `docs/01-contexto-da-empresa.md`
3. `docs/02-objetivos-do-erp.md`
4. `docs/03-escopo-mvp.md`
5. `docs/04-modulos-do-sistema.md`
6. `docs/05-regras-de-negocio.md`
7. `docs/06-modelo-de-dados.md`
8. `docs/07-telas-e-fluxos.md`
9. `docs/08-perfis-e-permissoes.md`
10. `docs/09-integracoes.md`
11. `docs/10-fiscal-mei.md`
12. `docs/11-roadmap-2-anos.md`
13. `docs/12-stack-tecnica.md`
14. `docs/13-deploy-e-infraestrutura.md`
15. `docs/14-checklist-de-entrega.md`

## Decisão inicial de produto

O ERP deve nascer como um sistema web administrativo, podendo inicialmente ser implementado integrado ao painel controlador/admin do NossoZelo ou como uma aplicação separada com o mesmo padrão técnico.

A decisão preferencial é manter separação lógica clara:

- marketplace público: usuários e prestadores;
- controlador/admin: operação do marketplace;
- ERP: gestão da empresa.

## Implementação atual

O MVP web administrativo foi iniciado a partir da documentação do projeto.

Inclui:

- client web em Next.js, React e TypeScript;
- API separada em NestJS;
- PostgreSQL como banco de dados;
- Prisma Client com schema do ERP;
- Docker Compose para Postgres local;
- seed inicial de empresa, usuário fundador, categorias financeiras, serviços contratados e dados piloto do marketplace;
- login administrativo com sessão segura;
- cookie `httpOnly` com token aleatório, sem ID puro do usuário;
- RBAC inicial por perfil;
- auditoria ampliada com sanitização de dados sensíveis;
- request ID em toda requisição da API;
- layout administrativo com menu lateral;
- dashboard;
- financeiro, lançamentos, contas a pagar e contas a receber;
- gastos fixos mensais obrigatórios com geração de conta a pagar;
- serviços contratados e registro de cobrança;
- Fiscal/MEI e notas fiscais manuais;
- marketplace: clientes, prestadores e assinaturas;
- suporte/chamados;
- tarefas internas;
- fechamento mensal com resumo, pendências e registro auditável;
- exportação manual de dados em JSON e financeiro em CSV;
- relatórios básicos;
- auditoria;
- configurações;
- endpoint de alertas calculados em `http://localhost:3001/api/alertas`;
- health check da API em `http://localhost:3001/api/health`.

## Como rodar localmente

```bash
npm install
cp .env.example .env
npm run db:up
npm run db:generate
npm run db:push
npm run db:seed
npm run dev:api
npm run dev:web
```

Acesse:

```text
http://localhost:3000
```

Login inicial:

```text
E-mail: admin@nossozelo.com.br
Senha: admin123
```

Troque essa senha antes de qualquer uso real.

## Scripts principais

```bash
npm run dev
npm run dev:web
npm run dev:api
npm run dev:all
npm run dev:fresh
npm run dev:stop
npm run lint
npm run build
npm run typecheck
npm run test
npm run db:generate
npm run db:up
npm run db:push
npm run db:seed
```

Documentação complementar:

- `docs/operacao/instalacao-local.md`
- `docs/operacao/checklist-mvp-real.md`
- `docs/seguranca/auditoria.md`
- `docs/seguranca/permissoes.md`
- `docs/electron/00-plano-electron.md`

Arquitetura local:

```text
Next client: http://localhost:3000
Nest API:    http://localhost:3001/api
PostgreSQL:  localhost:5432
```

Para produção, configure `DATABASE_URL`, `APP_URL`, `API_URL` e `NEXT_PUBLIC_API_URL` no provedor escolhido. O Postgres local usa as credenciais do `docker-compose.yml`.

Para iniciar tudo em uma única passada, encerrando servidores antigos nas portas 3000/3001 antes de subir:

```bash
npm run dev:fresh
```
