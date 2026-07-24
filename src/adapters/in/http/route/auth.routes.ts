import { Router } from "express";
import { validate } from "../middleware/validate";
import { LoginDto } from "../../../request/LoginDTO";
import AuthController from "../controller/AuthController";

export function authRoutes(authController: AuthController): Router {
  const router = Router();

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     summary: Autentica um usuário e retorna um token JWT
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Email do usuário
   *               password:
   *                 type: string
   *                 format: password
   *                 description: Senha do usuário
   *     responses:
   *       200:
   *         description: Login realizado com sucesso
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Credenciais inválidas
   */
  router.post(
    "/auth/login",
    validate(LoginDto),
    authController.login,
  );

  return router;
}
