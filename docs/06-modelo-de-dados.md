# Modelo de Dados

## Objetivo

Este documento define o modelo de dados inicial do ERP NossoZelo.

O modelo deve ser simples o suficiente para o MVP, mas estruturado para suportar pelo menos 2 anos de operação.

## Convenções

- Todas as tabelas do ERP devem usar prefixo `erp_`.
- Campos de data devem usar padrão consistente.
- Registros críticos devem ter `criado_em` e `atualizado_em`.
- Registros sensíveis devem suportar exclusão lógica com `excluido_em`.
- Valores monetários devem usar decimal com precisão adequada ou centavos inteiros.

## Tabelas principais

### erp_empresas

Representa a empresa operadora do NossoZelo.

Campos sugeridos:

- id;
- razao_social;
- nome_fantasia;
- cnpj;
- tipo_empresa;
- regime_tributario;
- data_abertura;
- email_principal;
- telefone_principal;
- status;
- criado_em;
- atualizado_em.

### erp_categorias_financeiras

Categorias para receitas e despesas.

Campos:

- id;
- nome;
- tipo;
- descricao;
- ativo;
- criado_em;
- atualizado_em.

Tipos:

- receita;
- despesa;
- ambos.

### erp_lancamentos_financeiros

Registra movimentações financeiras.

Campos:

- id;
- empresa_id;
- tipo;
- categoria_id;
- descricao;
- valor_bruto;
- valor_taxas;
- valor_liquido;
- moeda;
- cotacao;
- data_competencia;
- data_vencimento;
- data_pagamento;
- status;
- forma_pagamento;
- origem;
- referencia_tipo;
- referencia_id;
- observacoes;
- criado_em;
- atualizado_em;
- excluido_em.

Status:

- pendente;
- pago;
- recebido;
- vencido;
- cancelado.

### erp_contas_a_pagar

Contas futuras ou recorrentes a pagar.

Campos:

- id;
- empresa_id;
- categoria_id;
- servico_contratado_id;
- descricao;
- valor_previsto;
- valor_pago;
- moeda;
- data_vencimento;
- data_pagamento;
- recorrente;
- periodicidade;
- status;
- comprovante_anexo_id;
- observacoes;
- criado_em;
- atualizado_em.

### erp_contas_a_receber

Contas futuras ou recorrentes a receber.

Campos:

- id;
- empresa_id;
- categoria_id;
- cliente_id;
- prestador_id;
- assinatura_id;
- descricao;
- valor_previsto;
- valor_recebido;
- valor_taxas;
- valor_liquido;
- data_vencimento;
- data_recebimento;
- status;
- forma_pagamento;
- gateway;
- gateway_referencia;
- criado_em;
- atualizado_em.

### erp_servicos_contratados

Controla serviços externos usados pela empresa.

Campos:

- id;
- empresa_id;
- nome;
- fornecedor;
- categoria;
- descricao;
- ambiente;
- criticidade;
- status;
- url_painel;
- url_suporte;
- plano;
- moeda;
- valor_estimado;
- valor_ultima_cobranca;
- periodicidade;
- data_inicio;
- data_renovacao;
- data_cancelamento;
- metodo_pagamento;
- responsavel_interno;
- possui_credenciais;
- local_credenciais;
- ultima_rotacao_credenciais;
- observacoes;
- criado_em;
- atualizado_em;
- excluido_em.

### erp_obrigacoes_fiscais

Controla DAS, declarações e outras obrigações.

Campos:

- id;
- empresa_id;
- tipo;
- ano;
- mes;
- descricao;
- valor;
- data_vencimento;
- data_pagamento;
- status;
- comprovante_anexo_id;
- observacoes;
- criado_em;
- atualizado_em.

Tipos:

- DAS;
- DASN_SIMEI;
- NFS_E;
- outro.

### erp_notas_fiscais

Registra notas fiscais emitidas manualmente.

Campos:

- id;
- empresa_id;
- numero;
- serie;
- data_emissao;
- data_competencia;
- tomador_nome;
- tomador_documento;
- descricao_servico;
- valor_bruto;
- status;
- link_externo;
- pdf_anexo_id;
- xml_anexo_id;
- observacoes;
- criado_em;
- atualizado_em.

### erp_chamados

Centraliza suporte.

Campos:

- id;
- titulo;
- descricao;
- tipo;
- prioridade;
- status;
- usuario_id;
- prestador_id;
- assinatura_id;
- responsavel_id;
- data_abertura;
- data_fechamento;
- solucao;
- criado_em;
- atualizado_em.

### erp_chamado_interacoes

Histórico do chamado.

Campos:

- id;
- chamado_id;
- autor_id;
- tipo_autor;
- mensagem;
- interno;
- criado_em.

### erp_tarefas

Controle de tarefas internas.

Campos:

- id;
- titulo;
- descricao;
- tipo;
- prioridade;
- status;
- modulo;
- responsavel_id;
- data_limite;
- data_conclusao;
- criado_em;
- atualizado_em.

### erp_anexos

Controla arquivos anexados.

Campos:

- id;
- nome_original;
- nome_armazenado;
- bucket;
- object_key;
- mime_type;
- tamanho_bytes;
- publico;
- referencia_tipo;
- referencia_id;
- criado_por;
- criado_em;
- excluido_em.

### erp_auditoria

Registra ações administrativas.

Campos:

- id;
- usuario_id;
- acao;
- entidade_tipo;
- entidade_id;
- dados_anteriores;
- dados_novos;
- motivo;
- ip;
- user_agent;
- criado_em.

## Relacionamentos importantes

- `erp_contas_a_pagar` pode referenciar `erp_servicos_contratados`.
- `erp_lancamentos_financeiros` pode referenciar contas, assinaturas, serviços ou notas.
- `erp_chamados` pode referenciar usuários e prestadores do marketplace.
- `erp_notas_fiscais` pode gerar lançamento financeiro.
- `erp_obrigacoes_fiscais` pode gerar conta a pagar.
- `erp_servicos_contratados` pode gerar contas recorrentes.
- `erp_anexos` pode ser usado por notas, comprovantes, serviços e chamados.

## Dados do marketplace

O ERP deve evitar duplicar dados que já existem no NossoZelo.

Sempre que possível, deve referenciar:

- usuários;
- prestadores;
- assinaturas;
- planos;
- pagamentos;
- logs.

## Observação

Este modelo é inicial. Antes da implementação, deve ser transformado em schema Prisma com migrations testadas em banco limpo.
