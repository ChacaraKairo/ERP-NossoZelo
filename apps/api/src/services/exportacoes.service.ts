import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { homedir } from "node:os";
import { promisify } from "node:util";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

const execFileAsync = promisify(execFile);
const currentBackupFolder = "ERP-NossoZelo-backup-atual";

@Injectable()
export class ExportacoesService {
  constructor(private readonly prisma: PrismaService) {}

  async ultimoBackup() {
    return this.prisma.erpBackupRegistro.findFirst({ orderBy: { criadoEm: "desc" } });
  }

  async registrarBackup(geradoPorId?: number) {
    const empresaId = await this.getDefaultEmpresaId();
    return this.prisma.erpBackupRegistro.create({
      data: {
        empresaId,
        tipo: "manual",
        formato: "json_csv",
        descricao: "Backup manual registrado pelo ERP NossoZelo",
        geradoPorId,
      },
    });
  }

  async backupLocal(destino: string | undefined, geradoPorId?: number) {
    const empresaId = await this.getDefaultEmpresaId();
    const mountPoint = await this.resolveBackupDestination(destino);
    const stamp = this.timestamp();
    const tempDir = join(mountPoint, `ERP-NossoZelo-backup-novo-${stamp}`);
    const currentDir = join(mountPoint, currentBackupFolder);
    const oldDir = join(mountPoint, `ERP-NossoZelo-backup-antigo-${stamp}`);

    await mkdir(tempDir, { recursive: true });
    const sqlFile = `erp-nossozelo-${stamp}.sql`;
    const dumpFile = `erp-nossozelo-${stamp}.dump`;
    const jsonFile = `erp-nossozelo-${stamp}.json`;
    const financeiroFile = `financeiro-${stamp}.csv`;
    const contasPagarFile = `contas-a-pagar-${stamp}.csv`;

    await Promise.all([
      this.writePgDump(join(tempDir, sqlFile), ["--clean", "--if-exists"]),
      this.writePgDump(join(tempDir, dumpFile), ["-Fc"]),
      writeFile(join(tempDir, jsonFile), `${JSON.stringify(await this.dadosJson(), null, 2)}\n`),
      writeFile(join(tempDir, financeiroFile), await this.financeiroCsv()),
      writeFile(join(tempDir, contasPagarFile), await this.contasPagarCsv()),
      writeFile(join(tempDir, "schema.prisma"), await readFile("prisma/schema.prisma", "utf8")),
      writeFile(join(tempDir, "contagens.txt"), await this.contagens()),
    ]);

    await writeFile(
      join(tempDir, "README-backup.txt"),
      this.backupReadme({ stamp, sqlFile, dumpFile, jsonFile, financeiroFile, contasPagarFile }),
    );
    await this.writeChecksums(tempDir);
    await this.validateBackup(tempDir, [sqlFile, dumpFile, jsonFile, financeiroFile, contasPagarFile, "schema.prisma", "contagens.txt", "README-backup.txt", "sha256sums.txt"]);

    let movedOld = false;
    try {
      if (existsSync(currentDir)) {
        await rename(currentDir, oldDir);
        movedOld = true;
      }
      await rename(tempDir, currentDir);
      if (movedOld) await rm(oldDir, { recursive: true, force: true });
    } catch (error) {
      if (movedOld && !existsSync(currentDir) && existsSync(oldDir)) {
        await rename(oldDir, currentDir);
      }
      throw error;
    }

    const totalBytes = await this.dirSize(currentDir);
    return this.prisma.erpBackupRegistro.create({
      data: {
        empresaId,
        tipo: "local",
        formato: "sql_dump_json_csv",
        descricao: `Backup completo em ${currentDir}`,
        tamanhoBytes: totalBytes,
        geradoPorId,
      },
    });
  }

  async destinosBackup() {
    const roots = [
      join("/run/media", process.env.USER ?? ""),
      join("/media", process.env.USER ?? ""),
      "/mnt",
    ];
    const destinos: { label: string; path: string }[] = [];
    for (const root of roots) {
      if (!existsSync(root)) continue;
      for (const entry of await readdir(root, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          const path = join(root, entry.name);
          destinos.push({ label: entry.name, path });
        }
      }
    }
    return destinos;
  }

  async navegarPastas(path?: string) {
    if (!path) {
      const destinos = await this.destinosBackup();
      const home = homedir();
      return {
        currentPath: "",
        parentPath: null,
        folders: [
          { label: "Pasta pessoal", path: home },
          ...destinos,
        ],
      };
    }

    const currentPath = resolve(path);
    if (!existsSync(currentPath) || !(await stat(currentPath)).isDirectory()) {
      throw new Error(`Pasta não encontrada: ${currentPath}`);
    }

    const entries = await readdir(currentPath, { withFileTypes: true });
    const folders = entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map((entry) => ({ label: entry.name, path: join(currentPath, entry.name) }))
      .sort((a, b) => a.label.localeCompare(b.label));
    const parentPath = dirname(currentPath) === currentPath ? null : dirname(currentPath);

    return { currentPath, parentPath, folders };
  }

  async dadosJson() {
    const empresaId = await this.getDefaultEmpresaId();
    const [
      empresa,
      categorias,
      lancamentos,
      contasPagar,
      contasReceber,
      servicos,
      obrigacoes,
      notas,
      fornecedores,
      gastosFixos,
      chamados,
      tarefas,
      riscos,
      decisoes,
      fechamentos,
    ] = await Promise.all([
      this.prisma.erpEmpresa.findUnique({ where: { id: empresaId } }),
      this.prisma.erpCategoriaFinanceira.findMany({ orderBy: { nome: "asc" } }),
      this.prisma.erpLancamentoFinanceiro.findMany({ where: { empresaId, excluidoEm: null }, orderBy: { dataCompetencia: "desc" } }),
      this.prisma.erpContaPagar.findMany({ where: { empresaId, excluidoEm: null }, orderBy: { dataVencimento: "asc" } }),
      this.prisma.erpContaReceber.findMany({ where: { empresaId, excluidoEm: null }, orderBy: { dataVencimento: "asc" } }),
      this.prisma.erpServicoContratado.findMany({ where: { empresaId, excluidoEm: null }, orderBy: { nome: "asc" } }),
      this.prisma.erpObrigacaoFiscal.findMany({ where: { empresaId, excluidoEm: null }, orderBy: { dataVencimento: "asc" } }),
      this.prisma.erpNotaFiscal.findMany({ where: { empresaId, excluidoEm: null }, orderBy: { dataCompetencia: "desc" } }),
      this.prisma.erpFornecedor.findMany({ where: { empresaId, excluidoEm: null }, orderBy: { nome: "asc" } }),
      this.prisma.erpGastoFixo.findMany({ where: { empresaId, excluidoEm: null }, orderBy: [{ ativo: "desc" }, { diaVencimento: "asc" }] }),
      this.prisma.erpChamado.findMany({ where: { excluidoEm: null }, orderBy: { dataAbertura: "desc" } }),
      this.prisma.erpTarefa.findMany({ where: { excluidoEm: null }, orderBy: { criadoEm: "desc" } }),
      this.prisma.erpRisco.findMany({ where: { excluidoEm: null }, orderBy: { atualizadoEm: "desc" } }),
      this.prisma.erpDecisao.findMany({ where: { excluidoEm: null }, orderBy: { dataDecisao: "desc" } }),
      this.prisma.erpFechamentoMensal.findMany({ where: { empresaId }, orderBy: [{ ano: "desc" }, { mes: "desc" }] }),
    ]);

    return {
      metadata: {
        sistema: "ERP NossoZelo",
        formato: "json",
        geradoEm: new Date().toISOString(),
      },
      empresa,
      categorias,
      lancamentos,
      contasPagar,
      contasReceber,
      servicos,
      obrigacoes,
      notas,
      fornecedores,
      gastosFixos,
      chamados,
      tarefas,
      riscos,
      decisoes,
      fechamentos,
    };
  }

  async financeiroCsv(mes?: string) {
    const empresaId = await this.getDefaultEmpresaId();
    const dateFilter = this.dateFilter(mes);
    const lancamentos = await this.prisma.erpLancamentoFinanceiro.findMany({
      where: { empresaId, excluidoEm: null, ...(dateFilter ? { dataCompetencia: dateFilter } : {}) },
      include: { categoria: true },
      orderBy: { dataCompetencia: "asc" },
    });

    return this.toCsv(
      ["id", "tipo", "categoria", "descricao", "valorBruto", "valorTaxas", "valorLiquido", "dataCompetencia", "status", "origem"],
      lancamentos.map((item: any) => [
        item.id,
        item.tipo,
        item.categoria?.nome,
        item.descricao,
        item.valorBruto,
        item.valorTaxas,
        item.valorLiquido,
        item.dataCompetencia,
        item.status,
        item.origem,
      ]),
    );
  }

  async contasPagarCsv() {
    const empresaId = await this.getDefaultEmpresaId();
    const contas = await this.prisma.erpContaPagar.findMany({
      where: { empresaId, excluidoEm: null },
      include: { categoria: true, servicoContratado: true },
      orderBy: { dataVencimento: "asc" },
    });

    return this.toCsv(
      ["id", "descricao", "fornecedor", "categoria", "servico", "valorPrevisto", "valorPago", "dataVencimento", "dataPagamento", "status"],
      contas.map((item: any) => [
        item.id,
        item.descricao,
        item.fornecedor,
        item.categoria?.nome,
        item.servicoContratado?.nome,
        item.valorPrevisto,
        item.valorPago,
        item.dataVencimento,
        item.dataPagamento,
        item.status,
      ]),
    );
  }

  private toCsv(headers: string[], rows: unknown[][]) {
    const lines = [headers, ...rows].map((row) => row.map((value) => this.csvCell(value)).join(","));
    return `${lines.join("\n")}\n`;
  }

  private csvCell(value: unknown) {
    if (value === null || value === undefined) return "";
    const normalized = value instanceof Date ? value.toISOString() : String(value);
    return `"${normalized.replaceAll('"', '""')}"`;
  }

  private dateFilter(mes?: string) {
    if (!mes) return null;
    const [year, month] = mes.split("-").map(Number);
    if (!year || !month) return null;
    return { gte: new Date(year, month - 1, 1), lt: new Date(year, month, 1) };
  }

  private async getDefaultEmpresaId() {
    const empresa = await this.prisma.erpEmpresa.findFirst({ select: { id: true } });
    if (empresa) return empresa.id;
    const created = await this.prisma.erpEmpresa.create({
      data: { razaoSocial: "NossoZelo", nomeFantasia: "NossoZelo", tipoEmpresa: "MEI", regimeTributario: "SIMEI", status: "ativa" },
      select: { id: true },
    });
    return created.id;
  }

  private async resolveBackupDestination(destino: string | undefined) {
    const normalized = destino?.trim();
    if (!normalized) throw new Error("Informe a pasta onde o backup deve ser salvo.");
    if (!existsSync(normalized) || !(await stat(normalized)).isDirectory()) {
      throw new Error(`Pasta de backup não encontrada: ${normalized}`);
    }
    const probe = join(normalized, `.erp-nossozelo-write-test-${Date.now()}`);
    await writeFile(probe, "ok");
    await rm(probe);
    return normalized;
  }

  private async writePgDump(outputPath: string, extraArgs: string[]) {
    const args = ["compose", "exec", "-T", "postgres", "pg_dump", "-U", "erp_nossozelo", "-d", "erp_nossozelo", ...extraArgs];
    const { stdout } = await execFileAsync("docker", args, { encoding: "buffer", maxBuffer: 1024 * 1024 * 100 });
    await writeFile(outputPath, stdout);
  }

  private async contagens() {
    const [
      empresas,
      usuarios,
      categorias,
      servicos,
      gastosFixos,
      contasPagar,
      contasReceber,
      lancamentos,
      auditoria,
    ] = await Promise.all([
      this.prisma.erpEmpresa.count(),
      this.prisma.erpUsuarioInterno.count(),
      this.prisma.erpCategoriaFinanceira.count(),
      this.prisma.erpServicoContratado.count(),
      this.prisma.erpGastoFixo.count(),
      this.prisma.erpContaPagar.count(),
      this.prisma.erpContaReceber.count(),
      this.prisma.erpLancamentoFinanceiro.count(),
      this.prisma.erpAuditoria.count(),
    ]);
    return [
      `empresas=${empresas}`,
      `usuarios=${usuarios}`,
      `categorias=${categorias}`,
      `servicos=${servicos}`,
      `gastos_fixos=${gastosFixos}`,
      `contas_pagar=${contasPagar}`,
      `contas_receber=${contasReceber}`,
      `lancamentos=${lancamentos}`,
      `auditoria=${auditoria}`,
      "",
    ].join("\n");
  }

  private backupReadme(files: Record<string, string>) {
    return [
      "Backup ERP NossoZelo",
      `Gerado em: ${new Date().toISOString()}`,
      "Destino escolhido pelo usuário no ERP.",
      "",
      "Este backup substitui sempre a pasta anterior depois que a nova versão é criada e validada.",
      "",
      "Arquivos:",
      `- ${files.sqlFile}: dump SQL completo`,
      `- ${files.dumpFile}: dump custom para pg_restore`,
      `- ${files.jsonFile}: exportação JSON consultável`,
      `- ${files.financeiroFile}: lançamentos financeiros em CSV`,
      `- ${files.contasPagarFile}: contas a pagar em CSV`,
      "- schema.prisma: schema da aplicação no momento do backup",
      "- contagens.txt: contagens principais",
      "- sha256sums.txt: checksums dos arquivos",
      "",
      "Restaurar SQL local:",
      `docker compose exec -T postgres psql -U erp_nossozelo -d erp_nossozelo < ${files.sqlFile}`,
      "",
      "Restaurar dump custom local:",
      `docker compose exec -T postgres pg_restore -U erp_nossozelo -d erp_nossozelo --clean --if-exists < ${files.dumpFile}`,
      "",
    ].join("\n");
  }

  private async writeChecksums(dir: string) {
    const files = (await readdir(dir)).filter((file) => file !== "sha256sums.txt").sort();
    const lines = await Promise.all(files.map(async (file) => `${createHash("sha256").update(await readFile(join(dir, file))).digest("hex")}  ${file}`));
    await writeFile(join(dir, "sha256sums.txt"), `${lines.join("\n")}\n`);
  }

  private async validateBackup(dir: string, files: string[]) {
    for (const file of files) {
      const fileStat = await stat(join(dir, file));
      if (!fileStat.isFile() || fileStat.size === 0) throw new Error(`Arquivo de backup inválido: ${file}`);
    }
  }

  private async dirSize(dir: string): Promise<number> {
    const entries = await readdir(dir, { withFileTypes: true });
    const sizes = await Promise.all(entries.map(async (entry) => {
      const path = join(dir, entry.name);
      return entry.isDirectory() ? this.dirSize(path) : (await stat(path)).size;
    }));
    return sizes.reduce((sum, size) => sum + size, 0);
  }

  private timestamp() {
    return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
  }
}
