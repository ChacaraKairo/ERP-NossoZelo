# Auditoria

A auditoria é requisito estrutural do ERP NossoZelo.

Eventos registrados:

- login;
- logout;
- falha de login;
- criação;
- edição;
- exclusão lógica;
- pagamento de conta;
- recebimento de conta;
- alterações em serviços críticos com severidade alta.

Cada evento pode registrar:

- `requestId`;
- `sessionId`;
- `deviceId`;
- usuário;
- ação;
- módulo;
- entidade;
- método HTTP;
- rota;
- antes/depois;
- resultado;
- severidade;
- IP;
- user agent.

Dados sensíveis são sanitizados antes de persistir auditoria. Campos como senha, token, cookie, secret, access key, JWT e recovery codes são gravados como `[REDACTED]`.
