# Telas Recomendadas Adicionais

## Objetivo

Este documento registra telas adicionais recomendadas para o ERP NossoZelo. Elas complementam o MVP principal e ajudam a empresa a operar com mais controle durante os primeiros 2 anos.

As telas abaixo não substituem as telas centrais do ERP. Elas melhoram rotina de gestão, previsibilidade, controle de custos, registro de decisões e mitigação de riscos.

## Critérios de prioridade

- **P0**: importante para o MVP interno inicial.
- **P1**: importante para operação controlada nos primeiros meses.
- **P2**: útil para maturidade, documentação e crescimento.

---

# 1. Central de Alertas

## Rota sugerida

```text
/alertas
```

## Prioridade

**P0/P1**

## Objetivo

Concentrar todos os eventos que exigem atenção da empresa em uma única tela.

O dashboard mostra indicadores gerais. A Central de Alertas deve mostrar ações pendentes, vencimentos, riscos e urgências operacionais.

## Alertas esperados

- Conta a pagar vencendo.
- Conta a pagar atrasada.
- Conta a receber atrasada.
- Serviço contratado próximo da renovação.
- Domínio próximo do vencimento.
- DAS pendente.
- Nota fiscal pendente de emissão ou registro.
- Assinatura atrasada.
- Chamado crítico.
- Tarefa vencida.
- Custo real maior que custo previsto.
- Serviço crítico sem responsável definido.
- Credencial crítica sem data de última rotação.
- Backup não validado.

## Campos visíveis

- Tipo do alerta.
- Título.
- Descrição curta.
- Prioridade.
- Entidade relacionada.
- Data de vencimento ou data limite.
- Responsável.
- Status.
- Ação recomendada.

## Ações

- Ver detalhe.
- Marcar como resolvido.
- Adiar alerta.
- Vincular a tarefa.
- Vincular a chamado.
- Abrir entidade relacionada.

## Observações

Esta tela deve ser uma das telas mais usadas do ERP. Ela transforma dados registrados em ações práticas.

---

# 2. Calendário Operacional

## Rota sugerida

```text
/calendario
```

## Prioridade

**P1**

## Objetivo

Visualizar em formato mensal/semanal os principais eventos operacionais e financeiros da empresa.

## Eventos exibidos

- Vencimento do DAS.
- Vencimento de domínio.
- Renovação de serviço contratado.
- Contas a pagar.
- Contas a receber.
- Tarefas com prazo.
- Cobranças previstas.
- Obrigações fiscais.
- Fechamento mensal.
- Revisão de custos.
- Revisão de riscos.

## Campos do evento

- Título.
- Tipo.
- Data.
- Horário, se aplicável.
- Status.
- Responsável.
- Entidade vinculada.
- Observações.

## Visualizações

- Mês.
- Semana.
- Lista.

## Ações

- Criar evento manual.
- Abrir entidade relacionada.
- Marcar evento como concluído.
- Filtrar por tipo.
- Filtrar por responsável.

---

# 3. Cofre de Referências

## Rota sugerida

```text
/cofre-referencias
```

## Prioridade

**P1**

## Objetivo

Registrar onde estão guardadas as credenciais e acessos importantes da empresa, sem salvar senhas, tokens ou chaves secretas no ERP.

O ERP não deve funcionar como gerenciador de senhas. Ele deve apenas indicar onde o acesso está guardado com segurança e quem é o responsável.

## Exemplos de referências

- AWS root account.
- IAM NossoZelo.
- Render.
- Vercel.
- Railway.
- Registro.br.
- Cloudflare.
- Asaas.
- Resend.
- GitHub.
- E-mail administrativo.
- Conta bancária PJ.
- Portal NFS-e.

## Campos

- Serviço.
- Tipo de acesso.
- E-mail da conta.
- Local seguro da credencial.
- Responsável.
- Possui 2FA.
- Método de 2FA.
- Última rotação.
- Próxima revisão.
- Criticidade.
- Observações.

## Regras

- Não salvar senha.
- Não salvar token.
- Não salvar chave secreta.
- Não salvar recovery code.
- Registrar apenas referência segura.
- Acesso restrito a administradores.

## Ações

- Criar referência.
- Editar referência.
- Marcar 2FA como configurado.
- Registrar rotação de credencial.
- Agendar revisão.

---

# 4. Painel de Custos de Infraestrutura

## Rota sugerida

```text
/relatorios/custos-infraestrutura
```

## Prioridade

**P1**

## Objetivo

Acompanhar os custos técnicos do NossoZelo separadamente das demais despesas da empresa.

Essa tela deve ajudar a identificar crescimento de custo em serviços como AWS, Render, Vercel, banco de dados, armazenamento, e-mail e ferramentas.

## Serviços monitorados

- AWS.
- S3.
- IAM, sem custo direto, mas vinculado à AWS.
- Render.
- Vercel.
- Railway ou provedor do MySQL.
- Upstash.
- Cloudflare.
- Registro.br.
- Resend.
- GitHub.
- Ferramentas de IA.
- Monitoramento.

## Indicadores

- Custo mensal previsto.
- Custo mensal real.
- Diferença entre previsto e real.
- Custo em dólar.
- Custo em real.
- Serviços críticos.
- Serviços em trial.
- Serviços gratuitos.
- Serviços pagos.
- Serviços que podem ser cancelados.

## Filtros

- Mês.
- Serviço.
- Categoria.
- Moeda.
- Ambiente.
- Criticidade.
- Status.

## Ações

- Abrir serviço contratado.
- Registrar cobrança.
- Gerar conta a pagar.
- Marcar serviço para revisão.
- Exportar relatório.

---

# 5. Planejamento Mensal

## Rota sugerida

```text
/planejamento/mensal
```

## Prioridade

**P1**

## Objetivo

Planejar o mês antes dele acontecer, definindo metas, orçamento, riscos e prioridades.

## Campos

- Mês/ano.
- Meta de receita.
- Orçamento máximo de despesas.
- Meta de novos prestadores.
- Meta de novos clientes.
- Tarefas principais.
- Riscos do mês.
- Serviços que vencem no mês.
- Obrigações fiscais.
- Previsão de lucro/prejuízo.
- Observações.

## Blocos da tela

### Financeiro planejado

- Receita prevista.
- Despesas previstas.
- Lucro/prejuízo previsto.

### Operação planejada

- Objetivos de clientes.
- Objetivos de prestadores.
- Objetivos de suporte.

### Desenvolvimento planejado

- Funcionalidades prioritárias.
- Bugs críticos.
- Melhorias do marketplace.

### Riscos

- Riscos financeiros.
- Riscos técnicos.
- Riscos operacionais.

## Ações

- Criar planejamento do mês.
- Editar planejamento.
- Comparar planejado vs realizado.
- Gerar tarefas a partir do planejamento.

---

# 6. Fechamento Mensal

## Rota sugerida

```text
/fechamento-mensal
```

## Prioridade

**P0/P1**

## Objetivo

Fechar cada mês com histórico financeiro, fiscal, operacional e estratégico.

Essa tela evita que o ERP seja apenas um cadastro. Ela cria uma rotina real de gestão.

## Indicadores do fechamento

- Receita bruta.
- Receita líquida.
- Despesas.
- Lucro/prejuízo.
- Saldo inicial.
- Saldo final.
- DAS pago.
- Notas fiscais emitidas.
- Serviços pagos.
- Assinaturas ativas.
- Assinaturas atrasadas.
- Chamados abertos.
- Chamados resolvidos.
- Tarefas concluídas.
- Tarefas atrasadas.
- Principais problemas.
- Decisões tomadas.

## Campos

- Mês/ano.
- Status do fechamento.
- Responsável.
- Data de fechamento.
- Resumo financeiro.
- Resumo fiscal.
- Resumo operacional.
- Observações.
- Pendências para o próximo mês.

## Status

- Aberto.
- Em revisão.
- Fechado.
- Reaberto.

## Regras

- Não permitir fechar mês com DAS pendente sem justificativa.
- Não permitir fechar mês com contas vencidas sem marcação de pendência.
- Registrar auditoria ao fechar ou reabrir mês.
- Permitir exportação do resumo mensal.

## Ações

- Criar fechamento do mês.
- Revisar dados.
- Adicionar observações.
- Marcar como fechado.
- Reabrir fechamento.
- Exportar relatório.

---

# 7. Diário de Decisões

## Rota sugerida

```text
/decisoes
```

## Prioridade

**P2**

## Objetivo

Registrar decisões importantes da empresa, evitando perda de contexto ao longo do tempo.

## Exemplos de decisões

- Escolha de Render para backend.
- Escolha de AWS S3 para arquivos.
- Adiamento de ClamAV.
- Mudança de preço dos planos.
- Cancelamento de serviço contratado.
- Alteração de estratégia de lançamento.
- Priorização de módulo.
- Decisão fiscal ou operacional relevante.

## Campos

- Título.
- Contexto.
- Decisão tomada.
- Alternativas consideradas.
- Motivo.
- Impacto esperado.
- Risco associado.
- Responsável.
- Data da decisão.
- Data de revisão.
- Status.

## Status

- Ativa.
- Em revisão.
- Substituída.
- Cancelada.

## Ações

- Registrar decisão.
- Editar decisão.
- Marcar para revisão.
- Vincular a tarefa.
- Vincular a risco.
- Vincular a serviço contratado.

---

# 8. Base de Conhecimento Interna

## Rota sugerida

```text
/base-conhecimento
```

## Prioridade

**P2**

## Objetivo

Documentar processos internos da empresa para evitar dependência de memória, mensagens soltas ou conhecimento informal.

## Exemplos de artigos

- Como pagar o DAS.
- Como emitir NFS-e.
- Como acessar AWS.
- Como renovar domínio.
- Como responder chamado de pagamento.
- Como bloquear prestador.
- Como reprocessar assinatura.
- Como criar access key IAM.
- Como conferir custos AWS.
- Como executar backup.

## Campos

- Título.
- Categoria.
- Conteúdo.
- Responsável.
- Status.
- Data de criação.
- Última atualização.
- Data de revisão.
- Tags.

## Categorias

- Financeiro.
- Fiscal.
- Infraestrutura.
- Suporte.
- Marketplace.
- Segurança.
- Desenvolvimento.
- Administrativo.

## Ações

- Criar artigo.
- Editar artigo.
- Arquivar artigo.
- Marcar para revisão.
- Buscar por termo.
- Filtrar por categoria.

---

# 9. Painel de Riscos

## Rota sugerida

```text
/riscos
```

## Prioridade

**P1/P2**

## Objetivo

Registrar riscos da operação e acompanhar ações de mitigação.

## Exemplos de riscos

- Backend cair.
- Banco sem backup validado.
- Credencial AWS exposta.
- Webhook Asaas falhando.
- Domínio vencer.
- Custo em dólar subir.
- Limite MEI próximo.
- Falta de caixa.
- Serviço crítico sem responsável.
- Inadimplência alta.
- Falha no envio de e-mails.

## Campos

- Nome do risco.
- Descrição.
- Categoria.
- Probabilidade.
- Impacto.
- Nível de risco.
- Plano de mitigação.
- Responsável.
- Status.
- Data de identificação.
- Data de revisão.
- Entidade relacionada.

## Categorias

- Financeiro.
- Técnico.
- Fiscal.
- Segurança.
- Operacional.
- Jurídico.
- Comercial.

## Status

- Identificado.
- Em mitigação.
- Monitorado.
- Resolvido.
- Aceito.

## Ações

- Criar risco.
- Atualizar probabilidade.
- Atualizar impacto.
- Vincular tarefa.
- Vincular decisão.
- Marcar como resolvido.

---

# 10. Fornecedores

## Rota sugerida

```text
/fornecedores
```

## Prioridade

**P1**

## Objetivo

Cadastrar fornecedores da empresa, incluindo serviços digitais, prestadores externos e parceiros administrativos.

## Exemplos de fornecedores

- AWS.
- Render.
- Vercel.
- Railway.
- Registro.br.
- Cloudflare.
- Asaas.
- Resend.
- GitHub.
- Contador.
- Advogado.
- Designer.
- Ferramentas pagas.

## Campos

- Nome.
- Categoria.
- Tipo.
- Site.
- E-mail de suporte.
- Telefone.
- Documento, se houver.
- Pessoa de contato.
- Status.
- Observações.

## Relacionamentos

Um fornecedor pode estar vinculado a:

- Serviços contratados.
- Contas a pagar.
- Lançamentos financeiros.
- Contratos.
- Chamados internos.
- Riscos.

## Ações

- Criar fornecedor.
- Editar fornecedor.
- Inativar fornecedor.
- Ver serviços vinculados.
- Ver despesas vinculadas.

---

# Ordem recomendada de implementação

## Primeiro bloco

1. Central de Alertas.
2. Fechamento Mensal.
3. Fornecedores.
4. Painel de Custos de Infraestrutura.

## Segundo bloco

5. Calendário Operacional.
6. Planejamento Mensal.
7. Cofre de Referências.
8. Painel de Riscos.

## Terceiro bloco

9. Diário de Decisões.
10. Base de Conhecimento Interna.

---

# Checklist de inclusão no menu

## Menu principal recomendado atualizado

- Dashboard.
- Alertas.
- Calendário.
- Financeiro.
- Serviços Contratados.
- Fornecedores.
- Fiscal/MEI.
- Marketplace.
- Suporte.
- Tarefas.
- Planejamento.
- Fechamento Mensal.
- Relatórios.
- Riscos.
- Decisões.
- Base de Conhecimento.
- Auditoria.
- Configurações.

## Observação

Algumas telas podem ficar ocultas no menu principal no início e aparecer apenas dentro de módulos relacionados. Porém, devem estar documentadas desde agora para orientar o crescimento do ERP.
