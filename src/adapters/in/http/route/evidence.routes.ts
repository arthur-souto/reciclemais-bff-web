import { Router } from "express";
import multer from "multer";
import EvidenceController from "../EvidenceController";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

export function evidenceRoutes(evidenceController: EvidenceController): Router {
  const router = Router();

  /**
   * @openapi
   * /evidence:
   *   post:
   *     summary: Registra uma evidência a partir de uma imagem
   *     tags:
   *       - Evidence
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - evidence
   *             properties:
   *               evidence:
   *                 type: string
   *                 format: binary
   *                 description: Arquivo de imagem da evidência
   *     responses:
   *       200:
   *         description: Evidência processada com sucesso
   *       400:
   *         description: Nenhuma imagem enviada
   *       500:
   *         description: Erro ao processar a imagem
   */
  router.post(
    "/evidence",
    upload.single("evidence"),
    evidenceController.registerEvidence,
  );

  return router;
}