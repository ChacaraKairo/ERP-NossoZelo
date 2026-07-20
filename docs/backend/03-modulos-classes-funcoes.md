# Módulos, Classes e Funções do Backend

## Objetivo

Este documento define os módulos, classes e funções esperadas para a primeira versão do backend NestJS do ERP NossoZelo.

A implementação deve seguir o padrão:

```text
Controller -> Service -> PrismaService
```

Controllers recebem requisições. Services executam regras de negócio. PrismaService acessa o banco.

---

# 1. AppModule

## Arquivo

```text
apps/api/src/app.module.ts
```

## Classe

```ts
AppModule
```

## Responsabilidade

Importar todos os módulos da API.

## Deve importar

```text
ConfigModule
PrismaModule
AuthModule
UsersModule
RolesModule
PermissionsModule
AuditModule
FornecedoresModule
ServicosContratadosModule
FinanceiroModule
FiscalModule
SuporteModule
TarefasModule
RiscosModule
DecisoesModule
BaseConhecimentoModule
DashboardModule
RelatoriosModule
ConfiguracoesModule
HealthModule
```

---

# 2. AuthModule

## Arquivos

```text
auth/auth.module.ts
auth/auth.controller.ts
auth/auth.service.ts
auth/dto/login.dto.ts
auth/dto/change-password.dto.ts
auth/strategies/jwt.strategy.ts
auth/strategies/local.strategy.ts
```

## Classes

```ts
AuthModule
AuthController
AuthService
JwtStrategy
LocalStrategy
LoginDto
ChangePasswordDto
```

## Funções do AuthService

### `validateUser(email: string, password: string)`

Valida credenciais do usuário interno.

Deve:

- buscar usuário por e-mail;
- verificar se está ativo;
- comparar senha com hash;
- registrar tentativa de login;
- retornar usuário seguro sem senha.

### `login(dto: LoginDto, context: RequestContext)`

Realiza login.

Deve:

- validar usuário;
- gerar token ou sessão;
- registrar auditoria `AUTH_LOGIN_SUCCESS`;
- retornar dados básicos do usuário e token/sessão.

### `logout(userId: string, context: RequestContext)`

Finaliza sessão.

Deve:

- invalidar sessão, se houver tabela de sessão;
- registrar auditoria `AUTH_LOGOUT`.

### `getMe(userId: string)`

Retorna dados do usuário autenticado.

### `changePassword(userId: string, dto: ChangePasswordDto)`

Altera senha do usuário.

Deve:

- validar senha atual;
- aplicar hash na nova senha;
- invalidar sessões antigas, se aplicável;
- registrar auditoria `AUTH_PASSWORD_CHANGED`.

---

# 3. UsersModule

## Arquivos

```text
users/users.module.ts
users/users.controller.ts
users/users.service.ts
users/dto/create-user.dto.ts
users/dto/update-user.dto.ts
users/dto/list-users-query.dto.ts
```

## Classes

```ts
UsersModule
UsersController
UsersService
CreateUserDto
UpdateUserDto
ListUsersQueryDto
```

## Funções do UsersService

### `create(dto: CreateUserDto, actor: RequestUser)`

Cria usuário interno.

Auditoria: `USER_CREATED`.

### `findAll(query: ListUsersQueryDto)`

Lista usuários internos com paginação e filtros.

### `findById(id: string)`

Busca usuário por ID.

### `findByEmail(email: string)`

Busca usuário por e-mail.

Uso interno no AuthService.

### `update(id: string, dto: UpdateUserDto, actor: RequestUser)`

Atualiza usuário.

Deve auditar antes/depois.

Auditoria: `USER_UPDATED`.

### `deactivate(id: string, actor: RequestUser)`

Desativa usuário sem apagar.

Auditoria: `USER_DEACTIVATED`.

### `activate(id: string, actor: RequestUser)`

Reativa usuário.

Auditoria: `USER_ACTIVATED`.

---

# 4. RolesModule e PermissionsModule

## Responsabilidade

Controlar perfis e permissões internas.

## Perfis iniciais

```text
ADMIN
FINANCEIRO
OPERACAO
SUPORTE
LEITURA
```

## Permissões iniciais

```text
users.read
users.write
services.read
services.write
finance.read
finance.write
fiscal.read
fiscal.write
support.read
support.write
tasks.read
tasks.write
reports.read
audit.read
settings.write
```

## Funções principais

### `RolesService.assignRole(userId, roleId, actor)`

Vincula perfil a usuário.

Auditoria: `ROLE_ASSIGNED`.

### `RolesService.removeRole(userId, roleId, actor)`

Remove perfil de usuário.

Auditoria: `ROLE_REMOVED`.

### `PermissionsService.userHasPermission(userId, permission)`

Usado pelo `PermissionsGuard`.

---

# 5. AuditModule

## Arquivos

```text
audit/audit.module.ts
audit/audit.controller.ts
audit/audit.service.ts
audit/dto/create-audit-event.dto.ts
audit/dto/list-audit-query.dto.ts
audit/constants/audit-actions.ts
```

## Classes

```ts
AuditModule
AuditController
AuditService
CreateAuditEventDto
ListAuditQueryDto
```

## Funções do AuditService

### `record(event: CreateAuditEventDto)`

Registra evento de auditoria.

Nunca deve lançar erro que impeça a operação principal sem necessidade. Se a auditoria falhar, registrar log crítico.

### `recordChange(params)`

Registra alteração com `before` e `after`.

### `findAll(query: ListAuditQueryDto)`

Lista auditoria com filtros.

### `findByEntity(entityType: string, entityId: string)`

Lista auditoria de uma entidade específica.

### `redactSensitiveData(data: unknown)`

Remove senhas, tokens, secrets, chaves AWS, headers sensíveis e credenciais.

---

# 6. FornecedoresModule

## Arquivos

```text
fornecedores/fornecedores.module.ts
fornecedores/fornecedores.controller.ts
fornecedores/fornecedores.service.ts
fornecedores/dto/create-fornecedor.dto.ts
fornecedores/dto/update-fornecedor.dto.ts
fornecedores/dto/list-fornecedores-query.dto.ts
```

## Funções do FornecedoresService

### `create(dto, actor)`

Cria fornecedor.

Auditoria: `FORNECEDOR_CREATED`.

### `findAll(query)`

Lista fornecedores.

### `findById(id)`

Busca fornecedor.

### `update(id, dto, actor)`

Atualiza fornecedor com diff.

Auditoria: `FORNECEDOR_UPDATED`.

### `softDelete(id, actor)`

Desativa fornecedor.

Auditoria: `FORNECEDOR_DELETED`.

---

# 7. ServicosContratadosModule

## Responsabilidade

Controlar AWS, Render, Vercel, Railway, Asaas, Registro.br, Cloudflare, Resend, GitHub e outros serviços usados pela empresa.

## Arquivos

```text
servicos-contratados/servicos-contratados.module.ts
servicos-contratados/servicos-contratados.controller.ts
servicos-contratados/servicos-contratados.service.ts
servicos-contratados/servico-cobrancas.service.ts
servicos-contratados/credenciais-referencias.service.ts
servicos-contratados/dto/create-servico-contratado.dto.ts
servicos-contratados/dto/update-servico-contratado.dto.ts
servicos-contratados/dto/create-servico-cobranca.dto.ts
servicos-contratados/dto/create-credencial-referencia.dto.ts
servicos-contratados/dto/list-servicos-contratados-query.dto.ts
```

## Funções do ServicosContratadosService

### `create(dto, actor)`

Cria serviço contratado.

Deve permitir cadastrar:

- nome;
- fornecedor;
- categoria;
- ambiente;
- criticidade;
- custo previsto;
- moeda;
- data de renovação;
- status.

Auditoria: `SERVICO_CONTRATADO_CREATED`.

### `findAll(query)`

Lista serviços com filtros por status, fornecedor, criticidade, moeda, ambiente e categoria.

### `findById(id)`

Busca detalhes do serviço.

### `update(id, dto, actor)`

Atualiza serviço e registra diff.

Auditoria: `SERVICO_CONTRATADO_UPDATED`.

### `softDelete(id, actor)`

Desativa serviço sem apagar.

Auditoria: `SERVICO_CONTRATADO_DELETED`.

### `markForReview(id, actor)`

Marca serviço para revisão de custo/uso.

Auditoria: `SERVICO_CONTRATADO_MARKED_FOR_REVIEW`.

## Funções do ServicoCobrancasService

### `create(serviceId, dto, actor)`

Cria cobrança vinculada ao serviço.

Pode gerar conta a pagar automaticamente.

Auditoria: `SERVICO_COBRANCA_CREATED`.

### `findByService(serviceId)`

Lista cobranças de um serviço.

### `markAsPaid(cobrancaId, actor)`

Marca cobrança como paga.

Auditoria: `SERVICO_COBRANCA_PAID`.

## Funções do CredenciaisReferenciasService

### `create(serviceId, dto, actor)`

Cria referência de credencial sem salvar segredo.

Auditoria: `CREDENCIAL_REFERENCIA_CREATED`.

### `rotate(id, actor)`

Registra que uma credencial foi rotacionada.

Auditoria: `CREDENCIAL_REFERENCIA_ROTATED`.

---

# 8. FinanceiroModule

## Subservices

```text
LancamentosFinanceirosService
ContasAPagarService
ContasAReceberService
CategoriasFinanceirasService
FinanceiroResumoService
```

## Funções principais

### `LancamentosFinanceirosService.create(dto, actor)`

Cria lançamento financeiro.

Auditoria: `FINANCEIRO_LANCAMENTO_CREATED`.

### `ContasAPagarService.create(dto, actor)`

Cria conta a pagar.

Auditoria: `CONTA_A_PAGAR_CREATED`.

### `ContasAPagarService.markAsPaid(id, dto, actor)`

Marca conta como paga.

Auditoria: `CONTA_A_PAGAR_PAID`.

### `ContasAReceberService.markAsReceived(id, dto, actor)`

Marca conta como recebida.

Auditoria: `CONTA_A_RECEBER_RECEIVED`.

### `FinanceiroResumoService.getResumoMensal(mes, ano)`

Calcula receita, despesa, saldo e resultado do mês.

---

# 9. FiscalModule

## Services

```text
ObrigacoesMeiService
NotasFiscaisService
FiscalResumoService
```

## Funções principais

### `ObrigacoesMeiService.create(dto, actor)`

Cria obrigação MEI.

Auditoria: `OBRIGACAO_MEI_CREATED`.

### `ObrigacoesMeiService.markAsPaid(id, dto, actor)`

Marca DAS/obrigação como paga.

Auditoria: `OBRIGACAO_MEI_PAID`.

### `NotasFiscaisService.create(dto, actor)`

Registra NFS-e emitida manualmente.

Auditoria: `NOTA_FISCAL_CREATED`.

### `NotasFiscaisService.cancel(id, actor)`

Marca nota como cancelada.

Auditoria: `NOTA_FISCAL_CANCELLED`.

---

# 10. SuporteModule

## Services

```text
ChamadosService
ChamadoMensagensService
```

## Funções principais

### `ChamadosService.create(dto, actor)`

Cria chamado.

Auditoria: `CHAMADO_CREATED`.

### `ChamadosService.updateStatus(id, status, actor)`

Altera status.

Auditoria: `CHAMADO_STATUS_CHANGED`.

### `ChamadoMensagensService.create(chamadoId, dto, actor)`

Adiciona mensagem.

Auditoria opcional: `CHAMADO_MESSAGE_CREATED`.

---

# 11. TarefasModule

## Funções principais

### `TarefasService.create(dto, actor)`

Cria tarefa.

Auditoria: `TAREFA_CREATED`.

### `TarefasService.updateStatus(id, status, actor)`

Altera status da tarefa.

Auditoria: `TAREFA_STATUS_CHANGED`.

### `TarefasService.assign(id, userId, actor)`

Atribui responsável.

Auditoria: `TAREFA_ASSIGNED`.

---

# 12. RiscosModule

## Funções principais

### `RiscosService.create(dto, actor)`

Cria risco.

Auditoria: `RISCO_CREATED`.

### `RiscosService.updateLevel(id, dto, actor)`

Atualiza probabilidade, impacto ou nível.

Auditoria: `RISCO_LEVEL_UPDATED`.

### `RiscosService.close(id, actor)`

Fecha risco.

Auditoria: `RISCO_CLOSED`.

---

# 13. DecisoesModule

## Funções principais

### `DecisoesService.create(dto, actor)`

Registra decisão.

Auditoria: `DECISAO_CREATED`.

### `DecisoesService.markForReview(id, actor)`

Marca decisão para revisão.

Auditoria: `DECISAO_MARKED_FOR_REVIEW`.

---

# 14. BaseConhecimentoModule

## Funções principais

### `ArtigosService.create(dto, actor)`

Cria artigo interno.

Auditoria: `ARTIGO_CREATED`.

### `ArtigosService.publish(id, actor)`

Publica artigo.

Auditoria: `ARTIGO_PUBLISHED`.

### `ArtigosService.archive(id, actor)`

Arquiva artigo.

Auditoria: `ARTIGO_ARCHIVED`.

---

# 15. DashboardModule

## Funções principais

### `DashboardService.getOverview(periodo)`

Retorna visão geral:

- receita;
- despesas;
- resultado;
- serviços vencendo;
- contas vencendo;
- alertas;
- riscos;
- tarefas;
- chamados.

O dashboard deve calcular dados. Não deve duplicar informações salvas em outros módulos.

---

# 16. RelatoriosModule

## Funções principais

### `RelatoriosFinanceirosService.getMensal(mes, ano)`

Gera relatório financeiro mensal.

### `RelatoriosInfraService.getCustos(periodo)`

Gera custos de infraestrutura.

### `RelatoriosOperacionaisService.getOperacao(periodo)`

Gera indicadores de suporte, tarefas e marketplace.

---

# 17. HealthModule

## Endpoints

```text
GET /health
GET /health/db
```

## Funções

### `HealthService.getStatus()`

Retorna status da API.

### `HealthService.checkDatabase()`

Valida conexão com o banco.
