import { Injectable, UnauthorizedException } from "@nestjs/common";
import { compare } from "bcryptjs";
import { PrismaService } from "./prisma.service";
import { AuditService } from "./audit.service";

export const sessionCookie = "erp_session";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async validateLogin(email: string, password: string, ip?: string, userAgent?: string) {
    const user = await this.prisma.erpUsuarioInterno.findUnique({ where: { email } });
    const valid = user ? await compare(password, user.senhaHash) : false;

    if (!user || !valid || user.status !== "ATIVO") {
      await this.audit.create({
        acao: "login_falhou",
        entidadeTipo: "usuario_interno",
        motivo: email,
        resultado: "erro",
        ip,
        userAgent,
      });
      throw new UnauthorizedException("Credenciais inválidas");
    }

    await this.prisma.erpUsuarioInterno.update({
      where: { id: user.id },
      data: { ultimoAcesso: new Date() },
    });
    await this.audit.create({
      usuarioId: user.id,
      acao: "login",
      entidadeTipo: "usuario_interno",
      entidadeId: user.id,
      ip,
      userAgent,
    });

    return { id: user.id, nome: user.nome, email: user.email, perfil: user.perfil };
  }

  async getUserFromCookie(rawId?: string) {
    const id = Number(rawId);
    if (!id) return null;

    return this.prisma.erpUsuarioInterno.findFirst({
      where: { id, status: "ATIVO" },
      select: { id: true, nome: true, email: true, perfil: true },
    });
  }
}
