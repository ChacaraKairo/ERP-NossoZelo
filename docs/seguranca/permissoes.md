# Permissões

Perfis iniciais:

- `FUNDADOR`;
- `ADMIN`;
- `FINANCEIRO`;
- `OPERACAO`;
- `SUPORTE`;
- `LEITURA`.

`FUNDADOR` e `ADMIN` possuem acesso total.

As permissões usam o formato:

```text
modulo:acao
```

Exemplos:

```text
dashboard:read
financeiro:create
contas_pagar:pay
contas_receber:receive
servicos:update
auditoria:read
usuarios:disable
```

O backend aplica autenticação por padrão e valida permissões nos endpoints principais. Endpoints públicos devem ser marcados explicitamente.
