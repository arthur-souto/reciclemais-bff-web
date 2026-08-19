import { Router } from "express";
import { JwkProviderPort } from "../../../../domain/ports/JwkProviderPort";

export function jwksRoutes(jwkProvider: JwkProviderPort): Router {
  const router = Router();

  /**
   * @openapi
   * /.well-known/jwks.json:
   *   get:
   *     summary: Retorna o JSON Web Key Set (JWKS) usado para verificar a assinatura dos tokens JWT (RS256)
   *     tags:
   *       - Auth
   *     responses:
   *       200:
   *         description: Conjunto de chaves públicas (JWKS) usado para validar tokens emitidos pela aplicação
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 keys:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       kty:
   *                         type: string
   *                       n:
   *                         type: string
   *                       e:
   *                         type: string
   *                       kid:
   *                         type: string
   *                       use:
   *                         type: string
   *                       alg:
   *                         type: string
   *       500:
   *         description: Erro ao gerar o JWKS
   */
  router.get("/.well-known/jwks.json", async (_req, res, next) => {
    try {
      const jwkSet = await jwkProvider.getJwkSet();
      res.json(jwkSet);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
