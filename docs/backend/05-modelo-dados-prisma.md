# Modelo de Dados Inicial — Prisma/MySQL

## Objetivo

Definir o modelo inicial de dados do backend do ERP NossoZelo.

O modelo deve atender:

- uso local/Electron;
- futura operação online;
- auditoria total;
- soft delete;
- rastreabilidade;
- controle financeiro;
- controle fiscal;
- controle de serviços contratados;
- suporte e tarefas.

## Regras gerais para todas as tabelas críticas

Tabelas críticas devem conter:

```text
id
created_at
updated_at
deleted_at
created_by
updated_by
deleted_by
```

Para preparar sincronização futura:

```text
sync_status
last_synced_at
origin_device_id
version
```

## Enums principais

```prisma
enum AppMode {
  local
  desktop
  online
}

enum AuditStatus {
  SUCCESS
  FAILED
  DENIED
}

enum AuditSeverity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

enum StatusGeral {
  ativo
  inativo
  pendente
  cancelado
  arquivado
}

enum Criticidade {
  baixa
  media
  alta
  critica
}

enum Moeda {
  BRL
  USD
  EUR
}

enum TipoLancamento {
  receita
  despesa
  transferencia
  ajuste
}

enum StatusFinanceiro {
  previsto
  pendente
  pago
  recebido
  atrasado
  cancelado
}
```

## Usuários internos

### `erp_users`

Campos:

```text
id
name
email
password_hash
status
last_login_at
created_at
updated_at
deleted_at
```

Regras:

- e-mail único;
- senha sempre com hash;
- nunca retornar `password_hash` na API;
- desativar usuário em vez de apagar.

### `erp_roles`

Campos:

```text
id
name
description
is_system
created_at
updated_at
```

Perfis iniciais:

```text
ADMIN
FINANCEIRO
OPERACAO
SUPORTE
LEITURA
```

### `erp_permissions`

Campos:

```text
id
key
description
module
created_at
updated_at
```

### `erp_user_roles`

Campos:

```text
user_id
role_id
created_at
created_by
```

### `erp_role_permissions`

Campos:

```text
role_id
permission_id
created_at
created_by
```

## Auditoria

### `erp_audit_events`

Campos:

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

Índices:

```text
actor_user_id
request_id
module
entity_type + entity_id
created_at
status
severity
```

## Fornecedores

### `erp_fornecedores`

Campos:

```text
id
nome
categoria
site
email_suporte
telefone
contato_responsavel
documento
observacoes
status
created_at
updated_at
deleted_at
```

Exemplos:

- AWS;
- Render;
- Vercel;
- Railway;
- Registro.br;
- Cloudflare;
- Asaas;
- Resend;
- contador.

## Serviços contratados

### `erp_servicos_contratados`

Campos:

```text
id
fornecedor_id
nome
categoria
ambiente
criticidade
status
plano
custo_previsto
moeda
ciclo_cobranca
proxima_cobranca_em
renovacao_em
url_admin
responsavel_interno_id
observacoes
created_at
updated_at
deleted_at
```

Categorias sugeridas:

```text
infraestrutura
banco_de_dados
armazenamento
dominio
dns
pagamentos
email
monitoramento
ferramenta_dev
ferramenta_ia
contabilidade
juridico
outro
```

### `erp_servico_cobrancas`

Campos:

```text
id
servico_id
competencia
valor_previsto
valor_real
moeda
vencimento_em
pago_em
status
forma_pagamento
conta_a_pagar_id
observacoes
created_at
updated_at
```

### `erp_credenciais_referencias`

Campos:

```text
id
servico_id
tipo_acesso
email_conta
local_seguro_referencia
responsavel_id
possui_2fa
metodo_2fa
ultima_rotacao_em
proxima_revisao_em
criticidade
observacoes
created_at
updated_at
```

Regra obrigatória:

```text
Nunca salvar senha, token, secret ou access key.
```

## Financeiro

### `erp_categorias_financeiras`

Campos:

```text
id
nome
tipo
parent_id
status
created_at
updated_at
```

### `erp_lancamentos_financeiros`

Campos:

```text
id
tipo
categoria_id
descricao
valor
moeda
data_competencia
data_pagamento
status
forma_pagamento
origem_modulo
origem_entidade_id
observacoes
created_at
updated_at
deleted_at
```

### `erp_contas_a_pagar`

Campos:

```text
id
fornecedor_id
servico_id
categoria_id
descricao
valor_previsto
valor_pago
moeda
vencimento_em
pago_em
status
recorrente
ciclo_recorrencia
lancamento_id
observacoes
created_at
updated_at
deleted_at
```

### `erp_contas_a_receber`

Campos:

```text
id
origem_modulo
origem_entidade_id
descricao
valor_previsto
valor_recebido
moeda
vencimento_em
recebido_em
status
forma_pagamento
lancamento_id
observacoes
created_at
updated_at
deleted_at
```

## Fiscal/MEI

### `erp_obrigacoes_mei`

Campos:

```text
id
tipo
competencia
valor
vencimento_em
pago_em
status
comprovante_anexo_id
observacoes
created_at
updated_at
```

Tipos:

```text
DAS
DASN_SIMEI
OUTRA
```

### `erp_notas_fiscais`

Campos:

```text
id
numero
serie
tomador_nome
tomador_documento
descricao_servico
valor_bruto
data_emissao
data_competencia
status
pdf_anexo_id
xml_anexo_id
observacoes
created_at
updated_at
```

## Suporte

### `erp_chamados`

Campos:

```text
id
titulo
descricao
tipo
prioridade
status
responsavel_id
usuario_relacionado
origem_modulo
origem_entidade_id
aberto_em
fechado_em
created_at
updated_at
```

### `erp_chamado_mensagens`

Campos:

```text
id
chamado_id
autor_id
mensagem
created_at
```

## Tarefas

### `erp_tarefas`

Campos:

```text
id
titulo
descricao
tipo
prioridade
status
responsavel_id
prazo_em
concluida_em
origem_modulo
origem_entidade_id
created_at
updated_at
```

## Riscos

### `erp_riscos`

Campos:

```text
id
titulo
descricao
categoria
probabilidade
impacto
nivel
status
plano_mitigacao
responsavel_id
identificado_em
revisao_em
created_at
updated_at
```

## Decisões

### `erp_decisoes`

Campos:

```text
id
titulo
contexto
decisao
alternativas
motivo
impacto_esperado
risco_associado_id
responsavel_id
data_decisao
data_revisao
status
created_at
updated_at
```

## Base de conhecimento

### `erp_artigos_conhecimento`

Campos:

```text
id
titulo
categoria
conteudo
status
responsavel_id
publicado_em
revisao_em
created_at
updated_at
deleted_at
```

## Anexos

### `erp_anexos`

Campos:

```text
id
nome_original
mime_type
tamanho_bytes
storage_provider
bucket
object_key
visibilidade
checksum
origem_modulo
origem_entidade_id
enviado_por
created_at
```

Visibilidade:

```text
privado
publico
interno
```

## Fechamento mensal

### `erp_fechamentos_mensais`

Campos:

```text
id
mes
ano
status
receita_bruta
receita_liquida
despesas_total
resultado
saldo_inicial
saldo_final
resumo_financeiro
resumo_fiscal
resumo_operacional
pendencias_proximo_mes
fechado_por
fechado_em
created_at
updated_at
```

## Configurações

### `erp_configuracoes`

Campos:

```text
id
key
value
description
updated_by
updated_at
```

Valores sensíveis não devem ser armazenados aqui.

## Seeds iniciais

O seed inicial deve criar:

- usuário admin inicial;
- perfis;
- permissões;
- categorias financeiras;
- fornecedores padrão;
- serviços contratados padrão.

Fornecedores padrão:

```text
AWS
Render
Vercel
Railway
Registro.br
Cloudflare
Asaas
Resend
GitHub
```

## Observação

Este documento define o modelo conceitual. O arquivo `prisma/schema.prisma` deve ser implementado a partir dele na fase de código.
