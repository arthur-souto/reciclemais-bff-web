import { NextFunction, Request, Response } from "express";
import AppError from "../../../../domain/errors/AppError";

// use quando precisar verificar se usuario e admin
export function requireRole(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!req.user || !roles.includes(req.user.role!) ) {
            return next(new AppError("Acesso negado: você não possui essa permissão", 403))
        }
        next()
    }
}