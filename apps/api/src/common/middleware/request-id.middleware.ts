import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import type { RequestWithContext } from "../types/request-user";

export function requestIdMiddleware(request: Request, response: Response, next: NextFunction) {
  const inbound = request.header("x-request-id");
  const requestId = inbound && inbound.length <= 120 ? inbound : randomUUID();
  (request as RequestWithContext).requestId = requestId;
  response.setHeader("x-request-id", requestId);
  next();
}
