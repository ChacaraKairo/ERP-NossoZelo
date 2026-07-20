# Roadmap de Implementação do Backend

## Objetivo

Definir a ordem correta para implementar o backend NestJS do ERP NossoZelo.

A prioridade é criar uma base sólida, auditável e preparada para local/Electron e online futuro.

---

# Sprint 0 — Preparação do monorepo

## Entregas

```text
apps/api
apps/web
packages/shared
prisma
```

## Tarefas

- [ ] Mover frontend atual para `apps/web`, se necessário.
- [ ] Criar `apps/api` com NestJS.
- [ ] Criar `packages/shared`.
- [ ] Configurar TypeScript.
- [ ] Configurar scripts de desenvolvimento.
- [ ] Criar `.env.example`.
- [ ] Criar `docker-compose.yml` local para MySQL.

---

# Sprint 1 — Base NestJS

## Entregas

- AppModule.
- ConfigModule.
- PrismaModule.
- HealthModule.
- Padrão de erros.
- Padrão de resposta.

## Arquivos

```text
apps/api/src/main.ts
apps/api/src/app.module.ts
apps/api/src/config/*
apps/api/src/prisma/*
apps/api/src/common/filters/*
apps/api/src/common/interceptors/*
apps/api/src/health/*
```

## Critérios de aceite

- [ ] API sobe localmente.
- [ ] `/api/health` responde.
- [ ] `/api/health/db` testa conexão.
- [ ] Prisma conecta no banco.
- [ ] Erros são padronizados.

---

# Sprint 2 — Autenticação, usuários e permissões

## Entregas

- AuthModule.
- UsersModule.
- RolesModule.
- PermissionsModule.
- Seed de admin.

## Critérios de aceite

- [ ] Criar usuário admin inicial.
- [ ] Login funciona.
- [ ] `/api/auth/me` funciona.
- [ ] Rotas privadas exigem autenticação.
- [ ] Permissões funcionam.
- [ ] Permissão negada gera auditoria.

---

# Sprint 3 — Auditoria total

## Entregas

- AuditModule.
- AuditService.
- AuditInterceptor.
- Decorator `@AuditAction`.
- Função `redactSensitiveData`.
- Função `diffObjects`.

## Critérios de aceite

- [ ] Login gera auditoria.
- [ ] Criação de registro gera auditoria.
- [ ] Alteração salva before/after.
- [ ] Dados sensíveis são mascarados.
- [ ] Tela `/auditoria` consegue consumir API.

---

# Sprint 4 — Fornecedores

## Entregas

- FornecedoresModule.
- CRUD completo.
- Soft delete.
- Auditoria.

## Critérios de aceite

- [ ] Criar fornecedor.
- [ ] Listar fornecedores.
- [ ] Editar fornecedor.
- [ ] Desativar fornecedor.
- [ ] Auditoria registra mudanças.

---

# Sprint 5 — Serviços contratados

## Entregas

- ServicosContratadosModule.
- ServicoCobrancasService.
- CredenciaisReferenciasService.
- Seed com serviços iniciais.

## Serviços iniciais

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

## Critérios de aceite

- [ ] Criar serviço contratado.
- [ ] Vincular fornecedor.
- [ ] Registrar custo previsto.
- [ ] Registrar cobrança.
- [ ] Marcar cobrança como paga.
- [ ] Registrar referência de credencial sem segredo.
- [ ] Gerar auditoria completa.

---

# Sprint 6 — Financeiro

## Entregas

- Categorias financeiras.
- Lançamentos.
- Contas a pagar.
- Contas a receber.
- Resumo financeiro.

## Critérios de aceite

- [ ] Criar conta a pagar.
- [ ] Marcar como paga.
- [ ] Criar lançamento financeiro.
- [ ] Gerar resumo mensal.
- [ ] Cobrança de serviço pode gerar conta a pagar.
- [ ] Auditoria financeira completa.

---

# Sprint 7 — Dashboard e alertas

## Entregas

- DashboardService.
- Alertas calculados.
- Indicadores do mês.

## Alertas mínimos

```text
conta vencida
serviço vencendo
DAS pendente
tarefa atrasada
risco crítico
chamado crítico
```

## Critérios de aceite

- [ ] `/api/dashboard/overview` retorna dados reais.
- [ ] Alertas são calculados por dados existentes.
- [ ] Frontend consegue exibir cards.

---

# Sprint 8 — Fiscal/MEI

## Entregas

- Obrigações MEI.
- Notas fiscais manuais.
- Resumo fiscal.

## Critérios de aceite

- [ ] Criar DAS mensal.
- [ ] Marcar DAS como pago.
- [ ] Registrar NFS-e manual.
- [ ] Cancelar nota com justificativa.
- [ ] Gerar auditoria fiscal.

---

# Sprint 9 — Suporte e tarefas

## Entregas

- Chamados.
- Mensagens de chamados.
- Tarefas.
- Comentários de tarefas.

## Critérios de aceite

- [ ] Criar chamado.
- [ ] Atualizar status.
- [ ] Criar tarefa.
- [ ] Atribuir responsável.
- [ ] Dashboard exibe chamados/tarefas pendentes.

---

# Sprint 10 — Riscos, decisões e base de conhecimento

## Entregas

- Riscos.
- Decisões.
- Artigos internos.

## Critérios de aceite

- [ ] Registrar risco.
- [ ] Alterar nível do risco.
- [ ] Registrar decisão.
- [ ] Criar artigo.
- [ ] Publicar/arquivar artigo.

---

# Sprint 11 — Relatórios e fechamento mensal

## Entregas

- Relatório financeiro mensal.
- Relatório de custos de infraestrutura.
- Relatório fiscal mensal.
- Fechamento mensal.

## Critérios de aceite

- [ ] Gerar relatório financeiro.
- [ ] Gerar relatório de infraestrutura.
- [ ] Criar fechamento mensal.
- [ ] Fechar mês com auditoria.
- [ ] Reabrir mês exige justificativa.

---

# Sprint 12 — Preparação Electron

## Entregas

- Scripts para API local.
- Configuração APP_MODE.
- Device ID.
- Documentação de empacotamento.
- Estratégia de backup local.

## Critérios de aceite

- [ ] API roda em modo desktop.
- [ ] Auditoria registra `APP_MODE=desktop`.
- [ ] Frontend consegue apontar para API local.
- [ ] Backup local documentado.

---

# Regra de prioridade

A ordem não deve ser quebrada sem motivo forte.

Especialmente:

```text
Auditoria deve vir antes dos CRUDs principais.
```

Caso contrário, o sistema começa a gravar dados sem rastreabilidade.
