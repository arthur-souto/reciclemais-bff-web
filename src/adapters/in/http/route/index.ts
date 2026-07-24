import { Application } from "express";
import EvidenceController from "../controller/EvidenceController";
import UserController from "../controller/UserController";
import AuthController from "../controller/AuthController";
import MaterialController from "../controller/MaterialController";
import PrizeController from "../controller/PrizeController";
import DeliveryController from "../controller/DeliveryController";
import { evidenceRoutes } from "./evidence.routes";
import { userRoutes } from "./user.routes";
import { authRoutes } from "./auth.routes";
import { materialRoutes } from "./material.routes";
import { prizeRoutes } from "./prize.routes";
import { deliveryRoutes } from "./delivery.routes";
import { TokenServicePort } from "../../../../domain/TokenServicePort";

interface Controllers {
  evidenceController: EvidenceController;
  userController: UserController;
  authController: AuthController;
  materialController: MaterialController;
  prizeController: PrizeController;
  deliveryController: DeliveryController;
}

export function registerRoutes(app: Application, controllers: Controllers, tokens: TokenServicePort) {
  app.use(evidenceRoutes(controllers.evidenceController, tokens));
  app.use(userRoutes(controllers.userController, tokens));
  app.use(authRoutes(controllers.authController));
  app.use(materialRoutes(controllers.materialController, tokens));
  app.use(prizeRoutes(controllers.prizeController, tokens));
  app.use(deliveryRoutes(controllers.deliveryController, tokens));
}
