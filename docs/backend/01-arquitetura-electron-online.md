# Arquitetura Local/Electron e Online

## Objetivo

O ERP deve nascer preparado para rodar como aplicativo desktop no futuro, mas sem bloquear a possibilidade de virar um sistema online quando mais pessoas precisarem usar.

A arquitetura deve evitar decisões que prendam o sistema exclusivamente ao desktop ou exclusivamente à nuvem.

## Estratégia recomendada

```text
Backend NestJS independente
Frontend Next.js independente
Comunicação por HTTP local ou remoto
Banco via Prisma
```

O frontend nunca deve acessar o banco diretamente. Mesmo no Electron, o frontend deve conversar com a API.

## Modo 1 — Desenvolvimento local

```text
Next.js web -> http://localhost:3000
NestJS api  -> http://localhost:3333
MySQL local -> localhost:3306
```

Uso:

- desenvolvimento;
- testes locais;
- implementação inicial;
- validação do fluxo.

## Modo 2 — Desktop/Electron local

Arquitetura prevista:

```text
Electron Shell
├── renderer: frontend Next.js empacotado
└── main process: inicia API NestJS local

NestJS API local
└── Prisma -> banco local
```

Fluxo:

1. Usuário abre o aplicativo Electron.
2. Electron inicia a API NestJS local em uma porta interna.
3. Frontend carrega a interface.
4. Frontend chama a API local.
5. API grava no banco local.

## Modo 3 — Online futuro

Arquitetura prevista:

```text
Browser ou Electron
        ↓
API NestJS online
        ↓
MySQL gerenciado
```

Neste cenário:

- vários usuários internos podem acessar;
- permissões ficam mais importantes;
- auditoria precisa registrar IP, user-agent e origem;
- backups precisam ser automatizados;
- banco deve ser gerenciado.

## Variável de API

Frontend deve usar:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

No Electron local:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:3333
```

No online:

```env
NEXT_PUBLIC_API_URL=https://api.erp.nossozelo.com.br
```

## Banco local vs banco online

### MVP recomendado

Usar MySQL tanto local quanto online.

Vantagens:

- reduz divergência de comportamento;
- Prisma usa o mesmo provider;
- migrations são iguais;
- migração futura é mais simples.

### Alternativa futura

Usar SQLite para desktop local.

Só considerar se:

- o ERP for realmente usado offline;
- não houver necessidade de multiusuário local;
- sincronização futura for planejada com cuidado.

## Estratégia de sincronização futura

No MVP, não implementar sincronização complexa.

Preparar o banco para uma futura sincronização incluindo campos:

```text
id
created_at
updated_at
deleted_at
sync_status
last_synced_at
origin_device_id
version
```

Esses campos ajudam a migrar para local-first no futuro.

## Regras para viabilizar futuro online

1. Não acoplar regra de negócio ao Electron.
2. Não deixar frontend acessar arquivo local ou banco diretamente.
3. Não salvar estado crítico apenas em localStorage.
4. Não depender de caminho absoluto da máquina.
5. Não usar credenciais no frontend.
6. Não criar lógica duplicada entre desktop e online.
7. Backend deve funcionar como processo independente.
8. API deve ser stateless sempre que possível.
9. Auditoria deve funcionar nos dois modos.
10. Permissões devem existir mesmo no desktop.

## Decisão

A primeira implementação será:

```text
Web local + API NestJS local + MySQL local
```

Depois:

```text
Electron empacotando web + API local
```

E futuramente:

```text
Web/Electron apontando para API online
```

## Risco principal

O maior risco é criar um ERP desktop que não consiga virar online. Para evitar isso, a regra é simples:

```text
Sempre passar pela API NestJS.
```
