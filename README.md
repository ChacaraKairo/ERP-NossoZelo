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
- serviços contratados e infraestrutura;
- suporte;
- tarefas internas;
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
9. Preparação para modo local/Electron e modo online futuro.
10. Nenhuma ação crítica sem rastreabilidade.

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
- serviços contratados;
- fornecedores;
- suporte/chamados;
- tarefas internas;
- auditoria total;
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
- CRM complexo;
- sincronização local/online complexa.

## Estrutura da documentação

A documentação principal está em `docs/`.

A pasta `docs/backend/` contém a documentação completa do backend NestJS.

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
16. `docs/15-servicos-contratados.md`
17. `docs/16-lista-completa-de-telas.md`
18. `docs/17-telas-recomendadas-adicionais.md`

## Documentação do backend

1. `docs/backend/README.md`
2. `docs/backend/00-visao-geral-backend.md`
3. `docs/backend/01-arquitetura-electron-online.md`
4. `docs/backend/02-estrutura-de-pastas.md`
5. `docs/backend/03-modulos-classes-funcoes.md`
6. `docs/backend/04-auditoria-total.md`
7. `docs/backend/05-modelo-dados-prisma.md`
8. `docs/backend/06-apis-endpoints.md`
9. `docs/backend/07-seguranca-permissoes.md`
10. `docs/backend/08-modo-local-sincronizacao.md`
11. `docs/backend/09-roadmap-backend.md`

## Prompts operacionais

- `prompts/prompt-codex-backend-nestjs-auditoria.md`

## Decisão inicial de produto

O ERP deve nascer como um sistema web administrativo, mas com arquitetura preparada para virar aplicativo Electron futuramente.

A decisão preferencial é manter separação lógica clara:

- marketplace público: usuários e prestadores;
- controlador/admin: operação do marketplace;
- ERP: gestão da empresa.

## Decisão técnica do backend

O backend será documentado e implementado como:

```text
NestJS + TypeScript + Prisma + MySQL
```

Com suporte planejado a:

```text
APP_MODE=local
APP_MODE=desktop
APP_MODE=online
```

## Status

Documentação funcional, visual e arquitetural em construção.
