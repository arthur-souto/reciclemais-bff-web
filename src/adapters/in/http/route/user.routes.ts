import { Router } from "express";
import { validate } from "../middleware/validate";
import { CreateUserDto } from "../../../request/CreateUserDTO";
import UserController from "../UserController";

export function userRoutes(userController: UserController): Router {
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

  return router;
}