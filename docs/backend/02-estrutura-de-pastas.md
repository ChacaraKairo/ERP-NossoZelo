# Estrutura Completa de Pastas do Backend

## Estrutura geral do repositório

```text
ERP-NossoZelo/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   └── shared/
├── prisma/
├── docs/
└── prompts/
```

## Estrutura do backend NestJS

```text
apps/api/
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── nest-cli.json
├── .env.example
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   │
│   ├── config/
│   │   ├── configuration.ts
│   │   ├── env.validation.ts
│   │   └── config.module.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── permissions.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── audit-action.decorator.ts
│   │   │
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── permissions.guard.ts
│   │   │   └── local-only.guard.ts
│   │   │
│   │   ├── interceptors/
│   │   │   ├── audit.interceptor.ts
│   │   │   ├── response.interceptor.ts
│   │   │   └── request-context.interceptor.ts
│   │   │
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts
│   │   │   └── prisma-exception.filter.ts
│   │   │
│   │   ├── pipes/
│   │   │   └── zod-validation.pipe.ts
│   │   │
│   │   ├── types/
│   │   │   ├── request-user.type.ts
│   │   │   ├── request-context.type.ts
│   │   │   └── api-response.type.ts
│   │   │
│   │   └── utils/
│   │       ├── pagination.ts
│   │       ├── normalize-money.ts
│   │       ├── diff-objects.ts
│   │       └── redact-sensitive-data.ts
│   │
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── auth/
│   ├── users/
│   ├── roles/
│   ├── permissions/
│   ├── audit/
│   ├── fornecedores/
│   ├── servicos-contratados/
│   ├── financeiro/
│   ├── fiscal/
│   ├── suporte/
│   ├── tarefas/
│   ├── riscos/
│   ├── decisoes/
│   ├── base-conhecimento/
│   ├── dashboard/
│   ├── relatorios/
│   ├── configuracoes/
│   └── health/
│
├── test/
└── dist/
```

## Estrutura padrão de cada módulo

```text
nome-do-modulo/
├── nome-do-modulo.module.ts
├── nome-do-modulo.controller.ts
├── nome-do-modulo.service.ts
├── dto/
│   ├── create-*.dto.ts
│   ├── update-*.dto.ts
│   └── list-*.query.dto.ts
├── entities/
│   └── *.entity.ts
├── constants/
│   └── *.constants.ts
└── tests/
    └── nome-do-modulo.service.spec.ts
```

## Arquivos raiz do backend

### `main.ts`

Responsável por inicializar a aplicação.

Deve configurar:

- prefixo global `/api`;
- CORS;
- pipes globais;
- filters globais;
- interceptors globais;
- documentação Swagger, se ativada;
- porta da aplicação.

### `app.module.ts`

Responsável por importar todos os módulos principais.

### `app.controller.ts`

Deve ter apenas rota básica de identificação da API, se necessário.

### `app.service.ts`

Deve retornar metadados mínimos da aplicação.

## Configuração

### `config/configuration.ts`

Centraliza leitura das variáveis de ambiente.

### `config/env.validation.ts`

Valida variáveis obrigatórias.

Variáveis mínimas:

```text
NODE_ENV
PORT
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
APP_MODE
CORS_ORIGINS
```

### `APP_MODE`

Valores:

```text
local
desktop
online
```

## Common

A pasta `common` contém recursos reutilizáveis por todos os módulos.

### Decorators

- `@CurrentUser()` obtém usuário autenticado.
- `@Permissions()` define permissões exigidas.
- `@Public()` libera rota sem autenticação.
- `@AuditAction()` define metadados de auditoria.

### Guards

- `JwtAuthGuard`: exige autenticação.
- `PermissionsGuard`: valida permissões.
- `LocalOnlyGuard`: bloqueia rotas que só podem rodar no modo local.

### Interceptors

- `AuditInterceptor`: registra ações auditáveis.
- `ResponseInterceptor`: padroniza respostas.
- `RequestContextInterceptor`: coleta IP, user-agent, request-id e contexto.

### Filters

- `HttpExceptionFilter`: padroniza erros HTTP.
- `PrismaExceptionFilter`: traduz erros do Prisma.

### Utils

- `pagination.ts`: normaliza paginação.
- `normalize-money.ts`: converte valores monetários.
- `diff-objects.ts`: calcula antes/depois para auditoria.
- `redact-sensitive-data.ts`: remove senhas, tokens e segredos de logs/auditoria.

## Prisma

### `prisma/prisma.module.ts`

Exporta `PrismaService`.

### `prisma/prisma.service.ts`

Estende `PrismaClient` e controla conexão/desconexão.

## Ordem de criação dos módulos

1. `config`
2. `prisma`
3. `common`
4. `auth`
5. `users`
6. `roles`
7. `permissions`
8. `audit`
9. `fornecedores`
10. `servicos-contratados`
11. `financeiro`
12. `dashboard`
13. `fiscal`
14. `suporte`
15. `tarefas`
16. `riscos`
17. `decisoes`
18. `base-conhecimento`
19. `relatorios`
20. `configuracoes`
21. `health`
