# Prompt Codex — Backend NestJS Auditável

Use este prompt para orientar o Codex na implementação do backend do ERP NossoZelo.

---

Você é responsável por implementar o backend do ERP NossoZelo.

## Contexto

O ERP NossoZelo é um sistema interno para gestão da empresa que opera o marketplace NossoZelo. Ele deve controlar financeiro, MEI, serviços contratados, fornecedores, suporte, tarefas, riscos, decisões, base de conhecimento, auditoria e relatórios.

O sistema deve nascer preparado para rodar localmente e futuramente como aplicativo Electron, mas também deve poder migrar para modo online quando mais pessoas precisarem acessar.

## Stack obrigatória

- NestJS
- TypeScript
- Prisma ORM
- MySQL
- JWT ou sessão segura
- RBAC
- Auditoria total

## Arquitetura

Criar backend em:

```text
apps/api
```

Usar estrutura:

```text
apps/api/src/
├── main.ts
├── app.module.ts
├── config/
├── common/
├── prisma/
├── auth/
├── users/
├── roles/
├── permissions/
├── audit/
├── fornecedores/
├── servicos-contratados/
├── financeiro/
├── fiscal/
├── suporte/
├── tarefas/
├── riscos/
├── decisoes/
├── base-conhecimento/
├── dashboard/
├── relatorios/
├── configuracoes/
└── health/
```

## Regras obrigatórias

1. Não colocar regra de negócio em controller.
2. Controllers apenas validam entrada, chamam services e retornam resposta.
3. Services executam regras de negócio.
4. Acesso ao banco deve passar por PrismaService.
5. Todas as entradas devem ter DTO.
6. Usar validação.
7. Todas as ações sensíveis devem auditar.
8. Nunca salvar senha, token ou secret em auditoria.
9. Não usar delete físico em registros críticos.
10. Usar soft delete.
11. Preparar APP_MODE com valores `local`, `desktop`, `online`.
12. Preparar requestId em toda requisição.
13. Padronizar erros.
14. Padronizar respostas.

## Auditoria obrigatória

Implementar:

```text
AuditModule
AuditService
AuditInterceptor
@AuditAction
redactSensitiveData
diffObjects
```

A auditoria deve registrar:

```text
request_id
actor_user_id
action
module
entity_type
entity_id
status
severity
before_data
after_data
metadata
reason
ip_address
user_agent
app_mode
device_id
created_at
```

## Não salvar em auditoria

```text
password
senha
token
secret
apiKey
api_key
AWS_SECRET_ACCESS_KEY
ASAAS_API_KEY
JWT_SECRET
cookie
authorization
```

Substituir por:

```text
[REDACTED]
```

## Ordem de implementação

1. Criar apps/api com NestJS.
2. Configurar ConfigModule.
3. Configurar PrismaModule.
4. Criar HealthModule.
5. Criar common filters/interceptors/decorators.
6. Criar AuthModule.
7. Criar UsersModule.
8. Criar RolesModule e PermissionsModule.
9. Criar AuditModule.
10. Criar FornecedoresModule.
11. Criar ServicosContratadosModule.
12. Criar FinanceiroModule.
13. Criar DashboardModule.
14. Criar FiscalModule.
15. Criar SuporteModule.
16. Criar TarefasModule.
17. Criar RiscosModule.
18. Criar DecisoesModule.
19. Criar BaseConhecimentoModule.
20. Criar RelatoriosModule.

## Primeiro CRUD real

Implementar primeiro:

```text
Fornecedores
Serviços Contratados
Cobranças de Serviços
Referências de Credenciais
```

Motivo: o ERP precisa controlar AWS, Render, Vercel, Railway, Asaas, Registro.br, Cloudflare, Resend e GitHub desde o início.

## Critério de aceite inicial

A primeira entrega do backend só estará correta se:

- a API sobe localmente;
- `/api/health` responde;
- Prisma conecta no MySQL;
- existe usuário admin inicial via seed;
- login funciona;
- rota privada exige autenticação;
- permissão negada gera auditoria;
- criar fornecedor gera auditoria;
- criar serviço contratado gera auditoria;
- atualizar serviço contratado registra before/after;
- dados sensíveis são mascarados;
- nenhum segredo é salvo no banco.

## Documentação obrigatória a seguir

Antes de implementar, leia:

```text
docs/backend/README.md
docs/backend/00-visao-geral-backend.md
docs/backend/01-arquitetura-electron-online.md
docs/backend/02-estrutura-de-pastas.md
docs/backend/03-modulos-classes-funcoes.md
docs/backend/04-auditoria-total.md
docs/backend/05-modelo-dados-prisma.md
docs/backend/06-apis-endpoints.md
docs/backend/07-seguranca-permissoes.md
docs/backend/08-modo-local-sincronizacao.md
docs/backend/09-roadmap-backend.md
```

## Entrega esperada

Criar uma PR com:

- estrutura `apps/api`;
- NestJS configurado;
- Prisma configurado;
- schema inicial;
- seed inicial;
- Auth base;
- Audit base;
- CRUD de fornecedores;
- CRUD de serviços contratados;
- testes mínimos para services principais;
- README de execução local.
