# Segurança, Autenticação e Permissões

## Objetivo

Definir a base de segurança do backend do ERP NossoZelo.

O sistema deve ser seguro tanto no uso local/Electron quanto no uso online futuro.

## Princípios

1. Todo usuário interno deve autenticar.
2. Toda rota privada deve exigir usuário válido.
3. Toda ação sensível deve exigir permissão.
4. Toda negativa de permissão deve ser auditada.
5. Nenhum segredo deve ser exposto ao frontend.
6. Nenhuma senha deve ser salva em texto puro.
7. A auditoria não pode armazenar segredos.
8. No modo online, CORS deve ser restrito.
9. No modo local, ainda deve haver autenticação.
10. Usuário admin inicial deve ser criado por seed seguro.

## Autenticação

### MVP

Usar JWT assinado pelo backend.

Variáveis:

```env
JWT_SECRET=
JWT_EXPIRES_IN=8h
```

### Futuro

Avaliar cookie httpOnly com sessão, principalmente para modo online.

## Senhas

Usar hash forte com bcrypt ou argon2.

Nunca salvar:

```text
senha em texto puro
senha temporária em log
hash em resposta da API
```

## Perfis iniciais

### ADMIN

Acesso total.

### FINANCEIRO

Acesso a:

```text
financeiro
serviços contratados
fornecedores
relatórios financeiros
fiscal leitura
```

### OPERACAO

Acesso a:

```text
serviços contratados leitura
suporte
tarefas
riscos
decisões
base de conhecimento
```

### SUPORTE

Acesso a:

```text
chamados
tarefas próprias
base de conhecimento leitura
```

### LEITURA

Acesso apenas leitura.

## Permissões

Permissões devem ser granulares.

Formato:

```text
modulo.acao
```

Exemplos:

```text
users.read
users.write
roles.manage
fornecedores.read
fornecedores.write
servicos.read
servicos.write
financeiro.read
financeiro.write
fiscal.read
fiscal.write
suporte.read
suporte.write
tarefas.read
tarefas.write
riscos.read
riscos.write
decisoes.read
decisoes.write
base_conhecimento.read
base_conhecimento.write
relatorios.read
auditoria.read
configuracoes.write
```

## Guards

### `JwtAuthGuard`

Responsável por validar autenticação.

### `PermissionsGuard`

Responsável por validar se o usuário tem permissão exigida.

### `LocalOnlyGuard`

Responsável por liberar determinadas rotas apenas quando:

```text
APP_MODE=local
ou
APP_MODE=desktop
```

Útil para rotas de manutenção local.

## Decorators

### `@Public()`

Marca rota pública.

Usar somente em:

```text
/auth/login
/health
```

### `@CurrentUser()`

Injeta o usuário autenticado.

### `@Permissions('financeiro.write')`

Define permissões necessárias.

### `@AuditAction(...)`

Define metadados de auditoria.

## CORS

### Local

```text
http://localhost:3000
http://127.0.0.1:3000
```

### Electron

Pode exigir origem customizada ou comunicação local.

### Online

Permitir apenas domínios oficiais:

```text
https://erp.nossozelo.com.br
```

Nunca usar `*` em produção.

## Rate limit

No MVP local, pode ser simples.

No online, aplicar rate limit em:

```text
/auth/login
/auth/change-password
```

## Auditoria de permissão negada

Sempre que `PermissionsGuard` negar acesso, registrar:

```text
AUTH_PERMISSION_DENIED
```

Com:

```text
userId
permissionRequired
route
method
ip
userAgent
```

## Proteção de dados sensíveis

Campos sensíveis devem ser mascarados em:

- logs;
- auditoria;
- resposta de erro;
- exportações.

## Referências de credenciais

O ERP pode registrar onde credenciais estão guardadas, mas não pode registrar o segredo.

Permitido:

```text
Conta AWS root está no gerenciador X
Access key do usuário nossozelo-app-s3 está no cofre Y
2FA ativado
Última rotação em 2026-07-20
```

Proibido:

```text
AWS_SECRET_ACCESS_KEY real
ASAAS_API_KEY real
JWT_SECRET real
Senha real
Recovery code real
```

## Soft delete

Ao excluir registros críticos, usar soft delete:

```text
deleted_at
deleted_by
```

Nunca apagar auditoria.

## Backups

No modo online, banco deve ter backup externo.

No modo local/Electron, criar rotina documentada para backup manual ou automático.

## Checklist de segurança inicial

- [ ] JWT_SECRET forte.
- [ ] Senhas com hash.
- [ ] `@Public()` usado só onde necessário.
- [ ] CORS restrito.
- [ ] Auditoria em login.
- [ ] Auditoria em permissão negada.
- [ ] Auditoria em mudanças financeiras.
- [ ] Auditoria em mudanças fiscais.
- [ ] Auditoria em usuários/perfis.
- [ ] Redação de dados sensíveis.
- [ ] Soft delete nos módulos críticos.
