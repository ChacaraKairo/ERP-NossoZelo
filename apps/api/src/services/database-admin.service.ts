import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

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

  private hasMultipleStatements(sql: string) {
    const normalized = sql.replace(/;+\s*$/, "");
    return normalized.includes(";");
  }

  private fields(rows: Record<string, unknown>[]) {
    const first = rows[0];
    return first ? Object.keys(first) : [];
  }
}
