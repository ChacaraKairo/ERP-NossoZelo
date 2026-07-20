import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./prisma.service";
import { sanitizeForAudit } from "../common/utils/sanitize-for-audit";

type AuditInput = {
  requestId?: string | null;
  sessionId?: string | null;
  deviceId?: string | null;
  usuarioId?: number | null;
  acao: string;
  modulo?: string | null;
  entidadeTipo: string;
  entidadeId?: number | null;
  metodoHttp?: string | null;
  rota?: string | null;
  dadosAnteriores?: unknown;
  dadosNovos?: unknown;
  diff?: unknown;
  motivo?: string | null;
  resultado?: string;
  severidade?: string;
  ip?: string | null;
  userAgent?: string | null;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: AuditInput) {
    return this.prisma.erpAuditoria.create({
      data: {
      requestId: input.requestId ?? null,
      sessionId: input.sessionId ?? null,
      deviceId: input.deviceId ?? null,
      usuarioId: input.usuarioId ?? null,
      acao: input.acao,
      modulo: input.modulo ?? null,
      entidadeTipo: input.entidadeTipo,
      entidadeId: input.entidadeId ?? null,
      metodoHttp: input.metodoHttp ?? null,
      rota: input.rota ?? null,
      dadosAnteriores: input.dadosAnteriores ? (sanitizeForAudit(input.dadosAnteriores) as Prisma.InputJsonValue) : undefined,
      dadosNovos: input.dadosNovos ? (sanitizeForAudit(input.dadosNovos) as Prisma.InputJsonValue) : undefined,
      diff: input.diff ? (sanitizeForAudit(input.diff) as Prisma.InputJsonValue) : undefined,
      motivo: input.motivo ?? null,
      resultado: input.resultado ?? "sucesso",
      severidade: input.severidade ?? "INFO",
      ip: input.ip ?? null,
      userAgent: input.userAgent ?? null,
    },
    });
  }
}
