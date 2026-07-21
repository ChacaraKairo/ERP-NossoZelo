import { BadRequestException, Injectable } from "@nestjs/common";
import PDFDocument from "pdfkit";
import { PrismaService } from "./prisma.service";
import type { RequestUser } from "../common/types/request-user";

const blockedSql = /\b(drop|truncate|alter|create|grant|revoke|vacuum|copy|execute|prepare|deallocate)\b/i;
const writeSql = /^(insert|update|delete)\b/i;
const readSql = /^(select|with|show)\b/i;

@Injectable()
export class DatabaseAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(sqlInput: string, confirmation?: string) {
    const sql = sqlInput.trim();
    if (!sql) throw new BadRequestException("SQL obrigatório");
    if (this.hasMultipleStatements(sql)) throw new BadRequestException("Execute apenas um comando por vez");
    if (blockedSql.test(sql)) throw new BadRequestException("Comando bloqueado para proteger a estrutura do banco");

    if (readSql.test(sql)) {
      const rows = await this.prisma.$queryRawUnsafe<Record<string, unknown>[]>(sql);
      return { mode: "read", rowCount: rows.length, rows: rows.slice(0, 200), fields: this.fields(rows) };
    }

    if (writeSql.test(sql)) {
      if (confirmation !== "EXECUTAR") throw new BadRequestException("Digite EXECUTAR para confirmar comandos que alteram dados");
      const affectedRows = await this.prisma.$executeRawUnsafe(sql);
      return { mode: "write", affectedRows, rows: [], fields: [] };
    }

    throw new BadRequestException("Comando permitido: SELECT, WITH, SHOW, INSERT, UPDATE ou DELETE");
  }

  async pdf(sqlInput: string, user?: RequestUser) {
    const result = await this.execute(sqlInput);
    if (result.mode !== "read") throw new BadRequestException("PDF disponível apenas para consultas");
    return this.buildPdf(sqlInput.trim(), result.fields, result.rows, result.rowCount ?? result.rows.length, user);
  }

  private buildPdf(sql: string, fields: string[], rows: Record<string, unknown>[], rowCount: number, user?: RequestUser) {
    return new Promise<Buffer>((resolve) => {
      const doc = new PDFDocument({ size: "A4", margin: 42, bufferPages: true });
      const chunks: Buffer[] = [];
      const generatedAt = new Date();
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      doc.rect(0, 0, 595.28, 108).fill("#10231f");
      doc.circle(66, 48, 20).fill("#d9f2df");
      doc.fillColor("#10231f").fontSize(14).font("Helvetica-Bold").text("NZ", 55, 41);
      doc.fillColor("#f7faf9").fontSize(22).font("Helvetica-Bold").text("Resultado SQL", 96, 34);
      doc.fontSize(10).font("Helvetica").fillColor("#c9d9d3").text(`ERP NossoZelo · ${dateTimeBR(generatedAt)}`, 96, 64);
      doc.text(`Gerado por ${user?.nome ?? "usuário autenticado"}`, 96, 80);
      doc.y = 128;

      this.section(doc, "Consulta executada");
      doc.roundedRect(42, doc.y, 511, 70, 6).fillAndStroke("#f6f7f9", "#d9e0e8");
      doc.fillColor("#17202a").fontSize(8).font("Courier").text(sql, 52, doc.y + 10, { width: 491, height: 50, ellipsis: true });
      doc.y += 88;

      doc.roundedRect(42, doc.y, 160, 52, 6).fillAndStroke("#eef4f1", "#c9d9d3");
      doc.fillColor("#64748b").fontSize(8).font("Helvetica-Bold").text("LINHAS RETORNADAS", 52, doc.y + 10);
      doc.fillColor("#0f4c43").fontSize(16).font("Helvetica-Bold").text(String(rowCount), 52, doc.y + 28);
      doc.y += 72;

      this.section(doc, "Resultado");
      if (!rows.length || !fields.length) {
        doc.fillColor("#64748b").fontSize(10).font("Helvetica").text("Nenhum registro encontrado.");
      } else {
        this.table(doc, fields, rows.slice(0, 100));
        if (rowCount > 100) {
          doc.moveDown(0.5);
          doc.fillColor("#64748b").fontSize(9).font("Helvetica").text(`Exibindo 100 de ${rowCount} linhas.`);
        }
      }

      this.footer(doc, generatedAt);
      doc.end();
    });
  }

  private section(doc: PDFKit.PDFDocument, title: string) {
    this.ensureSpace(doc, 34);
    doc.fillColor("#17202a").fontSize(14).font("Helvetica-Bold").text(title);
    doc.moveDown(0.6);
  }

  private table(doc: PDFKit.PDFDocument, fields: string[], rows: Record<string, unknown>[]) {
    const contentWidth = 511;
    const visibleFields = fields.slice(0, 6);
    const colWidth = contentWidth / visibleFields.length;
    this.row(doc, visibleFields, colWidth, true);
    rows.forEach((row, index) => this.row(doc, visibleFields.map((field) => formatCell(row[field])), colWidth, false, index % 2 === 0));
  }

  private row(doc: PDFKit.PDFDocument, values: unknown[], colWidth: number, header = false, shaded = false) {
    const rowHeight = header ? 26 : 34;
    this.ensureSpace(doc, rowHeight + 10);
    const y = doc.y;
    doc.rect(42, y, 511, rowHeight).fill(header ? "#166b5b" : shaded ? "#f6f7f9" : "#ffffff");
    doc.strokeColor("#d9e0e8").rect(42, y, 511, rowHeight).stroke();
    values.forEach((value, index) => {
      doc.fillColor(header ? "#ffffff" : "#17202a").fontSize(header ? 8 : 7.3).font(header ? "Helvetica-Bold" : "Helvetica");
      doc.text(String(value ?? "-"), 47 + index * colWidth, y + 7, { width: colWidth - 8, height: rowHeight - 10, ellipsis: true });
    });
    doc.y = y + rowHeight;
  }

  private ensureSpace(doc: PDFKit.PDFDocument, height: number) {
    if (doc.y + height <= 780) return;
    this.footer(doc, new Date());
    doc.addPage();
  }

  private footer(doc: PDFKit.PDFDocument, generatedAt: Date) {
    doc.fillColor("#64748b").fontSize(8).font("Helvetica");
    doc.text("Documento gerado pelo ERP NossoZelo", 42, 798, { width: 220, lineBreak: false });
    doc.text(dateTimeBR(generatedAt), 333, 798, { width: 220, align: "right", lineBreak: false });
  }

  private hasMultipleStatements(sql: string) {
    const normalized = sql.replace(/;+\s*$/, "");
    return normalized.includes(";");
  }

  private fields(rows: Record<string, unknown>[]) {
    const first = rows[0];
    return first ? Object.keys(first) : [];
  }
}

function formatCell(value: unknown) {
  if (value === null || value === undefined) return "-";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  return text.length > 90 ? `${text.slice(0, 87)}...` : text;
}

function dateTimeBR(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(value);
}
