import { NextFunction, Request, Response } from "express";
import { UploadImageUseCase } from "../../../../application/UploadImageUseCase";
import Logger from "../../../../domain/ports/LoggerPort";
import AppError from "../../../../domain/errors/AppError";

export default class UploadController {

    public constructor(private uploadImageUseCase: UploadImageUseCase, private log: Logger) { }

    public uploadImage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) {
                throw new AppError("Nenhuma imagem enviada", 400);
            }

            this.log.info("Iniciando upload de imagem");

            const result = await this.uploadImageUseCase.execute({
                buffer: req.file.buffer,
                mimeType: req.file.mimetype,
                originalmage: req.file.originalname,
            });

            this.log.info("Upload de imagem concluído", { key: result.key });

            res.status(201).json({ description: "Imagem enviada com sucesso", data: result });
        }
        catch (err) {
            next(err);
        }
    }
}
