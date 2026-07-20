# Visão Geral do Backend

## Decisão técnica

O backend do ERP NossoZelo será construído com:

```text
NestJS
TypeScript
Prisma ORM
MySQL
JWT ou sessão segura
RBAC simples
Auditoria obrigatória
```

## Motivo da escolha do NestJS

O ERP terá muitos módulos com regras de negócio próprias. NestJS organiza bem esse cenário porque separa responsabilidades em:

- `Module`: agrupa funcionalidades.
- `Controller`: recebe requisições HTTP.
- `Service`: executa regra de negócio.
- `DTO`: define entrada e validação.
- `Guard`: protege rotas.
- `Interceptor`: registra contexto, logs e auditoria.
- `Filter`: padroniza erros.
- `Provider`: encapsula integrações e infraestrutura.

## Modelo arquitetural

A primeira versão será um **monolito modular**.

Isso significa:

- uma única API;
- módulos bem separados;
- banco único;
- deploy simples;
- baixo custo;
- facilidade para rodar localmente com Electron;
- possibilidade de subir online futuramente.

## Por que não microserviços agora

Microserviços aumentariam custo, deploy, logs, autenticação entre serviços, monitoramento e complexidade operacional. Para uma MEI em fase inicial, isso seria excesso técnico.

A arquitetura correta para os próximos 2 anos é:

```text
Monolito modular bem organizado
```

Se futuramente houver escala real, alguns módulos podem ser extraídos.

## Modos de execução previstos

### 1. Local/Electron

O ERP poderá rodar como aplicativo desktop, usando:

```text
Electron
Next.js frontend
NestJS API local
MySQL local ou SQLite futuro, se decidido
```

A opção preferencial inicial é manter MySQL também no local para reduzir diferença entre desenvolvimento, desktop e produção.

### 2. Online

Quando mais pessoas precisarem acessar o ERP, a mesma API NestJS poderá ser hospedada em:

```text
Render
Railway
Fly.io
VPS
```

Com banco:

```text
MySQL gerenciado
```

## Princípios obrigatórios

1. Toda ação sensível deve ser auditada.
2. Nenhum segredo deve ser salvo no banco.
3. Todas as alterações críticas devem preservar histórico.
4. Deletes reais devem ser evitados; usar soft delete.
5. Controllers não devem conter regra de negócio.
6. Services devem ser testáveis.
7. DTOs devem validar entradas.
8. Erros devem seguir padrão único.
9. Permissões devem ser centralizadas.
10. O sistema deve funcionar primeiro localmente e depois online.

## Módulos do backend

```text
auth
users
roles
permissions
audit
fornecedores
servicos-contratados
financeiro
fiscal
suporte
tarefas
riscos
decisoes
base-conhecimento
relatorios
dashboard
configuracoes
health
```

## Convenção de nomes

- Pastas em kebab-case.
- Classes em PascalCase.
- Funções e métodos em camelCase.
- DTOs com sufixo `Dto`.
- Services com sufixo `Service`.
- Controllers com sufixo `Controller`.
- Guards com sufixo `Guard`.
- Decorators com sufixo semântico: `CurrentUser`, `Permissions`, `AuditAction`.

## Exemplo de padrão

```text
servicos-contratados/
├── servicos-contratados.module.ts
├── servicos-contratados.controller.ts
├── servicos-contratados.service.ts
├── dto/
│   ├── create-servico-contratado.dto.ts
│   ├── update-servico-contratado.dto.ts
│   └── list-servicos-contratados-query.dto.ts
└── entities/
    └── servico-contratado.entity.ts
```

## Resultado esperado

O backend deve permitir que o ERP opere de forma confiável, registrando dados da empresa, mantendo controle financeiro e permitindo rastrear todas as ações administrativas importantes.
