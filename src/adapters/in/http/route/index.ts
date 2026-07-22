import { Application } from "express";
import EvidenceController from "../EvidenceController";
import UserController from "../UserController";
import { evidenceRoutes } from "./evidence.routes";
import { userRoutes } from "./user.routes";

interface Controllers {
  evidenceController: EvidenceController;
  userController: UserController;
}

export function registerRoutes(app: Application, controllers: Controllers) {
  app.use(evidenceRoutes(controllers.evidenceController));
  app.use(userRoutes(controllers.userController));
}