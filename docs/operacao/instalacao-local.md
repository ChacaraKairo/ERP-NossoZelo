# Instalação Local

## Pré-requisitos

- Node.js compatível com o projeto.
- npm.
- Docker e Docker Compose.

## Subir o ambiente

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

## URLs

```text
Web: http://localhost:3000
API: http://localhost:3001/api
Health: http://localhost:3001/api/health
PostgreSQL: localhost:5432
```

## Login local

```text
E-mail: admin@nossozelo.com.br
Senha: admin123
```

Troque a senha antes de qualquer uso real. A tela de login não exibe credenciais padrão.

## Resetar banco local

```bash
npm run db:down
npm run db:up
npm run db:push
npm run db:seed
```

## Validação

```bash
npm run lint
npm run typecheck
npm run build
npm run test
```

## Backup e restore local

O ERP possui tela de exportação em `/backup` com JSON completo e CSV financeiro. Para cópia fiel do PostgreSQL local, use também:

```bash
docker compose exec -T postgres pg_dump -U nossozelo -d nossozelo_erp > backup-nossozelo.sql
```

Para restaurar em um banco local limpo:

```bash
docker compose exec -T postgres psql -U nossozelo -d nossozelo_erp < backup-nossozelo.sql
```

Após restaurar, rode a validação básica da aplicação.
