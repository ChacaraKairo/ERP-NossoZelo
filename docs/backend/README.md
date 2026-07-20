# Documentação do Backend — ERP NossoZelo

Esta pasta documenta a arquitetura completa do backend do ERP NossoZelo.

A decisão técnica é usar **NestJS + TypeScript + Prisma + MySQL**, com desenho preparado para dois modos de operação:

1. **Modo local/Electron**: uso individual ou por poucas pessoas na mesma máquina/rede, com banco local.
2. **Modo online futuro**: API hospedada em servidor, banco gerenciado e múltiplos usuários internos acessando remotamente.

## Princípio central

O ERP deve ser **totalmente auditável**. Toda ação relevante precisa deixar rastros técnicos e administrativos suficientes para responder:

- quem fez;
- quando fez;
- de onde fez;
- o que mudou;
- qual era o valor anterior;
- qual passou a ser o novo valor;
- qual entidade foi afetada;
- qual módulo foi afetado;
- qual foi o motivo, quando aplicável.

## Documentos

1. `00-visao-geral-backend.md` — visão geral e decisões técnicas.
2. `01-arquitetura-electron-online.md` — como o backend suporta Electron local e modo online futuro.
3. `02-estrutura-de-pastas.md` — árvore completa de arquivos do backend.
4. `03-modulos-classes-funcoes.md` — módulos, controllers, services, DTOs e funções esperadas.
5. `04-auditoria-total.md` — modelo de auditoria obrigatória do sistema.
6. `05-modelo-dados-prisma.md` — desenho inicial do schema Prisma.
7. `06-apis-endpoints.md` — contratos REST iniciais.
8. `07-seguranca-permissoes.md` — autenticação, RBAC, permissões e segurança.
9. `08-modo-local-sincronizacao.md` — estratégia para local-first e transição futura para online.
10. `09-roadmap-backend.md` — ordem de implementação recomendada.

## Decisão de arquitetura

```text
apps/api        -> backend NestJS
apps/web        -> frontend Next.js
packages/shared -> tipos, constantes e contratos compartilhados
prisma          -> schema e migrations
```

## Não objetivos da primeira versão

- Não implementar microserviços.
- Não implementar sincronização multi-dispositivo complexa no MVP.
- Não expor API pública para terceiros.
- Não automatizar NFS-e no primeiro momento.
- Não salvar senhas, tokens ou segredos no banco do ERP.

## Objetivo da primeira versão

Criar uma API modular, auditável e segura para sustentar os módulos centrais do ERP:

- autenticação;
- usuários internos;
- fornecedores;
- serviços contratados;
- financeiro;
- fiscal/MEI;
- suporte;
- tarefas;
- riscos;
- decisões;
- base de conhecimento;
- auditoria;
- relatórios;
- dashboard.
