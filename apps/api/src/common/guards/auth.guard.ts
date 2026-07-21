import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService, sessionCookie } from "../../services/auth.service";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import type { RequestWithContext } from "../types/request-user";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly auth: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const session = await this.auth.validateSession(request.cookies?.[sessionCookie]);
    if (!session) throw new UnauthorizedException("Não autenticado");

    request.user = session.user;
    request.session = { id: session.id, deviceId: session.deviceId };
    return true;
  }
}
