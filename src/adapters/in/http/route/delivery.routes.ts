import { Router } from "express";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth";
import { CreateDeliveryDto } from "../../../request/CreateDeliveryDTO";
import { UpdateDeliveryDto } from "../../../request/UpdateDeliveryDTO";
import DeliveryController from "../controller/DeliveryController";
import { TokenServicePort } from "../../../../domain/TokenServicePort";

export function deliveryRoutes(deliveryController: DeliveryController, tokens: TokenServicePort): Router {
  const router = Router();

  /**
   * @openapi
   * /deliveries:
   *   post:
   *     summary: Registra uma nova entrega
   *     tags:
   *       - Deliveries
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - local
   *               - material_type
   *               - quantity
   *               - fk_material
   *             properties:
   *               local:
   *                 type: string
   *                 maxLength: 255
   *                 description: Local onde a entrega foi feita
   *               material_type:
   *                 type: string
   *                 maxLength: 255
   *                 description: Tipo do material entregue
   *               quantity:
   *                 type: integer
   *                 description: Quantidade entregue
   *               fk_material:
   *                 type: integer
   *                 description: ID do material entregue
   *               evidence_url:
   *                 type: string
   *                 format: uri
   *                 description: URL da imagem que comprova a entrega
   *     responses:
   *       201:
   *         description: Entrega criada com sucesso
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Não autenticado
   *       404:
   *         description: Material não encontrado
   *   get:
   *     summary: Lista todas as entregas
   *     tags:
   *       - Deliveries
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de entregas
   *       401:
   *         description: Não autenticado
   */
  router.post(
    "/deliveries",
    authMiddleware(tokens),
    validate(CreateDeliveryDto),
    deliveryController.create,
  );

  router.get(
    "/deliveries",
    authMiddleware(tokens),
    deliveryController.findAll,
  );

  /**
   * @openapi
   * /deliveries/{id}:
   *   get:
   *     summary: Busca uma entrega pelo ID
   *     tags:
   *       - Deliveries
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID da entrega
   *     responses:
   *       200:
   *         description: Entrega encontrada com sucesso
   *       401:
   *         description: Não autenticado
   *       404:
   *         description: Entrega não encontrada
   *   patch:
   *     summary: Atualiza uma entrega existente
   *     tags:
   *       - Deliveries
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID da entrega
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               local:
   *                 type: string
   *                 maxLength: 255
   *               material_type:
   *                 type: string
   *                 maxLength: 255
   *               quantity:
   *                 type: integer
   *               fk_material:
   *                 type: integer
   *               evidence_url:
   *                 type: string
   *                 format: uri
   *               status:
   *                 type: string
   *                 enum: [PENDING, COMPLETED, CANCELED]
   *     responses:
   *       200:
   *         description: Entrega atualizada com sucesso
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Não autenticado
   *       404:
   *         description: Entrega não encontrada
   *   delete:
   *     summary: Remove uma entrega
   *     tags:
   *       - Deliveries
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID da entrega
   *     responses:
   *       200:
   *         description: Entrega removida com sucesso
   *       401:
   *         description: Não autenticado
   *       404:
   *         description: Entrega não encontrada
   */
  router.get(
    "/deliveries/:id",
    authMiddleware(tokens),
    deliveryController.findById,
  );

  router.patch(
    "/deliveries/:id",
    authMiddleware(tokens),
    validate(UpdateDeliveryDto),
    deliveryController.update,
  );

  router.delete(
    "/deliveries/:id",
    authMiddleware(tokens),
    deliveryController.delete,
  );

  return router;
}
