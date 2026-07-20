import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { RequestWithContext } from "../types/request-user";

export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<RequestWithContext>();
  return request.user;
});
