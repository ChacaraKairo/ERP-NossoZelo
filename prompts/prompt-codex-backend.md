# Prompt Codex — Backend

```text
Você está implementando o backend do ERP-NossoZelo.

Leia antes:
- README.md
- docs/03-escopo-mvp.md
- docs/05-regras-de-negocio.md
- docs/06-modelo-de-dados.md
- docs/08-perfis-e-permissoes.md

Objetivo:
Criar a base backend do ERP com foco no MVP.

Prioridades:
1. Schema de banco.
2. Migrations funcionando em banco limpo.
3. Seeds de categorias financeiras e serviços iniciais.
4. CRUD de serviços contratados.
5. CRUD financeiro básico.
6. CRUD de contas a pagar e receber.
7. CRUD fiscal/MEI.
8. CRUD de chamados.
9. CRUD de tarefas.
10. Auditoria de ações críticas.

Regras:
- Use TypeScript.
- Use validação de entrada.
- Não armazene segredos em texto aberto.
- Não crie permissões amplas sem necessidade.
- Não remova registros críticos fisicamente; use exclusão lógica.
- Toda alteração sensível deve gerar auditoria.
- Serviços contratados devem poder gerar contas a pagar.

Critérios de aceite:
- lint passando;
- build passando;
- migrations passam em banco limpo;
- seeds executam sem erro;
- endpoints principais documentados;
- testes básicos para regras críticas.
```
