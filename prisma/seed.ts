import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const empresa = await prisma.erpEmpresa.upsert({
    where: { id: 1 },
    update: {},
    create: {
      razaoSocial: "NossoZelo MEI",
      nomeFantasia: "NossoZelo",
      tipoEmpresa: "MEI",
      regimeTributario: "SIMEI",
      emailPrincipal: "admin@nossozelo.com.br",
      status: "ativa",
    },
  });

  await prisma.erpUsuarioInterno.upsert({
    where: { email: "admin@nossozelo.com.br" },
    update: {},
    create: {
      nome: "Fundador NossoZelo",
      email: "admin@nossozelo.com.br",
      senhaHash: await hash("admin123", 10),
      perfil: "FUNDADOR",
      status: "ATIVO",
    },
  });

  const categorias = [
    ["Assinaturas", "RECEITA"],
    ["Comissões", "RECEITA"],
    ["Serviços avulsos", "RECEITA"],
    ["Reembolsos", "RECEITA"],
    ["Infraestrutura", "DESPESA"],
    ["Domínio", "DESPESA"],
    ["Banco de dados", "DESPESA"],
    ["Servidor", "DESPESA"],
    ["Armazenamento", "DESPESA"],
    ["E-mail", "DESPESA"],
    ["Marketing", "DESPESA"],
    ["Ferramentas", "DESPESA"],
    ["Impostos", "DESPESA"],
    ["Contabilidade", "DESPESA"],
    ["Taxas de pagamento", "DESPESA"],
    ["Jurídico", "DESPESA"],
    ["Suporte", "DESPESA"],
    ["Outros", "AMBOS"],
  ] as const;

  for (const [nome, tipo] of categorias) {
    const exists = await prisma.erpCategoriaFinanceira.findFirst({ where: { nome } });
    if (!exists) {
      await prisma.erpCategoriaFinanceira.create({ data: { nome, tipo, ativo: true } });
    }
  }

  const servicos = [
    ["Registro.br", "Registro.br", "domínio", "producao", "CRITICA"],
    ["Cloudflare DNS", "Cloudflare", "DNS", "producao", "CRITICA"],
    ["Vercel Admin/ERP", "Vercel", "hospedagem", "producao", "ALTA"],
    ["Render Backend", "Render", "hospedagem", "producao", "CRITICA"],
    ["Railway PostgreSQL", "Railway", "banco de dados", "producao", "CRITICA"],
    ["AWS S3", "AWS", "armazenamento", "producao", "ALTA"],
    ["AWS IAM", "AWS", "segurança", "producao", "ALTA"],
    ["Upstash", "Upstash", "infraestrutura", "producao", "MEDIA"],
    ["Asaas", "Asaas", "pagamento", "producao", "CRITICA"],
    ["Resend", "Resend", "e-mail", "producao", "ALTA"],
    ["UptimeRobot", "UptimeRobot", "monitoramento", "producao", "MEDIA"],
    ["GitHub", "GitHub", "desenvolvimento", "todos", "ALTA"],
  ] as const;

  await prisma.erpServicoContratado.updateMany({
    where: { fornecedor: "Railway", categoria: "banco de dados" },
    data: { nome: "Railway PostgreSQL" },
  });

  for (const [nome, fornecedor, categoria, ambiente, criticidade] of servicos) {
    const exists = await prisma.erpServicoContratado.findFirst({ where: { nome } });
    if (!exists) {
      await prisma.erpServicoContratado.create({
        data: {
          empresaId: empresa.id,
          nome,
          fornecedor,
          categoria,
          ambiente,
          criticidade,
          status: "ativo",
          moeda: "BRL",
          periodicidade: "mensal",
          responsavelInterno: "Fundador",
          possuiCredenciais: ["AWS S3", "AWS IAM", "Asaas", "GitHub"].includes(nome),
          localCredenciais: ["AWS S3", "AWS IAM", "Asaas", "GitHub"].includes(nome)
            ? "Gerenciador de senhas"
            : null,
        },
      });
    }
  }

  const cliente = await prisma.marketplaceCliente.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: "Cliente Piloto",
      email: "cliente@exemplo.com",
      telefone: "(11) 99999-0000",
      cidade: "São Paulo",
      estado: "SP",
      status: "ativo",
    },
  });

  const prestador = await prisma.marketplacePrestador.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: "Prestador Piloto",
      tipoPrestador: "Cuidador",
      email: "prestador@exemplo.com",
      cidade: "São Paulo",
      estado: "SP",
      statusCadastro: "aprovado",
      statusAssinatura: "ativa",
      documentosStatus: "validado",
      avaliacaoMedia: 4.8,
    },
  });

  await prisma.marketplaceAssinatura.upsert({
    where: { id: 1 },
    update: {},
    create: {
      prestadorId: prestador.id,
      plano: "Profissional",
      status: "ativa",
      valor: 59.9,
      gateway: "Asaas",
      vencimento: new Date(),
      proximaCobranca: new Date(Date.now() + 30 * 86400000),
      observacoes: `Assinatura vinculada ao cliente piloto ${cliente.nome}.`,
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
