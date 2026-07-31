import { Router } from "express";
import multer from "multer";
import UploadController from "../controller/UploadController";
import { authMiddleware } from "../middleware/auth";
import { TokenServicePort } from "../../../../domain/TokenServicePort";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export function uploadRoutes(uploadController: UploadController, tokens: TokenServicePort): Router {
  const router = Router();

  /**
   * @openapi
   * /upload:
   *   post:
   *     summary: Realiza o upload de uma imagem para o armazenamento (Cloudflare R2)
   *     tags:
   *       - Upload
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - image
   *             properties:
   *               image:
   *                 type: string
   *                 format: binary
   *                 description: Arquivo de imagem a ser enviado (jpeg, png ou webp, máx. 5MB)
   *     responses:
   *       201:
   *         description: Imagem enviada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 description:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     key:
   *                       type: string
   *                     url:
   *                       type: string
   *       400:
   *         description: Nenhuma imagem enviada, tipo não permitido ou tamanho excedido
   *       401:
   *         description: Não autenticado
   */
  router.post(
    "/upload",
    authMiddleware(tokens),
    upload.single("image"),
    uploadController.uploadImage,
  );

  return router;
}
