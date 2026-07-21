import { Request, Response } from "express";
import sharp from "sharp";
import EvidenceUseCases from "../../../application/EvidenceUseCases";
import GenerateBufferByImage from "../../../utils/GenerateBufferByImage";
import Logger from "../../../domain/ports/LoggerPort";


// Groq vision limita imagens a 33.177.600 pixels (5760 x 5760)
const MAX_IMAGE_DIMENSION = 5760;

export default class EvidenceController {
    private readonly BufferImageGenerator = new GenerateBufferByImage();

    constructor(private evidenceUseCases: EvidenceUseCases, private log: Logger) {}
 
    public registerEvidence = async (req: Request, res: Response) => {
        try {
             if (!req.file) {
                 res.status(400).json({ error: "Nenhuma imagem enviada" });
                 return;
            }

            this.log.info("Iniciando análise de evidência");

            let imageUrl = await this.BufferImageGenerator.convertToBase64AndReturnUrl(req.file.buffer, req.file.mimetype);
            let analysisResult = await this.evidenceUseCases.analyzeEvidence(imageUrl);

            this.log.info("Análise de evidência concluída", { analysisResult });
            
            res.status(200).json({ description: analysisResult });
        }
        catch (err) {
            res.status(500).json({ error: "Erro ao processar a imagem" });
        }
    }

}