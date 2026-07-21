import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import type { Response } from "express";
import { AuthService, sessionCookie } from "../services/auth.service";
import { Public } from "../common/decorators/public.decorator";
import type { RequestWithContext } from "../common/types/request-user";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post("login")
  async login(
    @Body() body: { email?: string; senha?: string; password?: string },
    @Req() request: RequestWithContext,
    @Res() response: Response,
  ) {
    const result = await this.auth.login({
      email: String(body.email ?? ""),
      password: String(body.senha ?? body.password ?? ""),
      ip: request.ip,
      userAgent: request.get("user-agent"),
      requestId: request.requestId,
      deviceId: request.header("x-device-id"),
    });

    response.cookie(sessionCookie, result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 8 * 60 * 60 * 1000,
    });

    const acceptsHtml = this.wantsHtml(request);
    if (acceptsHtml) {
      return response.redirect(303, `${process.env.APP_URL ?? "http://localhost:3000"}/dashboard`);
    }

    return response.json({ user: result.user });
  }

  @Get("me")
  async me(@Req() request: RequestWithContext) {
    const user = request.user;
    if (!user) throw new UnauthorizedException("Não autenticado");
    return user;
  }

  @Post("logout")
  @HttpCode(200)
  async logout(@Req() request: RequestWithContext, @Res() response: Response) {
    await this.auth.logout(request.cookies?.[sessionCookie], {
      requestId: request.requestId,
      ip: request.ip,
      userAgent: request.get("user-agent"),
    });
    response.clearCookie(sessionCookie, { path: "/" });

    const acceptsHtml = this.wantsHtml(request);
    if (acceptsHtml) {
      return response.redirect(303, `${process.env.APP_URL ?? "http://localhost:3000"}/login`);
    }

    return response.json({ ok: true });
  }

  private wantsHtml(request: RequestWithContext) {
    const accept = request.get("accept") ?? "";
    const contentType = request.get("content-type") ?? "";
    return accept.includes("text/html") || contentType.includes("application/x-www-form-urlencoded");
  }
}
