import { NextFunction, Request, Response } from "express";
import Logger from "../../../../domain/ports/LoggerPort";
import AppError from "../../../../domain/errors/AppError";

const DEFAULT_ERROR_MESSAGE = "Erro interno do servidor";

// Erros de middlewares do Express (express.json, multer, etc.) não são AppError,
// mas trazem seu próprio status 4xx via `statusCode`/`status` (convenção do pacote http-errors).
// Sem isso, um JSON malformado do cliente virava um 500 "Erro interno do servidor".
function getClientErrorStatus(err: unknown): number | undefined {
    if (typeof err !== "object" || err === null) return undefined;
    const status = (err as { statusCode?: unknown }).statusCode ?? (err as { status?: unknown }).status;
    return typeof status === "number" && status >= 400 && status < 500 ? status : undefined;
}

export function errorHandler(log: Logger) {
    return (err: unknown, req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
            return next(err);
        }

        const isAppError = err instanceof AppError;
        const clientErrorStatus = isAppError ? undefined : getClientErrorStatus(err);
        const statusCode = isAppError ? err.statusCode : clientErrorStatus ?? 500;
        const message = isAppError
            ? err.message
            : clientErrorStatus && err instanceof Error
                ? err.message
                : DEFAULT_ERROR_MESSAGE;

        const logContext = {
            path: req.path,
            method: req.method,
            statusCode,
            stack: err instanceof Error ? err.stack : undefined,
            error: isAppError ? undefined : err,
        };

        if (statusCode >= 500) {
            log.error(message, logContext);
        } else {
            log.info(message, logContext);
        }

        res.status(statusCode).json({ 
            code: statusCode,
            error: message,
            dataHora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
        });
    };
}
