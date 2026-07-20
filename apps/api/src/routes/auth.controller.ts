import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService, sessionCookie } from "../services/auth.service";
import { AuditService } from "../services/audit.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly audit: AuditService,
  ) {}

  @Post("login")
  async login(
    @Body() body: { email?: string; senha?: string; password?: string },
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const user = await this.auth.validateLogin(
      String(body.email ?? ""),
      String(body.senha ?? body.password ?? ""),
      request.ip,
      request.get("user-agent"),
    );

    response.cookie(sessionCookie, String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 8 * 60 * 60 * 1000,
    });

    const acceptsHtml = request.accepts("html") && !request.accepts("json");
    if (acceptsHtml) {
      return response.redirect(303, `${process.env.APP_URL ?? "http://localhost:3000"}/dashboard`);
    }

    return response.json({ user });
  }

  @Get("me")
  async me(@Req() request: Request) {
    const user = await this.auth.getUserFromCookie(request.cookies?.[sessionCookie]);
    if (!user) throw new UnauthorizedException("Não autenticado");
    return user;
  }

  @Post("logout")
  @HttpCode(200)
  async logout(@Req() request: Request, @Res() response: Response) {
    const user = await this.auth.getUserFromCookie(request.cookies?.[sessionCookie]);
    if (user) {
      await this.audit.create({
        usuarioId: user.id,
        acao: "logout",
        entidadeTipo: "usuario_interno",
        entidadeId: user.id,
        ip: request.ip,
        userAgent: request.get("user-agent"),
      });
    }
    response.clearCookie(sessionCookie, { path: "/" });

    const acceptsHtml = request.accepts("html") && !request.accepts("json");
    if (acceptsHtml) {
      return response.redirect(303, `${process.env.APP_URL ?? "http://localhost:3000"}/login`);
    }

    return response.json({ ok: true });
  }
}
