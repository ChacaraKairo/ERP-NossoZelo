# Auditoria Total do ERP NossoZelo

## Objetivo

O ERP NossoZelo deve ser totalmente auditável.

Isso significa que qualquer ação relevante para a empresa precisa deixar registro técnico suficiente para reconstruir o que aconteceu.

A auditoria não é apenas log. Ela é parte da regra de negócio.

## Perguntas que a auditoria deve responder

Para qualquer ação sensível, o sistema deve responder:

```text
Quem fez?
Quando fez?
De onde fez?
Em qual ambiente?
Qual módulo foi afetado?
Qual entidade foi afetada?
Qual era o valor antes?
Qual ficou depois?
Qual foi a ação?
A ação teve sucesso ou falhou?
Qual foi o motivo informado?
Qual request originou a ação?
```

## Tipos de auditoria

### 1. Auditoria de autenticação

Eventos:

```text
AUTH_LOGIN_SUCCESS
AUTH_LOGIN_FAILED
AUTH_LOGOUT
AUTH_PASSWORD_CHANGED
AUTH_SESSION_EXPIRED
AUTH_PERMISSION_DENIED
```

### 2. Auditoria de dados

Eventos:

```text
CREATED
UPDATED
DELETED
RESTORED
STATUS_CHANGED
```

Aplicável a:

- usuários internos;
- fornecedores;
- serviços contratados;
- cobranças;
- lançamentos financeiros;
- contas a pagar;
- contas a receber;
- obrigações MEI;
- notas fiscais;
- chamados;
- tarefas;
- riscos;
- decisões;
- artigos internos.

### 3. Auditoria financeira

Eventos:

```text
FINANCEIRO_LANCAMENTO_CREATED
FINANCEIRO_LANCAMENTO_UPDATED
CONTA_A_PAGAR_CREATED
CONTA_A_PAGAR_PAID
CONTA_A_PAGAR_CANCELLED
CONTA_A_RECEBER_CREATED
CONTA_A_RECEBER_RECEIVED
CONTA_A_RECEBER_CANCELLED
FECHAMENTO_MENSAL_CREATED
FECHAMENTO_MENSAL_CLOSED
FECHAMENTO_MENSAL_REOPENED
```

### 4. Auditoria fiscal

Eventos:

```text
OBRIGACAO_MEI_CREATED
OBRIGACAO_MEI_PAID
OBRIGACAO_MEI_REOPENED
NOTA_FISCAL_CREATED
NOTA_FISCAL_UPDATED
NOTA_FISCAL_CANCELLED
```

### 5. Auditoria de segurança

Eventos:

```text
USER_CREATED
USER_UPDATED
USER_DEACTIVATED
ROLE_ASSIGNED
ROLE_REMOVED
PERMISSION_DENIED
CREDENTIAL_REFERENCE_CREATED
CREDENTIAL_REFERENCE_ROTATED
CREDENTIAL_REFERENCE_VIEWED
```

### 6. Auditoria técnica

Eventos:

```text
SYSTEM_STARTED
SYSTEM_STOPPED
DATABASE_CONNECTED
DATABASE_CONNECTION_FAILED
BACKUP_CREATED
BACKUP_RESTORED
CONFIGURATION_CHANGED
```

## Tabela principal

Nome sugerido:

```text
erp_audit_events
```

## Campos obrigatórios

```text
id
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

## Campos explicados

### `request_id`

Identificador único da requisição.

Permite ligar logs técnicos e auditoria funcional.

### `actor_user_id`

Usuário interno que executou a ação.

Pode ser nulo para eventos de sistema.

### `action`

Nome da ação auditada.

Exemplo:

```text
SERVICO_CONTRATADO_UPDATED
```

### `module`

Módulo responsável.

Exemplo:

```text
servicos-contratados
```

### `entity_type`

Tipo da entidade afetada.

Exemplo:

```text
erp_servicos_contratados
```

### `entity_id`

ID do registro afetado.

### `status`

Valores:

```text
SUCCESS
FAILED
DENIED
```

### `severity`

Valores:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

### `before_data`

Estado anterior do registro.

Deve ser JSON.

### `after_data`

Estado posterior do registro.

Deve ser JSON.

### `metadata`

Dados adicionais da ação.

Exemplo:

```json
{
  "source": "api",
  "route": "/servicos-contratados/123",
  "method": "PATCH"
}
```

### `reason`

Motivo informado pelo usuário, quando a ação exigir justificativa.

Exemplo:

```text
Cancelamos este serviço porque o custo subiu e não estamos usando.
```

### `app_mode`

Valores:

```text
local
desktop
online
```

### `device_id`

Identificador da instalação local, útil para Electron.

## Dados proibidos na auditoria

Nunca salvar:

```text
senha
token
JWT
AWS_SECRET_ACCESS_KEY
ASAAS_API_KEY
UPSTASH_TOKEN
recovery code
código 2FA
segredo de sessão
cookie completo
cartão de crédito
```

A função `redactSensitiveData` deve remover esses valores antes de gravar.

## Função `redactSensitiveData`

Arquivo:

```text
common/utils/redact-sensitive-data.ts
```

Responsabilidade:

Remover ou mascarar campos sensíveis.

Campos a mascarar:

```text
password
senha
token
secret
apiKey
api_key
accessKey
secretKey
authorization
cookie
set-cookie
```

Valor substituto:

```text
[REDACTED]
```

## Interceptor de auditoria

Arquivo:

```text
common/interceptors/audit.interceptor.ts
```

Responsabilidade:

- ler metadados do decorator `@AuditAction`;
- capturar usuário atual;
- capturar contexto da requisição;
- executar auditoria depois da resposta;
- registrar falhas também.

## Decorator `@AuditAction`

Arquivo:

```text
common/decorators/audit-action.decorator.ts
```

Uso:

```ts
@AuditAction({
  action: 'SERVICO_CONTRATADO_UPDATED',
  module: 'servicos-contratados',
  entity: 'erp_servicos_contratados',
  severity: 'MEDIUM',
})
```

## Auditoria manual

Nem tudo será bem capturado por interceptor. Em operações complexas, o service deve chamar auditoria diretamente.

Exemplo:

```ts
await this.auditService.recordChange({
  actor,
  action: 'CONTA_A_PAGAR_PAID',
  module: 'financeiro',
  entityType: 'erp_contas_a_pagar',
  entityId: conta.id,
  beforeData: before,
  afterData: after,
  reason: dto.reason,
});
```

## Ações que exigem justificativa

As seguintes ações devem pedir `reason`:

```text
desativar usuário
cancelar serviço contratado
cancelar conta financeira
reabrir fechamento mensal
cancelar nota fiscal
alterar permissão
excluir/desativar fornecedor
marcar risco como aceito
```

## Política de retenção

Auditoria não deve ser apagada no uso normal.

Retenção recomendada:

```text
mínimo: 5 anos
preferencial: indefinida enquanto a empresa operar
```

## Soft delete

Registros importantes não devem ser apagados fisicamente.

Usar:

```text
deleted_at
deleted_by
```

E registrar auditoria.

## Consultas de auditoria

Filtros obrigatórios:

```text
período
usuário
ação
módulo
entidade
status
severidade
request_id
```

## Tela de auditoria

A tela `/auditoria` deve exibir:

- data/hora;
- usuário;
- ação;
- módulo;
- entidade;
- status;
- severidade;
- IP/dispositivo;
- botão para ver detalhes;
- comparação antes/depois.

## Regra final

Se uma ação muda dado financeiro, fiscal, permissão, status de serviço, usuário interno ou fechamento mensal, ela deve ser auditada.
