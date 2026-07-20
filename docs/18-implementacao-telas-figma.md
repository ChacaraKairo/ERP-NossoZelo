# Implementação das Telas Baseadas no Figma

## Objetivo

Este documento registra a primeira implementação navegável das telas do ERP NossoZelo baseada no protótipo criado no Figma.

A implementação não substitui o backend real nem o banco de dados. Ela cria uma base visual e estrutural para o desenvolvimento do produto.

## Stack criada

- Next.js
- React
- TypeScript
- CSS global com tokens visuais
- Lucide React para ícones
- Rotas dinâmicas via `app/[[...slug]]/page.tsx`

## Identidade visual aplicada

A UI usa a identidade visual da logo NossoZelo:

- turquesa como cor principal;
- tema claro com fundo branco/esverdeado suave;
- tema escuro com azul-petróleo/preto esverdeado;
- cards arredondados;
- sidebar administrativa;
- topbar com busca;
- chips de status;
- tabelas e formulários padronizados;
- botão de alternância claro/escuro.

## Arquivos principais

```text
package.json
next.config.mjs
tsconfig.json
app/layout.tsx
app/globals.css
app/theme.css
app/[[...slug]]/page.tsx
```

## Telas implementadas como rotas navegáveis

```text
/login
/dashboard
/alertas
/calendario
/financeiro
/financeiro/lancamentos
/financeiro/lancamentos/novo
/financeiro/contas-a-pagar
/financeiro/contas-a-pagar/nova
/financeiro/contas-a-receber
/servicos-contratados
/servicos-contratados/novo
/fornecedores
/fiscal
/fiscal/obrigacoes
/fiscal/notas-fiscais
/marketplace/clientes
/marketplace/prestadores
/marketplace/assinaturas
/suporte/chamados
/suporte/chamados/novo
/tarefas
/relatorios/custos-infraestrutura
/planejamento/mensal
/fechamento-mensal
/cofre-referencias
/riscos
/decisoes
/base-conhecimento
/auditoria
/configuracoes
```

## Como rodar localmente

```bash
npm install
npm run dev
```

Depois acessar:

```text
http://localhost:3000
```

## Próximos passos técnicos

1. Separar componentes em arquivos próprios:
   - `Sidebar`
   - `Topbar`
   - `MetricCard`
   - `DataTable`
   - `StatusChip`
   - `FormSection`
   - `ThemeToggle`

2. Criar camada de dados mockados organizada:
   - `data/screens.ts`
   - `data/financeiro.ts`
   - `data/servicos.ts`
   - `data/fiscal.ts`

3. Implementar persistência real:
   - Prisma
   - MySQL
   - migrations
   - seeds

4. Criar autenticação administrativa.

5. Substituir tabelas mockadas por dados reais.

6. Criar testes de build e lint no CI.

## Observação

Esta entrega é uma base visual e navegável para acelerar o desenvolvimento. O próximo passo é transformar os blocos genéricos em componentes reutilizáveis e conectar cada módulo ao modelo de dados documentado no repositório.
