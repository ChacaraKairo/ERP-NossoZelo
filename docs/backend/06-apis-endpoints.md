# APIs e Endpoints Iniciais

## Convenção geral

Prefixo global:

```text
/api
```

Exemplo:

```text
GET /api/servicos-contratados
```

## Padrão de resposta de sucesso

```json
{
  "data": {},
  "meta": {
    "requestId": "req_123"
  }
}
```

Para listas:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "requestId": "req_123"
  }
}
```

## Padrão de erro

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "fields": {}
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

## Auth

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
PATCH /api/auth/change-password
```

### `POST /api/auth/login`

Body:

```json
{
  "email": "admin@nossozelo.com.br",
  "password": "senha"
}
```

Auditoria:

```text
AUTH_LOGIN_SUCCESS
AUTH_LOGIN_FAILED
```

## Usuários internos

```text
GET    /api/users
POST   /api/users
GET    /api/users/:id
PATCH  /api/users/:id
PATCH  /api/users/:id/activate
PATCH  /api/users/:id/deactivate
```

Permissões:

```text
users.read
users.write
```

Auditoria:

```text
USER_CREATED
USER_UPDATED
USER_ACTIVATED
USER_DEACTIVATED
```

## Fornecedores

```text
GET    /api/fornecedores
POST   /api/fornecedores
GET    /api/fornecedores/:id
PATCH  /api/fornecedores/:id
DELETE /api/fornecedores/:id
```

Query:

```text
status
categoria
search
page
perPage
```

Auditoria:

```text
FORNECEDOR_CREATED
FORNECEDOR_UPDATED
FORNECEDOR_DELETED
```

## Serviços contratados

```text
GET    /api/servicos-contratados
POST   /api/servicos-contratados
GET    /api/servicos-contratados/:id
PATCH  /api/servicos-contratados/:id
DELETE /api/servicos-contratados/:id
PATCH  /api/servicos-contratados/:id/marcar-revisao
```

Query:

```text
status
fornecedorId
categoria
criticidade
ambiente
moeda
search
page
perPage
```

Auditoria:

```text
SERVICO_CONTRATADO_CREATED
SERVICO_CONTRATADO_UPDATED
SERVICO_CONTRATADO_DELETED
SERVICO_CONTRATADO_MARKED_FOR_REVIEW
```

## Cobranças de serviços

```text
GET   /api/servicos-contratados/:id/cobrancas
POST  /api/servicos-contratados/:id/cobrancas
PATCH /api/servicos-cobrancas/:cobrancaId/pagar
```

Auditoria:

```text
SERVICO_COBRANCA_CREATED
SERVICO_COBRANCA_PAID
```

## Referências de credenciais

```text
GET   /api/servicos-contratados/:id/credenciais-referencias
POST  /api/servicos-contratados/:id/credenciais-referencias
PATCH /api/credenciais-referencias/:id/rotacionar
```

Regra:

```text
Nunca enviar ou retornar segredo real.
```

Auditoria:

```text
CREDENCIAL_REFERENCIA_CREATED
CREDENCIAL_REFERENCIA_VIEWED
CREDENCIAL_REFERENCIA_ROTATED
```

## Financeiro

### Resumo

```text
GET /api/financeiro/resumo?mes=7&ano=2026
```

### Lançamentos

```text
GET    /api/financeiro/lancamentos
POST   /api/financeiro/lancamentos
GET    /api/financeiro/lancamentos/:id
PATCH  /api/financeiro/lancamentos/:id
DELETE /api/financeiro/lancamentos/:id
```

### Contas a pagar

```text
GET   /api/financeiro/contas-a-pagar
POST  /api/financeiro/contas-a-pagar
GET   /api/financeiro/contas-a-pagar/:id
PATCH /api/financeiro/contas-a-pagar/:id
PATCH /api/financeiro/contas-a-pagar/:id/pagar
PATCH /api/financeiro/contas-a-pagar/:id/cancelar
```

### Contas a receber

```text
GET   /api/financeiro/contas-a-receber
POST  /api/financeiro/contas-a-receber
GET   /api/financeiro/contas-a-receber/:id
PATCH /api/financeiro/contas-a-receber/:id
PATCH /api/financeiro/contas-a-receber/:id/receber
PATCH /api/financeiro/contas-a-receber/:id/cancelar
```

## Fiscal/MEI

```text
GET /api/fiscal/resumo?mes=7&ano=2026
```

### Obrigações MEI

```text
GET   /api/fiscal/obrigacoes
POST  /api/fiscal/obrigacoes
GET   /api/fiscal/obrigacoes/:id
PATCH /api/fiscal/obrigacoes/:id
PATCH /api/fiscal/obrigacoes/:id/pagar
```

### Notas fiscais

```text
GET   /api/fiscal/notas-fiscais
POST  /api/fiscal/notas-fiscais
GET   /api/fiscal/notas-fiscais/:id
PATCH /api/fiscal/notas-fiscais/:id
PATCH /api/fiscal/notas-fiscais/:id/cancelar
```

## Suporte

```text
GET   /api/suporte/chamados
POST  /api/suporte/chamados
GET   /api/suporte/chamados/:id
PATCH /api/suporte/chamados/:id
PATCH /api/suporte/chamados/:id/status
POST  /api/suporte/chamados/:id/mensagens
```

## Tarefas

```text
GET   /api/tarefas
POST  /api/tarefas
GET   /api/tarefas/:id
PATCH /api/tarefas/:id
PATCH /api/tarefas/:id/status
PATCH /api/tarefas/:id/atribuir
```

## Riscos

```text
GET   /api/riscos
POST  /api/riscos
GET   /api/riscos/:id
PATCH /api/riscos/:id
PATCH /api/riscos/:id/nivel
PATCH /api/riscos/:id/fechar
```

## Decisões

```text
GET   /api/decisoes
POST  /api/decisoes
GET   /api/decisoes/:id
PATCH /api/decisoes/:id
PATCH /api/decisoes/:id/marcar-revisao
```

## Base de conhecimento

```text
GET   /api/base-conhecimento/artigos
POST  /api/base-conhecimento/artigos
GET   /api/base-conhecimento/artigos/:id
PATCH /api/base-conhecimento/artigos/:id
PATCH /api/base-conhecimento/artigos/:id/publicar
PATCH /api/base-conhecimento/artigos/:id/arquivar
```

## Auditoria

```text
GET /api/auditoria
GET /api/auditoria/:id
GET /api/auditoria/entidade/:entityType/:entityId
```

Filtros:

```text
periodoInicio
periodoFim
actorUserId
action
module
entityType
entityId
status
severity
requestId
page
perPage
```

## Dashboard

```text
GET /api/dashboard/overview
```

Retorna:

```text
indicadores financeiros
alertas
serviços vencendo
contas vencendo
riscos críticos
tarefas atrasadas
chamados abertos
obrigações MEI pendentes
```

## Relatórios

```text
GET /api/relatorios/financeiro/mensal
GET /api/relatorios/infraestrutura/custos
GET /api/relatorios/operacional/resumo
GET /api/relatorios/fiscal/mensal
```

## Health

```text
GET /api/health
GET /api/health/db
```

## Status HTTP

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
500 Internal Server Error
```

## Regra de versionamento futuro

No MVP usar:

```text
/api
```

Quando necessário, migrar para:

```text
/api/v1
```
