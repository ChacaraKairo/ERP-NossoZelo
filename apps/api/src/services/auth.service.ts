import { createHash, randomBytes } from "node:crypto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { compare } from "bcryptjs";
import { PrismaService } from "./prisma.service";
import { AuditService } from "./audit.service";
import type { RequestUser } from "../common/types/request-user";

export const sessionCookie = "erp_session";
const sessionTtlMs = 8 * 60 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async login(input: {
    email: string;
    password: string;
    ip?: string;
    userAgent?: string;
    requestId?: string;
    deviceId?: string;
  }) {
    const { email, password, ip, userAgent, requestId, deviceId } = input;
    const user = await this.prisma.erpUsuarioInterno.findUnique({ where: { email } });
    const valid = user ? await compare(password, user.senhaHash) : false;

    if (!user || !valid || user.status !== "ATIVO") {
      await this.audit.create({
        acao: "login_falhou",
        entidadeTipo: "usuario_interno",
        motivo: email,
        resultado: "erro",
        severidade: "WARN",
        ip,
        userAgent,
        requestId,
      });
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const token = randomBytes(48).toString("base64url");
    const session = await this.prisma.erpSessao.create({
      data: {
        usuarioId: user.id,
        tokenHash: hashToken(token),
        ip,
        userAgent,
        deviceId,
        expiraEm: new Date(Date.now() + sessionTtlMs),
        ultimoUsoEm: new Date(),
      },
    });

    await this.prisma.erpUsuarioInterno.update({
      where: { id: user.id },
      data: { ultimoAcesso: new Date() },
    });
    await this.audit.create({
      usuarioId: user.id,
      acao: "login",
      entidadeTipo: "usuario_interno",
      entidadeId: user.id,
      sessionId: session.id,
      deviceId,
      ip,
      userAgent,
      requestId,
    });

    return {
      token,
      session,
      user: { id: user.id, nome: user.nome, email: user.email, perfil: user.perfil, deveTrocarSenha: user.deveTrocarSenha },
    };
  }

  async validateSession(token?: string): Promise<{ id: string; deviceId?: string | null; user: RequestUser } | null> {
    if (!token) return null;
    const session = await this.prisma.erpSessao.findFirst({
      where: {
        tokenHash: hashToken(token),
        revogadaEm: null,
        expiraEm: { gt: new Date() },
      },
      include: {
        usuario: {
          select: { id: true, nome: true, email: true, perfil: true, status: true },
        },
      },
    });
    if (!session || session.usuario.status !== "ATIVO") return null;

    await this.prisma.erpSessao.update({
      where: { id: session.id },
      data: { ultimoUsoEm: new Date() },
    });

    return {
      id: session.id,
      deviceId: session.deviceId,
      user: {
        id: session.usuario.id,
        nome: session.usuario.nome,
        email: session.usuario.email,
        perfil: session.usuario.perfil,
      },
    };
  }

  async logout(token: string | undefined, meta: { requestId?: string; ip?: string; userAgent?: string }) {
    if (!token) return null;
    const session = await this.prisma.erpSessao.findFirst({
      where: { tokenHash: hashToken(token), revogadaEm: null },
      include: { usuario: true },
    });
    if (!session) return null;

    await this.prisma.erpSessao.update({
      where: { id: session.id },
      data: { revogadaEm: new Date() },
    });
    await this.audit.create({
      usuarioId: session.usuarioId,
      acao: "logout",
      entidadeTipo: "usuario_interno",
      entidadeId: session.usuarioId,
      sessionId: session.id,
      deviceId: session.deviceId,
      ip: meta.ip,
      userAgent: meta.userAgent,
      requestId: meta.requestId,
    });
    return session;
  }
}
