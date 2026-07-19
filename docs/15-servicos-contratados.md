# Serviços Contratados e Infraestrutura

## Objetivo

O módulo de Serviços Contratados existe para controlar todos os fornecedores, plataformas, ferramentas, assinaturas e serviços externos usados pela empresa para operar o NossoZelo.

Esse módulo é obrigatório porque o NossoZelo depende de serviços externos para funcionar, como hospedagem, banco, armazenamento, domínio, pagamentos, e-mail e monitoramento.

## Problema que o módulo resolve

Sem esse controle, a empresa pode:

- esquecer renovação de domínio;
- perder rastreio de custos mensais;
- não saber quais serviços são críticos;
- não saber onde estão as credenciais;
- manter serviços pagos sem uso;
- não prever aumento de custo;
- não saber quais serviços afetam produção;
- misturar gastos pessoais e empresariais;
- não saber o custo real do marketplace.

## Serviços iniciais que devem ser cadastrados

### Infraestrutura

- Render;
- Vercel;
- Railway ou banco MySQL gerenciado;
- AWS;
- AWS S3;
- AWS IAM;
- Upstash;
- Cloudflare.

### Domínio e DNS

- Registro.br;
- Cloudflare DNS.

### Pagamentos

- Asaas.

### E-mail

- Resend ou Brevo.

### Desenvolvimento

- GitHub;
- ferramentas de IA;
- ferramentas de design;
- ferramentas de teste;
- ferramentas de monitoramento.

### Administração

- contador;
- serviços jurídicos;
- banco PJ;
- certificado digital, se houver.

## Campos do cadastro de serviço

Cada serviço contratado deve possuir:

- ID;
- nome do serviço;
- fornecedor;
- categoria;
- descrição;
- ambiente;
- criticidade;
- status;
- URL do painel;
- URL de suporte;
- plano contratado;
- moeda;
- valor estimado;
- valor real da última cobrança;
- periodicidade;
- data de início;
- data de renovação;
- data de cancelamento;
- método de pagamento;
- responsável interno;
- possui credenciais;
- local seguro das credenciais;
- observações;
- tags;
- criado em;
- atualizado em.

## Ambientes

Um serviço pode estar relacionado a:

- desenvolvimento;
- staging;
- produção;
- todos.

Exemplo:

- Render backend produção: produção;
- banco de testes: staging;
- GitHub: todos;
- domínio principal: produção.

## Categorias

Categorias sugeridas:

- infraestrutura;
- hospedagem;
- banco de dados;
- armazenamento;
- segurança;
- domínio;
- DNS;
- pagamento;
- e-mail;
- monitoramento;
- desenvolvimento;
- IA;
- design;
- marketing;
- jurídico;
- contabilidade;
- administrativo;
- outros.

## Status

Status possíveis:

- em avaliação;
- trial;
- gratuito;
- ativo;
- pago;
- suspenso;
- cancelado;
- substituído.

## Criticidade

Criticidade define o impacto de falha do serviço.

### Baixa

Serviço útil, mas que pode ficar indisponível sem afetar operação imediata.

Exemplo:

- ferramenta de design;
- ferramenta de planejamento.

### Média

Serviço importante, mas com alternativa manual temporária.

Exemplo:

- ferramenta de IA;
- monitoramento externo.

### Alta

Serviço que afeta operação relevante.

Exemplo:

- e-mail transacional;
- armazenamento de arquivos;
- gateway de pagamento.

### Crítica

Serviço que, se parar, derruba ou compromete diretamente o marketplace.

Exemplo:

- banco de dados;
- backend;
- DNS;
- domínio;
- gateway de pagamento em produção.

## Relação com financeiro

Cada serviço contratado pode gerar automaticamente lançamentos financeiros.

Exemplo:

Serviço:

- Render Backend
- Plano: Starter
- Periodicidade: mensal
- Valor estimado: US$ 7
- Categoria financeira: infraestrutura

O ERP deve gerar:

- conta a pagar mensal;
- previsão de custo;
- alerta de vencimento;
- histórico de cobranças.

## Controle de cobrança em dólar

Alguns serviços serão cobrados em dólar.

O ERP deve permitir registrar:

- valor original em dólar;
- cotação usada;
- valor final em reais;
- IOF ou taxa do cartão, se aplicável;
- data da cobrança;
- comprovante ou fatura.

## Controle de credenciais

O ERP não deve armazenar chaves secretas diretamente.

Pode armazenar apenas:

- se o serviço possui credenciais;
- tipo de credencial;
- onde a credencial está guardada;
- data da última rotação;
- responsável pela credencial.

Exemplo:

- Serviço: AWS IAM NossoZelo
- Possui credenciais: sim
- Tipo: Access Key
- Local seguro: gerenciador de senhas
- Última rotação: 2026-07-19

Nunca armazenar:

- senha;
- access key secreta;
- token;
- chave privada;
- segredo JWT;
- token de webhook.

## Alertas necessários

O ERP deve gerar alertas para:

- serviço crítico sem responsável;
- serviço pago sem valor estimado;
- serviço com renovação próxima;
- serviço trial perto de expirar;
- serviço com cobrança acima do esperado;
- serviço ativo sem uso declarado;
- serviço com credencial antiga;
- serviço crítico sem plano de contingência.

## Relatórios

Relatórios mínimos:

- custo mensal por serviço;
- custo mensal por categoria;
- custo mensal por ambiente;
- custo de produção;
- custo de desenvolvimento;
- serviços críticos;
- serviços pagos;
- serviços gratuitos;
- serviços em trial;
- serviços a renovar;
- variação de custo mês a mês.

## Serviços iniciais recomendados para cadastro

| Serviço | Categoria | Ambiente | Criticidade | Observação |
|---|---|---|---|---|
| Registro.br | domínio | produção | crítica | domínio principal |
| Cloudflare | DNS | produção | crítica | DNS e SSL |
| Vercel Client | hospedagem | produção | alta | frontend público |
| Vercel Admin/ERP | hospedagem | produção | alta | painel interno |
| Render Backend | hospedagem | produção | crítica | API principal |
| Railway MySQL | banco de dados | produção | crítica | banco principal |
| AWS S3 | armazenamento | produção | alta | imagens e documentos |
| AWS IAM | segurança | produção | alta | permissões S3 |
| Upstash | infraestrutura | produção | média | rate limit |
| Asaas | pagamento | produção | crítica | cobranças |
| Resend | e-mail | produção | alta | e-mails transacionais |
| UptimeRobot | monitoramento | produção | média | health checks |
| GitHub | desenvolvimento | todos | alta | código fonte |

## MVP do módulo

A primeira versão deve permitir:

- cadastrar serviço;
- editar serviço;
- listar serviços;
- filtrar por categoria;
- filtrar por ambiente;
- filtrar por criticidade;
- registrar valor previsto;
- registrar data de renovação;
- vincular serviço a conta a pagar;
- ver custo mensal total;
- ver serviços críticos;
- ver serviços próximos da renovação.

## Evolução futura

Depois do MVP:

- importar cobranças AWS por CSV;
- importar faturas de cartão;
- detectar variação de custo;
- sugerir cancelamento de serviços sem uso;
- alertar sobre aumento anormal;
- comparar custo previsto vs custo real;
- gerar relatório mensal de infraestrutura.
