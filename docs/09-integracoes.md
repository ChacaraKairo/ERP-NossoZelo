# Integrações

## Objetivo

Mapear as integrações previstas para o ERP NossoZelo, separando o que é obrigatório no MVP do que pode ser implementado posteriormente.

## Princípio

O ERP deve começar com poucas integrações automáticas. No início, várias informações podem ser registradas manualmente para reduzir risco e acelerar a entrega.

## Integrações obrigatórias no MVP

### 1. Banco de dados do NossoZelo

O ERP deve consultar ou compartilhar informações essenciais do marketplace.

Dados importantes:

- usuários;
- prestadores;
- assinaturas;
- planos;
- pagamentos;
- status de cadastro;
- logs administrativos.

Objetivo:

- evitar duplicidade de dados;
- permitir visão operacional;
- relacionar chamados, contas a receber e assinaturas.

### 2. AWS S3

Usado para anexos, comprovantes, notas fiscais, documentos e arquivos internos.

Buckets sugeridos:

- bucket público para imagens liberadas;
- bucket privado para documentos, comprovantes e anexos sensíveis.

Regras:

- documentos privados não devem ter URL pública fixa;
- o ERP deve salvar apenas metadados e object key;
- o acesso deve ser controlado pelo backend;
- credenciais devem vir de variáveis de ambiente.

### 3. IAM AWS

Usado para limitar permissões de acesso ao S3.

Regras:

- não usar usuário root;
- não usar AdministratorAccess;
- criar usuário/role específico para o ERP/NossoZelo;
- aplicar princípio de menor privilégio;
- rotacionar credenciais quando necessário.

## Integrações recomendadas para primeira fase

### Asaas

O Asaas deve ser a origem de cobranças, pagamentos e status de assinatura.

No MVP do ERP:

- exibir dados sincronizados ou registrados pelo marketplace;
- registrar gateway_reference;
- permitir consultar status;
- não duplicar toda regra de cobrança se já estiver no backend NossoZelo.

Futuro:

- conciliação de cobranças;
- importação de extratos;
- relatório de taxas;
- painel de inadimplência avançado.

### E-mail transacional

Serviços possíveis:

- Resend;
- Brevo;
- outro provedor SMTP/API.

Uso:

- alertas administrativos;
- lembretes internos;
- notificações de vencimento;
- recuperação de senha, se o ERP tiver login separado.

### Monitoramento

Serviços possíveis:

- UptimeRobot;
- Better Stack;
- monitoramento próprio simples.

Uso:

- monitorar backend;
- monitorar frontend;
- monitorar painel admin/ERP;
- registrar incidentes relevantes.

## Integrações manuais no MVP

### Registro.br

O ERP deve registrar o domínio como serviço contratado.

Campos:

- domínio;
- data de renovação;
- custo anual;
- responsável;
- observações.

Não precisa integração automática.

### Cloudflare

O ERP deve registrar Cloudflare como serviço contratado.

No MVP:

- registrar plano;
- registrar domínio relacionado;
- registrar criticidade;
- registrar URL do painel.

Não precisa integração automática.

### Render, Vercel, Railway e Upstash

No MVP, devem ser cadastrados como serviços contratados.

Dados:

- plano;
- custo previsto;
- ambiente;
- criticidade;
- próxima cobrança;
- URL do painel;
- método de pagamento.

Não precisa integração automática de billing no início.

## Integrações futuras

### NFS-e

No MVP, notas serão registradas manualmente.

Futuro:

- integração com emissor fiscal;
- importação de XML;
- consulta de nota;
- automação parcial da emissão.

### Banco / Open Finance

Não implementar no MVP.

Futuro:

- importação de extrato CSV;
- conciliação manual assistida;
- integração bancária;
- classificação automática de lançamentos.

### Cartão de crédito corporativo

Não implementar no MVP.

Futuro:

- importar fatura;
- vincular cobrança a serviço contratado;
- detectar custo acima do previsto.

## Variáveis de ambiente esperadas

Exemplos:

```env
DATABASE_URL=
JWT_SECRET=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_PUBLIC_BUCKET=
S3_PRIVATE_BUCKET=
ASAAS_API_KEY=
ASAAS_WEBHOOK_TOKEN=
EMAIL_PROVIDER=
RESEND_API_KEY=
```

## Regras de segurança

1. O ERP não deve commitar `.env`.
2. O ERP não deve exibir segredos.
3. O ERP não deve salvar tokens em campos comuns do banco.
4. O ERP pode salvar metadados de credenciais, como data de rotação e local seguro.
5. Toda integração crítica deve ter status e responsável.
