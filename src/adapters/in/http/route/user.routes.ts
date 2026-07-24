import { Router } from "express";
import { validate } from "../middleware/validate";
import { CreateUserDto } from "../../../request/CreateUserDTO";
import { UpdateUserDto } from "../../../request/UpdateUserDTO";
import UserController from "../controller/UserController";
import { authMiddleware } from "../middleware/auth";
import { TokenServicePort } from "../../../../domain/TokenServicePort";

export function userRoutes(userController: UserController, tokens: TokenServicePort): Router {
  const router = Router();

  /**
   * @openapi
   * /users:
   *   post:
   *     summary: Cria um novo usuário
   *     tags:
   *       - Users
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - cpf
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *                 maxLength: 255
   *                 description: Nome do usuário
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Email do usuário
   *               cpf:
   *                 type: string
   *                 description: CPF do usuário
   *               password:
   *                 type: string
   *                 minLength: 8
   *                 format: password
   *                 description: Senha do usuário
   *     responses:
   *       201:
   *         description: Usuario criado com sucesso
   *       400:
   *         description: Dados inválidos
   *       500:
   *         description: Erro ao criar usuario
   */
  router.post(
    "/users",
    validate(CreateUserDto),
    userController.createUser,
  );


  /**
   * @openapi
   * /users/{id}:
   *   get:
   *     summary: Busca um usuário pelo ID
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do usuário
   *     responses:
   *       200:
   *         description: Usuario encontrado com sucesso
   *       401:
   *         description: Não autenticado
   *       500:
   *         description: Erro ao buscar usuario
   */
  router.get(
    "/users/:id",
    authMiddleware(tokens),
    userController.findById
  )

  /**
   * @openapi
   * /users/email/{email}:
   *   get:
   *     summary: Busca um usuário pelo email
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: email
   *         required: true
   *         schema:
   *           type: string
   *           format: email
   *         description: Email do usuário
   *     responses:
   *       200:
   *         description: Usuario encontrado com sucesso
   *       401:
   *         description: Não autenticado
   *       500:
   *         description: Erro ao buscar usuario
   */
  router.get(
    "/users/email/:email",
    authMiddleware(tokens),
    userController.findByEmail
  )

  /**
   * @openapi
   * /users/{id}:
   *   patch:
   *     summary: Atualiza um usuário existente
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do usuário
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
   *               email:
   *                 type: string
   *                 format: email
   *               cpf:
   *                 type: string
   *     responses:
   *       200:
   *         description: Usuario atualizado com sucesso
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Não autenticado
   *       404:
   *         description: Usuario não encontrado
   *   delete:
   *     summary: Remove um usuário
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do usuário
   *     responses:
   *       200:
   *         description: Usuario removido com sucesso
   *       401:
   *         description: Não autenticado
   *       404:
   *         description: Usuario não encontrado
   */
  router.patch(
    "/users/:id",
    authMiddleware(tokens),
    validate(UpdateUserDto),
    userController.update
  )

  router.delete(
    "/users/:id",
    authMiddleware(tokens),
    userController.delete
  )

  return router;
}