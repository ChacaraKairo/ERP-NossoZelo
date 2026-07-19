# Stack Técnica

## Objetivo

Definir uma stack simples, sustentável e compatível com o ecossistema NossoZelo.

## Decisão principal

O ERP deve usar tecnologias próximas ao NossoZelo para reduzir curva de aprendizado e facilitar manutenção.

## Frontend

Recomendação:

- Next.js;
- React;
- TypeScript;
- Tailwind CSS ou CSS Modules;
- componentes reutilizáveis;
- layout administrativo com menu lateral.

## Backend

Opções:

### Opção A — integrado ao controlador/admin

Vantagens:

- menor custo;
- menos deploys;
- reaproveita autenticação;
- entrega mais rápida.

Desvantagens:

- pode misturar responsabilidades;
- exige organização de pastas e módulos.

### Opção B — aplicação separada

Vantagens:

- separação clara;
- evolução independente;
- subdomínio próprio.

Desvantagens:

- mais deploy;
- mais configuração;
- mais custo potencial.

## Decisão para MVP

Começar como aplicação web administrativa separada ou como módulo isolado do controlador, mas sempre com separação lógica clara.

Estrutura recomendada se for separado:

- frontend Next.js;
- backend API Node/Express ou API routes;
- MySQL;
- Prisma.

## Banco de dados

- MySQL;
- Prisma ORM;
- migrations obrigatórias;
- seeds iniciais;
- backup regular.

## Armazenamento de arquivos

- AWS S3;
- IAM com permissões mínimas;
- bucket público para imagens liberadas;
- bucket privado para documentos, comprovantes, notas e anexos.

## Autenticação

- login administrativo;
- sessão segura;
- perfis de permissão;
- auditoria de login;
- bloqueio ou proteção contra tentativas excessivas.

## Segurança

- variáveis de ambiente para segredos;
- `.env` fora do Git;
- não armazenar tokens em texto aberto;
- auditoria de ações críticas;
- validação de entrada;
- controle de acesso por perfil;
- logs sem dados sensíveis.

## Deploy

Opções iniciais:

- Vercel para frontend/admin;
- Render para backend;
- Railway ou MySQL gerenciado para banco;
- AWS S3 para arquivos;
- Cloudflare para DNS;
- UptimeRobot para monitoramento.

## Ambientes

- local;
- staging;
- produção.

## Qualidade

Scripts esperados:

- lint;
- build;
- test;
- migrate;
- seed.

## Padrões técnicos

- TypeScript obrigatório;
- nomes claros;
- módulos separados;
- documentação atualizada;
- migrations testadas em banco limpo;
- componentes reaproveitáveis;
- validações no backend;
- auditoria para ações sensíveis.
