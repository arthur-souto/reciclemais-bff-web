import { Router } from "express";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth";
import { CreatePrizeDto } from "../../../request/CreatePrizeDTO";
import { UpdatePrizeDto } from "../../../request/UpdatePrizeDTO";
import PrizeController from "../controller/PrizeController";
import { TokenServicePort } from "../../../../domain/TokenServicePort";

export function prizeRoutes(prizeController: PrizeController, tokens: TokenServicePort): Router {
  const router = Router();

  /**
   * @openapi
   * /prizes:
   *   post:
   *     summary: Cria um novo prêmio
   *     tags:
   *       - Prizes
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - required_points
   *               - description
   *             properties:
   *               name:
   *                 type: string
   *                 maxLength: 255
   *                 description: Nome do prêmio
   *               required_points:
   *                 type: integer
   *                 description: Pontos necessários para resgatar o prêmio
   *               description:
   *                 type: string
   *                 description: Descrição do prêmio
   *     responses:
   *       201:
   *         description: Prêmio criado com sucesso
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Não autenticado
   *   get:
   *     summary: Lista todos os prêmios
   *     tags:
   *       - Prizes
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de prêmios
   *       401:
   *         description: Não autenticado
   */
  router.post(
    "/prizes",
    authMiddleware(tokens),
    validate(CreatePrizeDto),
    prizeController.create,
  );

  router.get(
    "/prizes",
    authMiddleware(tokens),
    prizeController.findAll,
  );

  /**
   * @openapi
   * /prizes/{id}:
   *   get:
   *     summary: Busca um prêmio pelo ID
   *     tags:
   *       - Prizes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID do prêmio
   *     responses:
   *       200:
   *         description: Prêmio encontrado com sucesso
   *       401:
   *         description: Não autenticado
   *       404:
   *         description: Prêmio não encontrado
   *   patch:
   *     summary: Atualiza um prêmio existente
   *     tags:
   *       - Prizes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID do prêmio
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 maxLength: 255
   *               required_points:
   *                 type: integer
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: Prêmio atualizado com sucesso
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Não autenticado
   *       404:
   *         description: Prêmio não encontrado
   *   delete:
   *     summary: Remove um prêmio
   *     tags:
   *       - Prizes
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID do prêmio
   *     responses:
   *       200:
   *         description: Prêmio removido com sucesso
   *       401:
   *         description: Não autenticado
   *       404:
   *         description: Prêmio não encontrado
   */
  router.get(
    "/prizes/:id",
    authMiddleware(tokens),
    prizeController.findById,
  );

  router.patch(
    "/prizes/:id",
    authMiddleware(tokens),
    validate(UpdatePrizeDto),
    prizeController.update,
  );

  router.delete(
    "/prizes/:id",
    authMiddleware(tokens),
    prizeController.delete,
  );

  return router;
}
