# Modo Local, Electron e Sincronização Futura

## Objetivo

Preparar o backend para funcionar localmente no início e permitir migração para modo online no futuro.

## Decisão de curto prazo

O MVP do ERP deve rodar primeiro como sistema local/web de desenvolvimento:

```text
Next.js frontend
NestJS backend
MySQL local
```

Depois pode ser empacotado com Electron.

## Decisão para Electron

Mesmo no Electron, o frontend não deve falar direto com o banco.

Fluxo correto:

```text
Electron Renderer -> HTTP -> NestJS Local -> Prisma -> Banco Local
```

## Por que manter API local

Vantagens:

- mesma regra de negócio do online;
- mesma auditoria;
- mesma validação;
- mesma estrutura de permissões;
- menor retrabalho quando subir para nuvem;
- menor risco de lógica duplicada.

## APP_MODE

Variável de ambiente:

```env
APP_MODE=local
```

Valores:

```text
local
```

Uso em desenvolvimento.

```text
desktop
```

Uso empacotado com Electron.

```text
online
```

Uso em servidor remoto.

## Campos preparados para sincronização

Tabelas importantes podem receber:

```text
sync_status
last_synced_at
origin_device_id
version
```

### `sync_status`

Valores sugeridos:

```text
local_only
pending_sync
synced
conflict
```

### `origin_device_id`

Identifica a instalação que criou o registro.

### `version`

Número inteiro incrementado a cada alteração.

Ajuda a detectar conflitos.

## Sincronização não será feita no MVP

A sincronização automática entre desktop e nuvem é complexa.

Não implementar agora:

- merge automático;
- conflitos multiusuário;
- replicação bidirecional;
- fila offline complexa;
- sincronização parcial por módulo.

## Migração futura recomendada

Quando decidir migrar para online:

1. Criar API online.
2. Criar banco online.
3. Exportar dados locais.
4. Importar para banco online.
5. Validar auditoria.
6. Configurar usuários internos.
7. Trocar `NEXT_PUBLIC_API_URL` para API online.

## Estratégia de exportação local

Criar no futuro endpoint local:

```text
POST /api/local/export
```

Deve gerar pacote com:

- dados principais;
- auditoria;
- anexos referenciados;
- versão do schema;
- data de exportação;
- checksum.

## Estratégia de importação online

Criar no futuro endpoint administrativo:

```text
POST /api/admin/import
```

Uso restrito a ADMIN.

Deve validar:

- versão do schema;
- integridade;
- duplicidades;
- IDs;
- auditoria original.

## Auditoria em modo local

Mesmo localmente, auditar:

- usuário;
- ação;
- data;
- entidade;
- before/after;
- `APP_MODE=local` ou `desktop`;
- `device_id`.

## Device ID

No Electron, gerar identificador único da instalação.

Armazenar fora do banco ou em tabela local de configuração.

Exemplo:

```text
ERP-NZ-DEVICE-2026-0001
```

## Backup local

Para desktop, criar rotina de backup.

Opções:

- backup manual pelo ERP;
- backup automático diário;
- exportação compactada;
- cópia para pasta escolhida pelo usuário.

Telas futuras:

```text
/configuracoes/backups
```

## Regras para não bloquear o futuro online

1. Nunca usar ID incremental como dependência externa.
2. Preferir UUID/CUID.
3. Sempre registrar `created_at` e `updated_at`.
4. Sempre usar API.
5. Não gravar regra de negócio no frontend.
6. Não depender de caminho local para dados críticos.
7. Anexos devem ter abstração de storage.
8. Auditoria deve funcionar igual em todos os modos.

## Storage local vs S3

No desktop, anexos podem começar em pasta local controlada.

No online, anexos devem ir para S3.

Para não travar a evolução, criar interface conceitual:

```ts
StorageProvider.save(file)
StorageProvider.get(key)
StorageProvider.delete(key)
```

Implementações futuras:

```text
LocalStorageProvider
S3StorageProvider
```

## Decisão final

O backend será preparado como API independente desde o início.

Isso permite:

- rodar localmente;
- empacotar com Electron;
- subir online futuramente;
- manter auditoria e regras de negócio consistentes.
