# Plano Electron

## Decisão atual

A fase atual do ERP NossoZelo é web local/online:

- frontend Next.js;
- backend NestJS;
- PostgreSQL externo/local via Docker;
- API HTTP.

## Futuro recomendado

Electron deve ser tratado como cliente desktop conectado à API.

Não empacotar PostgreSQL dentro do Electron neste momento.

## Modos previstos

```text
APP_MODE=local
APP_MODE=online
APP_MODE=desktop
```

Campos preparados na arquitetura:

- `deviceId`;
- `sessionId`;
- `requestId`.

## Pendências futuras

- estratégia de backup;
- sincronização;
- empacotamento;
- atualização automática;
- política de dados offline.
