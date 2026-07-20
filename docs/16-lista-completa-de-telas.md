# Lista Completa de Telas do ERP NossoZelo

## Objetivo

Este documento lista todas as telas previstas para o ERP NossoZelo, organizadas por módulo, rota sugerida, prioridade, objetivo, principais informações exibidas e ações esperadas.

Ele deve ser usado como checklist de implementação pelo Codex, por agentes de desenvolvimento e por qualquer pessoa responsável por evoluir o ERP.

## Convenções

### Prioridade

- **P0**: obrigatório para MVP interno.
- **P1**: importante para os primeiros meses de operação.
- **P2**: melhoria para crescimento após validação.

### Tipos de tela

- **Listagem**: tabela, filtros e ações.
- **Formulário**: criação ou edição de registros.
- **Detalhe**: visão completa de um registro.
- **Dashboard**: indicadores e resumos.
- **Relatório**: análise consolidada.
- **Configuração**: parâmetros do sistema.

---

# 1. Estrutura base

## 1.1 Login administrativo

- **Rota sugerida**: `/login`
- **Prioridade**: P0
- **Tipo**: Formulário
- **Objetivo**: permitir acesso seguro ao ERP.

### Campos

- e-mail;
- senha.

### Ações

- entrar;
- exibir erro de credenciais inválidas;
- redirecionar usuário autenticado para o dashboard.

### Observações

O ERP não deve permitir acesso sem autenticação. Futuramente pode ter recuperação de senha e autenticação em dois fatores.

## 1.2 Layout administrativo

- **Rota sugerida**: aplicado em todas as rotas privadas
- **Prioridade**: P0
- **Tipo**: Estrutura visual
- **Objetivo**: padronizar navegação interna.

### Componentes

- menu lateral;
- cabeçalho;
- área de conteúdo;
- indicador de usuário logado;
- botão de sair;
- breadcrumbs, se necessário.

### Menu inicial

- Dashboard;
- Financeiro;
- Serviços Contratados;
- Fiscal/MEI;
- Marketplace;
- Suporte;
- Tarefas;
- Relatórios;
- Auditoria;
- Configurações.

---

# 2. Dashboard

## 2.1 Dashboard da empresa

- **Rota sugerida**: `/dashboard`
- **Prioridade**: P0
- **Tipo**: Dashboard
- **Objetivo**: apresentar a saúde da empresa em uma única tela.

### Indicadores principais

- receita do mês;
- despesas do mês;
- resultado do mês;
- saldo previsto;
- contas a pagar em aberto;
- contas a receber em aberto;
- serviços contratados ativos;
- serviços críticos;
- serviços próximos da renovação;
- obrigações MEI pendentes;
- notas fiscais pendentes;
- chamados abertos;
- tarefas urgentes;
- assinaturas ativas do marketplace;
- assinaturas atrasadas.

### Listas rápidas

- próximas contas a pagar;
- próximas contas a receber;
- serviços com renovação próxima;
- obrigações fiscais próximas;
- chamados críticos;
- tarefas atrasadas.

### Ações

- criar lançamento financeiro;
- criar conta a pagar;
- criar serviço contratado;
- criar chamado;
- criar tarefa;
- acessar relatórios.

---

# 3. Financeiro

## 3.1 Visão geral financeira

- **Rota sugerida**: `/financeiro`
- **Prioridade**: P0
- **Tipo**: Dashboard/Resumo
- **Objetivo**: consolidar entradas, saídas e resultado financeiro.

### Informações

- total de receitas no período;
- total de despesas no período;
- resultado líquido;
- contas vencidas;
- contas a vencer;
- receitas por categoria;
- despesas por categoria;
- evolução mensal.

### Ações

- novo lançamento;
- nova conta a pagar;
- nova conta a receber;
- exportar CSV;
- abrir relatório financeiro.

## 3.2 Lançamentos financeiros

- **Rota sugerida**: `/financeiro/lancamentos`
- **Prioridade**: P0
- **Tipo**: Listagem
- **Objetivo**: listar todas as movimentações financeiras registradas.

### Colunas

- data;
- tipo;
- descrição;
- categoria;
- valor bruto;
- taxas;
- valor líquido;
- moeda;
- status;
- origem.

### Filtros

- período;
- mês;
- tipo;
- categoria;
- status;
- forma de pagamento;
- origem.

### Ações

- criar lançamento;
- editar;
- visualizar detalhe;
- marcar como pago/recebido;
- anexar comprovante;
- excluir logicamente.

## 3.3 Novo lançamento financeiro

- **Rota sugerida**: `/financeiro/lancamentos/novo`
- **Prioridade**: P0
- **Tipo**: Formulário
- **Objetivo**: registrar receita ou despesa manual.

### Campos

- tipo: receita ou despesa;
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
- origem;
- observações;
- anexo.

## 3.4 Detalhe do lançamento financeiro

- **Rota sugerida**: `/financeiro/lancamentos/[id]`
- **Prioridade**: P1
- **Tipo**: Detalhe
- **Objetivo**: visualizar um lançamento completo.

### Informações

- dados principais;
- anexos;
- histórico de alterações;
- vínculo com serviço contratado, assinatura, nota fiscal ou conta;
- observações.

## 3.5 Contas a pagar

- **Rota sugerida**: `/financeiro/contas-a-pagar`
- **Prioridade**: P0
- **Tipo**: Listagem
- **Objetivo**: controlar obrigações financeiras da empresa.

### Colunas

- descrição;
- fornecedor;
- categoria;
- valor;
- vencimento;
- recorrência;
- status;
- serviço vinculado.

### Ações

- criar conta;
- editar;
- marcar como paga;
- anexar comprovante;
- gerar lançamento financeiro;
- cancelar.

## 3.6 Nova conta a pagar

- **Rota sugerida**: `/financeiro/contas-a-pagar/nova`
- **Prioridade**: P0
- **Tipo**: Formulário
- **Objetivo**: cadastrar despesa futura ou recorrente.

### Campos

- descrição;
- fornecedor;
- categoria;
- valor previsto;
- moeda;
- vencimento;
- recorrência;
- forma de pagamento;
- serviço contratado vinculado;
- observações.

## 3.7 Contas a receber

- **Rota sugerida**: `/financeiro/contas-a-receber`
- **Prioridade**: P0
- **Tipo**: Listagem
- **Objetivo**: controlar valores que a empresa espera receber.

### Colunas

- descrição;
- cliente/prestador;
- origem;
- valor;
- vencimento;
- status;
- forma de recebimento.

### Ações

- criar conta;
- editar;
- marcar como recebida;
- registrar taxa;
- gerar lançamento financeiro;
- vincular nota fiscal.

## 3.8 Nova conta a receber

- **Rota sugerida**: `/financeiro/contas-a-receber/nova`
- **Prioridade**: P0
- **Tipo**: Formulário
- **Objetivo**: cadastrar valor esperado.

### Campos

- descrição;
- origem;
- cliente ou prestador vinculado;
- assinatura vinculada;
- valor bruto;
- taxa prevista;
- valor líquido previsto;
- vencimento;
- status;
- observações.

## 3.9 Categorias financeiras

- **Rota sugerida**: `/financeiro/categorias`
- **Prioridade**: P1
- **Tipo**: Listagem/Formulário
- **Objetivo**: controlar categorias de receita e despesa.

### Categorias iniciais de receita

- Assinaturas;
- Comissões;
- Serviços avulsos;
- Reembolsos;
- Outros.

### Categorias iniciais de despesa

- Infraestrutura;
- Domínio;
- Banco de dados;
- Servidor;
- Armazenamento;
- E-mail;
- Marketing;
- Ferramentas;
- Impostos;
- Contabilidade;
- Taxas de pagamento;
- Jurídico;
- Suporte;
- Outros.

---

# 4. Serviços Contratados e Infraestrutura

## 4.1 Visão geral de serviços contratados

- **Rota sugerida**: `/servicos-contratados`
- **Prioridade**: P0
- **Tipo**: Listagem/Dashboard
- **Objetivo**: controlar todos os serviços contratados pela empresa.

### Exemplos de serviços

- AWS;
- S3;
- IAM;
- Render;
- Vercel;
- Railway;
- Upstash;
- Registro.br;
- Cloudflare;
- Asaas;
- Resend;
- GitHub;
- ferramentas de IA;
- contador;
- ferramentas de design;
- ferramentas de marketing.

### Colunas

- nome;
- fornecedor;
- categoria;
- ambiente;
- criticidade;
- status;
- plano;
- moeda;
- custo previsto;
- última cobrança;
- próxima renovação;
- responsável.

### Filtros

- fornecedor;
- categoria;
- ambiente;
- criticidade;
- status;
- moeda;
- pago/gratuito;
- renovação próxima.

### Ações

- novo serviço;
- editar;
- visualizar detalhe;
- registrar cobrança;
- gerar conta a pagar;
- anexar fatura;
- marcar como cancelado;
- marcar como substituído.

## 4.2 Novo serviço contratado

- **Rota sugerida**: `/servicos-contratados/novo`
- **Prioridade**: P0
- **Tipo**: Formulário
- **Objetivo**: cadastrar novo serviço contratado.

### Campos

- nome;
- fornecedor;
- categoria;
- descrição;
- ambiente: produção, staging, desenvolvimento, administrativo;
- criticidade: baixa, média, alta, crítica;
- status: ativo, trial, cancelado, suspenso, substituído;
- URL do painel;
- URL de suporte;
- plano contratado;
- moeda;
- valor previsto;
- periodicidade;
- data de início;
- data de renovação;
- forma de pagamento;
- responsável;
- possui credenciais;
- local seguro das credenciais;
- última rotação de credenciais;
- observações.

## 4.3 Detalhe do serviço contratado

- **Rota sugerida**: `/servicos-contratados/[id]`
- **Prioridade**: P0
- **Tipo**: Detalhe
- **Objetivo**: visualizar a situação completa de um serviço.

### Informações

- dados do serviço;
- custo previsto;
- histórico de cobranças;
- faturas anexadas;
- contas a pagar geradas;
- ambiente onde é usado;
- dependências;
- riscos;
- credenciais existentes sem exibir segredos;
- histórico de rotação de credenciais;
- observações administrativas.

### Ações

- editar;
- registrar cobrança;
- gerar conta a pagar;
- anexar fatura;
- registrar incidente;
- cancelar serviço;
- registrar troca/substituição.

## 4.4 Registrar cobrança de serviço

- **Rota sugerida**: `/servicos-contratados/[id]/cobrancas/nova`
- **Prioridade**: P0
- **Tipo**: Formulário
- **Objetivo**: registrar cobrança real recebida de um serviço.

### Campos

- serviço;
- competência;
- data de cobrança;
- valor cobrado;
- moeda;
- taxa/câmbio, se aplicável;
- valor em reais;
- forma de pagamento;
- status;
- fatura/anexo;
- observações.

### Comportamento esperado

Ao registrar uma cobrança, o ERP deve permitir criar ou atualizar uma conta a pagar e um lançamento financeiro.

## 4.5 Calendário de renovações

- **Rota sugerida**: `/servicos-contratados/renovacoes`
- **Prioridade**: P1
- **Tipo**: Relatório/Calendário
- **Objetivo**: visualizar próximos vencimentos, renovações e cobranças.

### Informações

- serviço;
- fornecedor;
- data de renovação;
- valor previsto;
- criticidade;
- responsável;
- status da conta a pagar.

---

# 5. Fiscal e MEI

## 5.1 Visão geral fiscal

- **Rota sugerida**: `/fiscal`
- **Prioridade**: P0
- **Tipo**: Dashboard/Resumo
- **Objetivo**: acompanhar obrigações fiscais básicas da MEI.

### Indicadores

- DAS do mês;
- obrigações pendentes;
- notas emitidas no mês;
- faturamento acumulado;
- alerta de limite MEI;
- notas pendentes de emissão.

## 5.2 Obrigações MEI

- **Rota sugerida**: `/fiscal/obrigacoes`
- **Prioridade**: P0
- **Tipo**: Listagem
- **Objetivo**: controlar DAS, declaração anual e obrigações fiscais.

### Colunas

- tipo;
- mês/ano;
- valor;
- vencimento;
- status;
- data de pagamento;
- comprovante.

### Ações

- nova obrigação;
- marcar como paga;
- anexar comprovante;
- gerar conta a pagar;
- visualizar detalhe.

## 5.3 Nova obrigação MEI

- **Rota sugerida**: `/fiscal/obrigacoes/nova`
- **Prioridade**: P0
- **Tipo**: Formulário
- **Objetivo**: registrar obrigação fiscal manual.

### Campos

- tipo;
- competência;
- valor;
- vencimento;
- status;
- observações.

## 5.4 Notas fiscais

- **Rota sugerida**: `/fiscal/notas-fiscais`
- **Prioridade**: P0
- **Tipo**: Listagem
- **Objetivo**: registrar notas fiscais emitidas manualmente.

### Colunas

- número;
- tomador;
- documento do tomador;
- valor;
- data de emissão;
- competência;
- status;
- receita vinculada.

### Ações

- nova nota;
- editar;
- anexar PDF/XML;
- vincular conta a receber;
- cancelar registro.

## 5.5 Nova nota fiscal

- **Rota sugerida**: `/fiscal/notas-fiscais/nova`
- **Prioridade**: P0
- **Tipo**: Formulário
- **Objetivo**: registrar NFS-e emitida fora do ERP.

### Campos

- número;
- data de emissão;
- competência;
- tomador;
- documento do tomador;
- descrição do serviço;
- valor bruto;
- status;
- link externo;
- PDF;
- XML;
- observações.

---

# 6. Marketplace

## 6.1 Visão geral do marketplace

- **Rota sugerida**: `/marketplace`
- **Prioridade**: P1
- **Tipo**: Dashboard/Resumo
- **Objetivo**: visualizar operação do NossoZelo a partir do ERP.

### Indicadores

- clientes cadastrados;
- prestadores cadastrados;
- prestadores ativos;
- prestadores pendentes;
- prestadores bloqueados;
- assinaturas ativas;
- assinaturas atrasadas;
- cancelamentos;
- chamados relacionados.

## 6.2 Clientes

- **Rota sugerida**: `/marketplace/clientes`
- **Prioridade**: P1
- **Tipo**: Listagem
- **Objetivo**: listar clientes do marketplace.

### Colunas

- nome;
- e-mail;
- telefone;
- cidade;
- status;
- data de cadastro;
- quantidade de chamados.

### Ações

- visualizar detalhe;
- criar chamado;
- registrar observação;
- ver histórico.

## 6.3 Detalhe do cliente

- **Rota sugerida**: `/marketplace/clientes/[id]`
- **Prioridade**: P1
- **Tipo**: Detalhe
- **Objetivo**: ver histórico administrativo do cliente.

### Informações

- dados cadastrais;
- histórico de solicitações;
- chamados;
- observações;
- ações administrativas;
- logs.

## 6.4 Prestadores

- **Rota sugerida**: `/marketplace/prestadores`
- **Prioridade**: P1
- **Tipo**: Listagem
- **Objetivo**: acompanhar prestadores cadastrados no NossoZelo.

### Colunas

- nome;
- tipo de prestador;
- e-mail;
- cidade;
- status de cadastro;
- status da assinatura;
- documentos;
- avaliação média;
- data de cadastro.

### Ações

- visualizar detalhe;
- criar chamado;
- registrar observação;
- ver assinatura;
- ver documentos.

## 6.5 Detalhe do prestador

- **Rota sugerida**: `/marketplace/prestadores/[id]`
- **Prioridade**: P1
- **Tipo**: Detalhe
- **Objetivo**: visualizar situação completa do prestador.

### Informações

- dados cadastrais;
- tipo de serviço;
- documentos;
- status de cadastro;
- assinatura atual;
- pagamentos;
- avaliações;
- chamados;
- bloqueios/liberações;
- observações administrativas.

## 6.6 Assinaturas do marketplace

- **Rota sugerida**: `/marketplace/assinaturas`
- **Prioridade**: P1
- **Tipo**: Listagem
- **Objetivo**: acompanhar monetização recorrente do NossoZelo.

### Colunas

- prestador;
- plano;
- status;
- valor;
- gateway;
- vencimento;
- último pagamento;
- próxima cobrança.

### Ações

- visualizar detalhe;
- registrar observação;
- reprocessar;
- criar chamado;
- vincular conta a receber.

## 6.7 Detalhe da assinatura

- **Rota sugerida**: `/marketplace/assinaturas/[id]`
- **Prioridade**: P1
- **Tipo**: Detalhe
- **Objetivo**: visualizar histórico da assinatura.

### Informações

- prestador;
- plano;
- status;
- histórico de pagamentos;
- eventos/webhooks;
- contas a receber;
- chamados;
- observações administrativas.

---

# 7. Suporte

## 7.1 Chamados

- **Rota sugerida**: `/suporte/chamados`
- **Prioridade**: P0
- **Tipo**: Listagem
- **Objetivo**: centralizar atendimento interno.

### Colunas

- código;
- título;
- tipo;
- prioridade;
- status;
- usuário relacionado;
- responsável;
- abertura;
- última atualização.

### Filtros

- status;
- prioridade;
- tipo;
- responsável;
- usuário;
- período.

### Ações

- novo chamado;
- visualizar;
- alterar status;
- atribuir responsável;
- encerrar.

## 7.2 Novo chamado

- **Rota sugerida**: `/suporte/chamados/novo`
- **Prioridade**: P0
- **Tipo**: Formulário
- **Objetivo**: registrar solicitação, problema ou incidente.

### Campos

- título;
- descrição;
- tipo;
- prioridade;
- usuário relacionado;
- serviço contratado relacionado;
- módulo relacionado;
- responsável;
- anexos.

## 7.3 Detalhe do chamado

- **Rota sugerida**: `/suporte/chamados/[id]`
- **Prioridade**: P0
- **Tipo**: Detalhe
- **Objetivo**: acompanhar resolução do chamado.

### Informações

- dados principais;
- histórico de mensagens;
- anexos;
- alterações de status;
- responsável;
- vínculo com cliente, prestador, serviço ou tarefa.

### Ações

- adicionar comentário;
- alterar status;
- alterar prioridade;
- atribuir responsável;
- anexar arquivo;
- encerrar chamado.

---

# 8. Tarefas internas

## 8.1 Tarefas

- **Rota sugerida**: `/tarefas`
- **Prioridade**: P0
- **Tipo**: Listagem/Kanban simples
- **Objetivo**: organizar demandas internas da empresa.

### Colunas

- título;
- tipo;
- prioridade;
- status;
- responsável;
- prazo;
- módulo;
- origem.

### Ações

- nova tarefa;
- editar;
- alterar status;
- concluir;
- vincular chamado;
- vincular serviço.

## 8.2 Nova tarefa

- **Rota sugerida**: `/tarefas/nova`
- **Prioridade**: P0
- **Tipo**: Formulário
- **Objetivo**: registrar demanda interna.

### Campos

- título;
- descrição;
- tipo;
- prioridade;
- status;
- responsável;
- prazo;
- módulo relacionado;
- chamado relacionado;
- serviço contratado relacionado.

## 8.3 Detalhe da tarefa

- **Rota sugerida**: `/tarefas/[id]`
- **Prioridade**: P1
- **Tipo**: Detalhe
- **Objetivo**: acompanhar execução de uma tarefa.

### Informações

- dados principais;
- comentários;
- histórico de status;
- vínculos;
- anexos.

---

# 9. Relatórios

## 9.1 Central de relatórios

- **Rota sugerida**: `/relatorios`
- **Prioridade**: P1
- **Tipo**: Listagem
- **Objetivo**: concentrar relatórios do ERP.

### Relatórios disponíveis

- financeiro mensal;
- despesas por categoria;
- receitas por categoria;
- serviços contratados;
- obrigações MEI;
- notas fiscais;
- suporte;
- tarefas;
- marketplace.

## 9.2 Relatório financeiro mensal

- **Rota sugerida**: `/relatorios/financeiro-mensal`
- **Prioridade**: P1
- **Tipo**: Relatório
- **Objetivo**: analisar resultado mensal da empresa.

### Informações

- receitas;
- despesas;
- resultado;
- contas abertas;
- contas pagas;
- comparação com meses anteriores.

## 9.3 Relatório de serviços contratados

- **Rota sugerida**: `/relatorios/servicos-contratados`
- **Prioridade**: P1
- **Tipo**: Relatório
- **Objetivo**: analisar custo e criticidade dos serviços.

### Informações

- custo mensal previsto;
- custo real;
- custo por fornecedor;
- custo por categoria;
- serviços críticos;
- serviços em trial;
- serviços próximos da renovação;
- serviços com cobrança em dólar.

## 9.4 Relatório fiscal MEI

- **Rota sugerida**: `/relatorios/fiscal-mei`
- **Prioridade**: P1
- **Tipo**: Relatório
- **Objetivo**: acompanhar obrigações e faturamento.

### Informações

- DAS pagos;
- DAS pendentes;
- notas emitidas;
- faturamento acumulado;
- alertas fiscais.

## 9.5 Relatório de suporte

- **Rota sugerida**: `/relatorios/suporte`
- **Prioridade**: P2
- **Tipo**: Relatório
- **Objetivo**: analisar volume e tipos de chamados.

### Informações

- chamados abertos;
- chamados resolvidos;
- chamados por tipo;
- chamados por prioridade;
- tempo médio de resolução.

---

# 10. Auditoria

## 10.1 Logs de auditoria

- **Rota sugerida**: `/auditoria`
- **Prioridade**: P0
- **Tipo**: Listagem
- **Objetivo**: visualizar ações administrativas relevantes.

### Colunas

- data/hora;
- usuário interno;
- ação;
- entidade;
- entidade ID;
- IP;
- motivo;
- resultado.

### Filtros

- usuário;
- ação;
- entidade;
- período;
- resultado.

## 10.2 Detalhe do log de auditoria

- **Rota sugerida**: `/auditoria/[id]`
- **Prioridade**: P1
- **Tipo**: Detalhe
- **Objetivo**: consultar detalhes de uma ação sensível.

### Informações

- dados do evento;
- antes/depois, quando aplicável;
- usuário responsável;
- entidade afetada;
- metadados técnicos.

---

# 11. Configurações

## 11.1 Configurações gerais

- **Rota sugerida**: `/configuracoes`
- **Prioridade**: P1
- **Tipo**: Configuração
- **Objetivo**: centralizar parâmetros gerais do ERP.

### Seções

- dados da empresa;
- dados MEI;
- preferências financeiras;
- moeda padrão;
- categorias padrão;
- alertas.

## 11.2 Dados da empresa

- **Rota sugerida**: `/configuracoes/empresa`
- **Prioridade**: P1
- **Tipo**: Formulário
- **Objetivo**: registrar dados cadastrais da empresa.

### Campos

- razão social/nome empresarial;
- nome fantasia;
- CNPJ;
- atividade principal;
- e-mail;
- telefone;
- endereço;
- responsável.

## 11.3 Usuários internos

- **Rota sugerida**: `/configuracoes/usuarios`
- **Prioridade**: P1
- **Tipo**: Listagem
- **Objetivo**: gerenciar usuários que acessam o ERP.

### Colunas

- nome;
- e-mail;
- perfil;
- status;
- último acesso.

### Ações

- convidar usuário;
- editar perfil;
- desativar;
- redefinir senha.

## 11.4 Perfis e permissões

- **Rota sugerida**: `/configuracoes/permissoes`
- **Prioridade**: P1
- **Tipo**: Configuração
- **Objetivo**: definir acesso por perfil.

### Perfis iniciais

- fundador;
- financeiro;
- suporte;
- leitura.

## 11.5 Categorias e parâmetros

- **Rota sugerida**: `/configuracoes/categorias`
- **Prioridade**: P2
- **Tipo**: Configuração
- **Objetivo**: manter listas auxiliares.

### Itens configuráveis

- categorias financeiras;
- tipos de chamado;
- prioridades;
- status;
- formas de pagamento;
- categorias de serviços contratados.

---

# 12. Ordem recomendada de implementação

## Etapa 1 — Base obrigatória

1. Login administrativo.
2. Layout administrativo.
3. Dashboard inicial.
4. Serviços contratados.
5. Contas a pagar.
6. Lançamentos financeiros.

## Etapa 2 — Gestão da empresa

1. Contas a receber.
2. Obrigações MEI.
3. Notas fiscais manuais.
4. Categorias financeiras.
5. Relatório financeiro mensal.

## Etapa 3 — Operação do NossoZelo

1. Marketplace — clientes.
2. Marketplace — prestadores.
3. Marketplace — assinaturas.
4. Suporte/chamados.
5. Tarefas internas.

## Etapa 4 — Segurança e controle

1. Auditoria.
2. Usuários internos.
3. Perfis e permissões.
4. Configurações gerais.

## Etapa 5 — Crescimento

1. Relatórios avançados.
2. Calendário de renovações.
3. Importação CSV.
4. Conciliação manual.
5. Alertas automáticos.

---

# 13. Checklist resumido de telas P0

Estas telas devem existir no MVP interno:

- [ ] `/login`
- [ ] `/dashboard`
- [ ] `/financeiro`
- [ ] `/financeiro/lancamentos`
- [ ] `/financeiro/lancamentos/novo`
- [ ] `/financeiro/contas-a-pagar`
- [ ] `/financeiro/contas-a-pagar/nova`
- [ ] `/financeiro/contas-a-receber`
- [ ] `/financeiro/contas-a-receber/nova`
- [ ] `/servicos-contratados`
- [ ] `/servicos-contratados/novo`
- [ ] `/servicos-contratados/[id]`
- [ ] `/servicos-contratados/[id]/cobrancas/nova`
- [ ] `/fiscal`
- [ ] `/fiscal/obrigacoes`
- [ ] `/fiscal/obrigacoes/nova`
- [ ] `/fiscal/notas-fiscais`
- [ ] `/fiscal/notas-fiscais/nova`
- [ ] `/suporte/chamados`
- [ ] `/suporte/chamados/novo`
- [ ] `/suporte/chamados/[id]`
- [ ] `/tarefas`
- [ ] `/tarefas/nova`
- [ ] `/auditoria`

---

# 14. Critério de pronto para documentação de telas

A documentação de telas será considerada suficiente quando cada tela tiver:

- rota sugerida;
- prioridade;
- tipo;
- objetivo;
- campos principais;
- ações esperadas;
- relação com outros módulos;
- critérios mínimos de uso.

Este documento deve ser atualizado sempre que uma tela for adicionada, removida ou tiver mudança relevante de escopo.
