# Telas e Fluxos

## Objetivo

Definir as telas principais do ERP NossoZelo e os fluxos operacionais esperados para a primeira versão.

## Estrutura geral de navegação

O ERP deve possuir layout administrativo com menu lateral.

Menu sugerido:

- Dashboard
- Financeiro
  - Lançamentos
  - Contas a pagar
  - Contas a receber
  - Categorias
- Serviços Contratados
- Fiscal/MEI
  - Obrigações
  - Notas fiscais
- Marketplace
  - Clientes
  - Prestadores
  - Assinaturas
- Suporte
- Tarefas
- Relatórios
- Auditoria
- Configurações

## 1. Dashboard

### Objetivo

Apresentar visão rápida da empresa.

### Componentes

Cards principais:

- receita do mês;
- despesas do mês;
- resultado do mês;
- saldo previsto;
- contas vencendo;
- contas atrasadas;
- serviços críticos;
- assinaturas ativas;
- assinaturas atrasadas;
- chamados abertos;
- obrigações MEI pendentes;
- tarefas urgentes.

### Listas rápidas

- próximas contas a pagar;
- serviços próximos da renovação;
- chamados críticos;
- obrigações fiscais próximas;
- tarefas atrasadas.

## 2. Financeiro — Lançamentos

### Tela de listagem

Campos visíveis:

- data;
- tipo;
- descrição;
- categoria;
- valor bruto;
- valor líquido;
- status;
- origem.

Filtros:

- mês;
- tipo;
- categoria;
- status;
- origem;
- período.

Ações:

- novo lançamento;
- editar;
- marcar como pago/recebido;
- anexar comprovante;
- excluir logicamente.

### Formulário

Campos:

- tipo;
- descrição;
- categoria;
- valor bruto;
- taxas;
- valor líquido;
- moeda;
- data de competência;
- data de vencimento;
- data de pagamento;
- status;
- forma de pagamento;
- observações.

## 3. Contas a pagar

### Fluxo

1. Usuário cria conta a pagar.
2. Define vencimento.
3. Define categoria.
4. Define se é recorrente.
5. ERP exibe no dashboard quando estiver próxima do vencimento.
6. Usuário marca como paga.
7. ERP gera ou atualiza lançamento financeiro.

## 4. Contas a receber

### Fluxo

1. Usuário cria conta a receber.
2. Relaciona a cliente, prestador ou assinatura.
3. Define vencimento.
4. Ao receber, registra valor recebido, taxa e forma de pagamento.
5. ERP calcula valor líquido.
6. ERP atualiza relatórios.

## 5. Serviços Contratados

### Tela de listagem

Campos visíveis:

- nome;
- fornecedor;
- categoria;
- ambiente;
- criticidade;
- status;
- valor estimado;
- próxima renovação.

Filtros:

- categoria;
- ambiente;
- criticidade;
- status;
- fornecedor;
- serviços pagos;
- serviços críticos.

Ações:

- novo serviço;
- editar;
- registrar cobrança;
- gerar conta a pagar;
- anexar fatura;
- cancelar serviço;
- marcar como substituído.

### Formulário

Campos:

- nome;
- fornecedor;
- categoria;
- descrição;
- ambiente;
- criticidade;
- status;
- URL do painel;
- URL de suporte;
- plano;
- moeda;
- valor estimado;
- valor da última cobrança;
- periodicidade;
- data de início;
- data de renovação;
- método de pagamento;
- responsável;
- possui credenciais;
- local das credenciais;
- última rotação de credenciais;
- observações.

### Fluxo de controle de serviço

1. Cadastrar serviço contratado.
2. Definir custo estimado.
3. Definir periodicidade.
4. Definir criticidade.
5. Se for recorrente, gerar conta a pagar prevista.
6. Quando a cobrança chegar, registrar valor real.
7. Comparar custo previsto com custo real.
8. Exibir alertas no dashboard.

## 6. Fiscal/MEI — Obrigações

### Tela

Lista de obrigações:

- DAS mensal;
- declaração anual;
- outras obrigações.

Campos:

- tipo;
- mês/ano;
- valor;
- vencimento;
- status;
- comprovante.

### Fluxo DAS

1. ERP cria obrigação mensal do DAS.
2. Usuário registra valor e vencimento.
3. Dashboard alerta vencimento.
4. Usuário paga externamente.
5. Usuário marca como pago no ERP.
6. Usuário anexa comprovante.

## 7. Notas fiscais

### Tela

Lista de notas fiscais registradas.

Campos:

- número;
- tomador;
- valor;
- data de emissão;
- status.

### Fluxo

1. Nota é emitida manualmente no portal oficial.
2. Usuário cadastra a nota no ERP.
3. Anexa PDF/XML.
4. ERP vincula a receita, se necessário.

## 8. Marketplace — Clientes e prestadores

### Objetivo

Permitir que a empresa visualize a operação do NossoZelo a partir do ERP.

### Telas

- lista de clientes;
- detalhe do cliente;
- lista de prestadores;
- detalhe do prestador.

### Dados importantes

- status de cadastro;
- status de assinatura;
- cidade/estado;
- histórico de suporte;
- pendências;
- observações internas.

## 9. Assinaturas

### Tela

Lista de assinaturas.

Campos:

- prestador;
- plano;
- status;
- vencimento;
- valor;
- gateway;
- última atualização.

Filtros:

- ativas;
- pendentes;
- atrasadas;
- canceladas;
- por plano;
- por período.

## 10. Suporte

### Tela de chamados

Campos:

- título;
- tipo;
- prioridade;
- status;
- usuário relacionado;
- responsável;
- data de abertura.

### Fluxo

1. Criar chamado.
2. Relacionar a usuário/prestador.
3. Definir prioridade.
4. Registrar interações.
5. Resolver.
6. Registrar solução.

## 11. Tarefas

### Tela

Kanban ou lista simples.

Colunas sugeridas:

- pendente;
- em andamento;
- aguardando;
- concluída;
- cancelada.

## 12. Auditoria

### Tela

Lista de ações administrativas.

Campos:

- data;
- usuário;
- ação;
- entidade;
- motivo;
- IP.

Filtros:

- usuário;
- ação;
- entidade;
- período.
