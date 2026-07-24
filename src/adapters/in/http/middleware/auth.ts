import { NextFunction, Request, Response } from "express";
import { TokenServicePort } from "../../../../domain/TokenServicePort";
import AppError from "../../../../domain/errors/AppError";

export function authMiddleware(tokens: TokenServicePort) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const [scheme, token] = req.headers.authorization?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
      return next(new AppError("Não autenticado", 401));
    }

    let payload;
    try {
      payload = tokens.verify(token);
    } catch {
      return next(new AppError("Não autenticado", 401));
    }

    if (!payload) {
      return next(new AppError("Não autenticado", 401));
    }

    req.user = payload;
    next();
  };
}