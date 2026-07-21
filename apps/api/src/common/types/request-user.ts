import type { Request } from "express";

export type RequestUser = {
  id: number;
  nome: string;
  email: string;
  perfil: string;
};

export type RequestSession = {
  id: string;
  deviceId?: string | null;
};

export type RequestWithContext = Request & {
  user?: RequestUser;
  session?: RequestSession;
  requestId?: string;
};
