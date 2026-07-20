import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

type AuditInput = {
  usuarioId?: number | null;
  acao: string;
  entidadeTipo: string;
  entidadeId?: number | null;
  dadosAnteriores?: unknown;
  dadosNovos?: unknown;
  motivo?: string | null;
  resultado?: string;
  ip?: string | null;
  userAgent?: string | null;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: AuditInput) {
    return this.prisma.erpAuditoria.create({
      data: {
        usuarioId: input.usuarioId ?? null,
        acao: input.acao,
        entidadeTipo: input.entidadeTipo,
        entidadeId: input.entidadeId ?? null,
        dadosAnteriores: input.dadosAnteriores ? JSON.stringify(input.dadosAnteriores) : null,
        dadosNovos: input.dadosNovos ? JSON.stringify(input.dadosNovos) : null,
        motivo: input.motivo ?? null,
        resultado: input.resultado ?? "sucesso",
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
      },
    });
  }
}
