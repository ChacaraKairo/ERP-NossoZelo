# Regras de Negócio

## 1. Regras gerais

1. Todo registro financeiro deve possuir tipo: receita ou despesa.
2. Todo lançamento financeiro deve possuir categoria.
3. Todo valor deve ser armazenado com precisão monetária adequada.
4. Registros financeiros, fiscais e administrativos devem preferir exclusão lógica.
5. Ações administrativas críticas devem gerar auditoria.
6. O ERP deve separar dados da empresa de dados pessoais do fundador.
7. Nenhum segredo, senha, token ou chave de API deve ser salvo em texto aberto no ERP.
8. O ERP pode registrar a existência de credenciais, mas não deve exibir o valor secreto da credencial.

## 2. Financeiro

### Lançamentos

1. Um lançamento pode ser receita ou despesa.
2. Um lançamento pode estar pendente, pago, recebido, cancelado ou vencido.
3. Lançamentos pagos ou recebidos devem possuir data de pagamento ou recebimento.
4. Lançamentos podem ter comprovante anexado.
5. Um lançamento pode ser recorrente.
6. Lançamentos recorrentes devem gerar previsões futuras.
7. Taxas de pagamento devem ser registradas separadamente ou como campo próprio.
8. Receita líquida deve considerar taxas e descontos.

### Contas a pagar

1. Toda conta a pagar deve ter vencimento.
2. Conta vencida deve aparecer em destaque.
3. Conta paga deve registrar data de pagamento.
4. Conta paga pode ter comprovante.
5. Despesas fixas devem ser marcadas como recorrentes.
6. Serviços contratados devem gerar contas a pagar previstas.

### Contas a receber

1. Toda conta a receber deve ter vencimento.
2. Conta vencida deve aparecer como inadimplente.
3. Conta recebida deve registrar data de recebimento.
4. Conta recebida deve permitir registrar taxa e valor líquido.
5. Contas a receber podem ser vinculadas a assinatura, cliente ou prestador.

## 3. Serviços contratados e infraestrutura

O ERP deve controlar todos os serviços externos contratados pela empresa para operar o NossoZelo.

### Exemplos de serviços

- AWS;
- S3;
- IAM;
- Render;
- Vercel;
- Railway;
- Upstash;
- Cloudflare;
- Registro.br;
- Asaas;
- Resend;
- GitHub;
- ferramentas de IA;
- ferramentas de design;
- ferramentas de monitoramento;
- domínio;
- contador;
- serviços jurídicos;
- outros fornecedores.

### Regras

1. Todo serviço contratado deve possuir nome.
2. Todo serviço contratado deve possuir categoria.
3. Todo serviço contratado deve possuir fornecedor.
4. Todo serviço contratado deve possuir status.
5. Serviços pagos devem possuir custo previsto.
6. Serviços recorrentes devem possuir periodicidade.
7. Serviços com renovação devem possuir data de renovação.
8. Serviços críticos devem ser marcados como críticos.
9. Serviços críticos devem aparecer no dashboard.
10. Serviços com cobrança em dólar devem permitir registrar moeda original e valor convertido.
11. Serviços com cartão de crédito devem permitir registrar cartão ou método de pagamento, sem armazenar dados sensíveis do cartão.
12. Serviços com credenciais devem indicar onde as credenciais estão guardadas, sem armazenar o segredo.
13. Serviços cancelados devem manter histórico.
14. Serviços essenciais para produção devem ter campo de ambiente: produção, staging, desenvolvimento ou todos.
15. Cada serviço contratado pode gerar contas a pagar automaticamente.
16. Cada serviço pode ter anexos, como contrato, nota, recibo ou print da cobrança.

### Status de serviço

- em avaliação;
- ativo;
- trial;
- gratuito;
- pago;
- suspenso;
- cancelado;
- substituído.

### Categorias de serviço

- infraestrutura;
- banco de dados;
- hospedagem;
- armazenamento;
- domínio;
- DNS;
- pagamentos;
- e-mail;
- monitoramento;
- desenvolvimento;
- design;
- IA;
- jurídico;
- contabilidade;
- marketing;
- outros.

### Criticidade

Um serviço pode ter criticidade:

- baixa;
- média;
- alta;
- crítica.

Serviços críticos são aqueles que, se pararem, afetam diretamente o NossoZelo em produção.

Exemplos de serviços críticos:

- backend;
- banco de dados;
- domínio;
- DNS;
- gateway de pagamento;
- armazenamento de documentos;
- e-mail transacional.

## 4. MEI e fiscal

1. O ERP deve controlar o DAS mensal como obrigação fiscal.
2. O ERP deve permitir marcar o DAS como pago.
3. O ERP deve armazenar comprovante de pagamento do DAS.
4. O ERP deve controlar declaração anual.
5. O ERP deve registrar notas fiscais emitidas manualmente.
6. O ERP deve alertar sobre faturamento acumulado.
7. O ERP deve permitir anexar PDF e XML de notas fiscais.
8. O ERP não deve emitir nota fiscal automaticamente no MVP.

## 5. Assinaturas

1. Assinaturas devem possuir status.
2. Assinaturas podem ser vinculadas a prestadores.
3. Assinaturas atrasadas devem aparecer em relatório.
4. Assinaturas canceladas devem manter histórico.
5. O ERP deve permitir registrar observações administrativas sobre assinaturas.
6. O ERP deve diferenciar status interno e status vindo do gateway de pagamento.

## 6. Suporte

1. Todo chamado deve possuir tipo.
2. Todo chamado deve possuir prioridade.
3. Todo chamado deve possuir status.
4. Todo chamado pode ser vinculado a cliente, prestador ou assinatura.
5. Chamados resolvidos devem possuir registro de solução.
6. Chamados não devem ser excluídos fisicamente.

## 7. Tarefas internas

1. Toda tarefa deve possuir título.
2. Toda tarefa deve possuir status.
3. Toda tarefa deve possuir prioridade.
4. Tarefas podem ter prazo.
5. Tarefas podem ser vinculadas a módulo do ERP ou do NossoZelo.
6. Tarefas concluídas devem manter histórico.

## 8. Auditoria

Devem gerar auditoria:

- login administrativo;
- alteração financeira;
- exclusão lógica;
- acesso a documento privado;
- alteração de serviço contratado crítico;
- alteração de obrigação fiscal;
- bloqueio ou liberação de usuário/prestador;
- alteração de assinatura;
- reprocessamento de webhook;
- alteração de permissões.
