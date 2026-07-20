import { Request, Response } from "express";
import sharp from "sharp";
import EvidenceUseCases from "../../../application/EvidenceUseCases";

// Groq vision limita imagens a 33.177.600 pixels (5760 x 5760)
const MAX_IMAGE_DIMENSION = 5760;

export default class EvidenceController {

    constructor(private evidenceUseCases: EvidenceUseCases) {}

    public registerEvidence = async (req: Request, res: Response) => {
        try {
             if (!req.file) {
                 res.status(400).json({ error: "Nenhuma imagem enviada" });
                 return;
            }

            const question = req.body.question || "O que você vê nesta imagem?";
            const resizedBuffer = await sharp(req.file.buffer)
                .resize(MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION, {
                    fit: "inside",
                    withoutEnlargement: true,
                })
                .toBuffer();
            const base64Image = resizedBuffer.toString("base64");
            const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

            let analysisResult =await this.evidenceUseCases.analyzeEvidence(imageUrl, question);
            
            res.status(200).json({ message: analysisResult });
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ error: "Erro ao processar a imagem" });
        }
    }

}