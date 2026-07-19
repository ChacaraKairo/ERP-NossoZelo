# Perfis e Permissões

## Objetivo

Definir os perfis de acesso do ERP NossoZelo e quais ações cada perfil pode executar.

## Princípios

1. Permissão mínima necessária.
2. Ações sensíveis devem ser auditadas.
3. Dados financeiros e fiscais devem ter acesso restrito.
4. Documentos privados não devem ser acessados por todos.
5. O fundador deve ter controle total no início.
6. O ERP deve estar preparado para equipe futura.

## Perfis iniciais

### 1. Fundador / Gestor

Perfil máximo do sistema.

Permissões:

- acessar dashboard completo;
- gerenciar financeiro;
- gerenciar contas a pagar;
- gerenciar contas a receber;
- gerenciar serviços contratados;
- gerenciar obrigações MEI;
- gerenciar notas fiscais;
- acessar relatórios;
- acessar auditoria;
- gerenciar usuários internos;
- acessar documentos privados;
- configurar integrações;
- alterar permissões.

### 2. Financeiro

Perfil para pessoa responsável por caixa, contas e obrigações.

Permissões:

- acessar dashboard financeiro;
- criar e editar lançamentos;
- criar e editar contas a pagar;
- criar e editar contas a receber;
- registrar pagamentos;
- registrar recebimentos;
- anexar comprovantes;
- ver serviços contratados;
- registrar cobranças de serviços;
- gerenciar obrigações MEI;
- registrar notas fiscais;
- gerar relatórios financeiros.

Restrições:

- não altera permissões;
- não acessa configurações sensíveis;
- não visualiza segredos;
- não exclui dados críticos definitivamente.

### 3. Operação / Admin Marketplace

Perfil para operação do NossoZelo.

Permissões:

- visualizar clientes;
- visualizar prestadores;
- visualizar assinaturas;
- registrar observações operacionais;
- criar chamados;
- atualizar chamados;
- criar tarefas internas;
- visualizar pendências do marketplace.

Restrições:

- não gerencia financeiro completo;
- não gerencia fiscal;
- não gerencia serviços contratados críticos;
- não acessa comprovantes financeiros sensíveis.

### 4. Suporte

Perfil para atendimento.

Permissões:

- criar chamados;
- responder chamados;
- alterar status de chamados;
- consultar dados básicos de clientes e prestadores;
- registrar interações;
- encaminhar chamados.

Restrições:

- não acessa financeiro;
- não acessa fiscal;
- não acessa auditoria completa;
- não altera assinaturas diretamente;
- não acessa documentos privados salvo autorização específica.

### 5. Leitura / Consulta

Perfil somente leitura.

Permissões:

- visualizar dashboard limitado;
- visualizar relatórios permitidos;
- visualizar dados sem editar.

Restrições:

- não cria;
- não edita;
- não exclui;
- não acessa dados sensíveis por padrão.

## Permissões por módulo

| Módulo | Fundador | Financeiro | Operação | Suporte | Leitura |
|---|---|---|---|---|---|
| Dashboard completo | Sim | Parcial | Parcial | Parcial | Parcial |
| Financeiro | Sim | Sim | Não | Não | Parcial |
| Contas a pagar | Sim | Sim | Não | Não | Parcial |
| Contas a receber | Sim | Sim | Parcial | Não | Parcial |
| Serviços contratados | Sim | Parcial | Parcial | Não | Parcial |
| Fiscal/MEI | Sim | Sim | Não | Não | Parcial |
| Notas fiscais | Sim | Sim | Não | Não | Parcial |
| Clientes | Sim | Parcial | Sim | Parcial | Parcial |
| Prestadores | Sim | Parcial | Sim | Parcial | Parcial |
| Assinaturas | Sim | Parcial | Sim | Parcial | Parcial |
| Suporte | Sim | Parcial | Sim | Sim | Parcial |
| Tarefas | Sim | Sim | Sim | Sim | Parcial |
| Auditoria | Sim | Não | Não | Não | Não |
| Configurações | Sim | Não | Não | Não | Não |

## Ações que exigem auditoria

- login administrativo;
- alteração de permissão;
- alteração financeira;
- marcação de conta como paga;
- exclusão lógica;
- alteração de serviço contratado crítico;
- alteração de obrigação fiscal;
- acesso a documento privado;
- bloqueio de prestador;
- liberação de prestador;
- alteração de assinatura;
- reprocessamento de pagamento ou webhook.

## Regras de segurança

1. Nunca exibir segredos de produção no ERP.
2. Nunca armazenar access keys, tokens ou senhas em texto aberto.
3. O ERP pode registrar onde uma credencial está armazenada, mas não seu valor.
4. Toda ação crítica deve registrar usuário, data, IP e entidade afetada.
5. Perfis devem ser expansíveis para equipe futura.
