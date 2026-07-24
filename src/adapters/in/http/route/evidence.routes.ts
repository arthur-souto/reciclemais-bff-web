import { Router } from "express";
import multer from "multer";
import EvidenceController from "../controller/EvidenceController";
import { authMiddleware } from "../middleware/auth";
import { TokenServicePort } from "../../../../domain/TokenServicePort";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

export function evidenceRoutes(evidenceController: EvidenceController, tokens: TokenServicePort): Router {
  const router = Router();

  /**
   * @openapi
   * /evidence:
   *   post:
   *     summary: Registra uma evidência a partir de uma imagem
   *     tags:
   *       - Evidence
   *     security:
   *       - bearerAuth: []
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
   *       401:
   *         description: Não autenticado
   *       500:
   *         description: Erro ao processar a imagem
   */
  router.post(
    "/evidence",
    authMiddleware(tokens),
    upload.single("evidence"),
    evidenceController.registerEvidence,
  );

  return router;
}