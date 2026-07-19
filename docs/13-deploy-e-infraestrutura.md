# Deploy e Infraestrutura

## Objetivo

Definir a infraestrutura inicial para hospedar o ERP NossoZelo com baixo custo, segurança suficiente e possibilidade de crescimento.

## Ambientes

O ERP deve possuir:

- local;
- staging;
- produção.

## Domínios sugeridos

- `erp.nossozelo.com.br` para o ERP;
- `admin.nossozelo.com.br` para painel operacional, se separado;
- `api.nossozelo.com.br` para backend compartilhado, se aplicável.

## Serviços recomendados

### Frontend/Admin

Opções:

- Vercel;
- Render;
- outro provedor compatível com Next.js.

### Backend

Opções:

- Render;
- Railway;
- Fly.io;
- servidor próprio apenas se houver necessidade.

### Banco

- MySQL gerenciado;
- Railway MySQL ou equivalente;
- backup obrigatório.

### Arquivos

- AWS S3;
- bucket público para imagens liberadas;
- bucket privado para documentos e comprovantes.

### DNS

- Cloudflare.

### Monitoramento

- UptimeRobot;
- Better Stack;
- logs nativos do provedor no início.

## Variáveis de ambiente

Exemplos:

```env
NODE_ENV=production
DATABASE_URL=
JWT_SECRET=
APP_URL=
API_URL=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_PUBLIC_BUCKET=
S3_PRIVATE_BUCKET=
EMAIL_PROVIDER=
RESEND_API_KEY=
```

## Regras de deploy

1. Nunca commitar `.env`.
2. Produção deve usar variáveis no painel do provedor.
3. Staging deve usar banco separado.
4. Produção deve ter backup.
5. Deploy deve rodar build antes de publicar.
6. Migrations devem ser testadas em banco limpo.
7. O ERP deve ter health check.
8. Logs não devem expor senhas, tokens ou dados sensíveis.

## Backup

O banco deve ter rotina mínima de backup.

MVP:

- backup manual semanal;
- backup antes de migrations importantes;
- armazenamento seguro do backup.

Futuro:

- backup automático diário;
- retenção de 7, 15 ou 30 dias;
- teste de restore.

## Health check

Endpoints sugeridos:

- `/health`;
- `/api/health`.

Devem validar:

- aplicação online;
- conexão com banco;
- versão da aplicação;
- ambiente.

## Segurança de infraestrutura

1. Usar HTTPS.
2. Usar DNS protegido.
3. Não expor banco publicamente se não for necessário.
4. Usar credenciais com menor privilégio.
5. Separar staging e produção.
6. Controlar serviços contratados no ERP.
7. Auditar alterações críticas.
8. Rotacionar credenciais comprometidas.

## Custos controlados

Todo serviço usado pela infraestrutura deve ser registrado no módulo Serviços Contratados.

Cada serviço deve informar:

- valor previsto;
- periodicidade;
- data de renovação;
- criticidade;
- ambiente;
- método de pagamento;
- responsável.
