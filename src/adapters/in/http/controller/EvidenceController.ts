import { NextFunction, Request, Response } from "express";
import EvidenceUseCases from "../../../../application/EvidenceUseCases";
import GenerateBufferByImage from "../../../../utils/GenerateBufferByImage";
import Logger from "../../../../domain/ports/LoggerPort";
import AppError from "../../../../domain/errors/AppError";

export default class EvidenceController {
    private readonly BufferImageGenerator = new GenerateBufferByImage();

    public constructor(private evidenceUseCases: EvidenceUseCases, private log: Logger) {}

    public registerEvidence = async (req: Request, res: Response, next: NextFunction) => {
        try {
             if (!req.file) {
                 throw new AppError("Nenhuma imagem enviada", 400);
            }
            
            this.log.info("Iniciando análise de evidência");

            let imageUrl = await this.BufferImageGenerator.convertToBase64AndReturnUrl(req.file.buffer, req.file.mimetype);
            let analysisResult = await this.evidenceUseCases.analyzeEvidence(imageUrl);

            this.log.info("Análise de evidência concluída", { analysisResult });

            res.status(200).json({ description: analysisResult });
        }
        catch (err) {
            next(err);
        }
    }

}