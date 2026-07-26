import { Router } from "express";
import { validate } from "../middleware/validate";
import { authMiddleware } from "../middleware/auth";
import { CreateMaterialDto } from "../../../request/CreateMaterialDTO";
import { UpdateMaterialDto } from "../../../request/UpdateMaterialDTO";
import MaterialController from "../controller/MaterialController";
import { TokenServicePort } from "../../../../domain/TokenServicePort";
import { requireRole } from "../middleware/requireRole";

export function materialRoutes(materialController: MaterialController, tokens: TokenServicePort): Router {
  const router = Router();

  /**
   * @openapi
   * /materials:
   *   post:
   *     summary: Cria um novo material
   *     tags:
   *       - Materials
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
   *               - importance
   *               - points_value
   *             properties:
   *               name:
   *                 type: string
   *                 maxLength: 255
   *                 description: Nome do material
   *               importance:
   *                 type: integer
   *                 description: Grau de importância do material
   *               points_value:
   *                 type: integer
   *                 description: Pontos concedidos por unidade entregue
   *     responses:
   *       201:
   *         description: Material criado com sucesso
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Não autenticado
   *   get:
   *     summary: Lista todos os materiais
   *     tags:
   *       - Materials
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Página desejada
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Itens por página (máximo 100)
   *     responses:
   *       200:
   *         description: Lista paginada de materiais
   *       401:
   *         description: Não autenticado
   */
  router.post(
    "/materials",
    authMiddleware(tokens),
    validate(CreateMaterialDto),
    requireRole(["ADMIN"]),
    materialController.create,
  );

  router.get(
    "/materials",
    authMiddleware(tokens),
    materialController.findAll,
  );

  /**
   * @openapi
   * /materials/search:
   *   get:
   *     summary: Busca materiais pelo nome (busca parcial)
   *     tags:
   *       - Materials
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: target
   *         schema:
   *           type: string
   *         description: Trecho do nome do material a ser buscado
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Página desejada
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Itens por página (máximo 100)
   *     responses:
   *       200:
   *         description: Lista paginada de materiais encontrados
   *       401:
   *         description: Não autenticado
   */
  router.get(
    "/materials/search",
    authMiddleware(tokens),
    materialController.findByTarget,
  );

  /**
   * @openapi
   * /materials/{id}:
   *   get:
   *     summary: Busca um material pelo ID
   *     tags:
   *       - Materials
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID do material
   *     responses:
   *       200:
   *         description: Material encontrado com sucesso
   *       401:
   *         description: Não autenticado
   *       404:
   *         description: Material não encontrado
   *   patch:
   *     summary: Atualiza um material existente
   *     tags:
   *       - Materials
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID do material
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
   *               importance:
   *                 type: integer
   *               points_value:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Material atualizado com sucesso
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Não autenticado
   *       404:
   *         description: Material não encontrado
   *   delete:
   *     summary: Remove um material
   *     tags:
   *       - Materials
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID do material
   *     responses:
   *       200:
   *         description: Material removido com sucesso
   *       401:
   *         description: Não autenticado
   *       404:
   *         description: Material não encontrado
   */
  router.get(
    "/materials/:id",
    authMiddleware(tokens),
    materialController.findById,
  );

  router.patch(
    "/materials/:id",
    authMiddleware(tokens),
    requireRole(["ADMIN"]),
    validate(UpdateMaterialDto),
    materialController.update,
  );

  router.delete(
    "/materials/:id",
    authMiddleware(tokens),
    requireRole(["ADMIN"]),
    materialController.delete,
  );

  return router;
}
