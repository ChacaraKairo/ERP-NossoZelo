import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { REQUIRED_PERMISSION_KEY } from "../decorators/require-permission.decorator";
import { hasPermission } from "../rbac/permissions";
import type { RequestWithContext } from "../types/request-user";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const permission = this.reflector.getAllAndOverride<string>(REQUIRED_PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!permission) return true;

    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const role = request.user?.perfil;
    if (role && hasPermission(role, permission)) return true;

    throw new ForbiddenException("Permissão insuficiente");
  }
}
