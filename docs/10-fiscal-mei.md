# Fiscal e MEI

## Objetivo

O módulo Fiscal/MEI tem como objetivo ajudar a empresa a acompanhar suas obrigações fiscais básicas enquanto estiver enquadrada como MEI.

O ERP não substitui contador nem deve tomar decisões tributárias automaticamente. Ele deve servir como ferramenta de organização, registro e alerta.

## Obrigações controladas

O ERP deve controlar:

- DAS mensal;
- declaração anual DASN-SIMEI;
- notas fiscais emitidas;
- comprovantes de pagamento;
- faturamento acumulado;
- alertas de vencimento;
- observações fiscais.

## DAS mensal

### Campos

- ano;
- mês;
- valor;
- data de vencimento;
- data de pagamento;
- status;
- comprovante;
- observações.

### Status

- pendente;
- pago;
- atrasado;
- cancelado;
- não aplicável.

### Fluxo

1. Criar obrigação mensal.
2. Registrar vencimento e valor.
3. Exibir alerta antes do vencimento.
4. Após pagamento, marcar como pago.
5. Anexar comprovante.
6. Gerar lançamento financeiro de despesa.

## Declaração anual

### Campos

- ano base;
- data limite;
- data de envio;
- status;
- recibo;
- faturamento declarado;
- observações.

### Status

- pendente;
- enviada;
- atrasada;
- retificada.

## Notas fiscais

No MVP, o ERP apenas registra notas emitidas manualmente.

### Campos

- número;
- série;
- data de emissão;
- data de competência;
- tomador;
- documento do tomador;
- descrição do serviço;
- valor bruto;
- status;
- link externo;
- PDF;
- XML;
- observações.

### Status

- pendente de emissão;
- emitida;
- cancelada;
- erro;
- não necessária.

## Fluxo de nota fiscal no MVP

1. Responsável emite a NFS-e no portal oficial.
2. Responsável cadastra os dados no ERP.
3. Responsável anexa PDF/XML.
4. ERP vincula a nota ao lançamento financeiro correspondente.
5. ERP inclui a nota em relatórios mensais.

## Limite de faturamento

O ERP deve permitir acompanhar faturamento acumulado do ano.

Alertas sugeridos:

- 50% do limite anual;
- 70% do limite anual;
- 80% do limite anual;
- 90% do limite anual;
- 100% do limite anual.

Esses alertas são apenas administrativos. A decisão sobre desenquadramento, regime tributário ou migração para ME deve ser feita com apoio contábil.

## Relatórios fiscais

Relatórios mínimos:

- DAS pagos por ano;
- DAS pendentes;
- notas fiscais por mês;
- faturamento mensal;
- faturamento anual acumulado;
- obrigações fiscais pendentes.

## Fora do MVP

Não implementar na primeira versão:

- emissão automática de NFS-e;
- integração fiscal automática;
- apuração tributária completa;
- substituição de contador;
- transmissão automática de declarações.
