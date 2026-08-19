import { Application } from "express";
import ApplicationRunnable from "../../../domain/ports/ApplicationRunnablePort";
import express from "express";
import cors from "cors";
import { Server } from 'http'
import Logger from "../../../domain/ports/LoggerPort";
import multer from "multer";
import EvidenceController from "./controller/EvidenceController";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../../../infrastructure/config/Swagger";
import { registerRoutes } from "./route";
import UserController from "./controller/UserController";
import AuthController from "./controller/AuthController";
import MaterialController from "./controller/MaterialController";
import PrizeController from "./controller/PrizeController";
import DeliveryController from "./controller/DeliveryController";
import UploadController from "./controller/UploadController";
import { errorHandler } from "./middleware/errorHandler";
import { TokenServicePort } from "../../../domain/TokenServicePort";
import { JwkProviderPort } from "../../../domain/ports/JwkProviderPort";

export default class ExpressServerAdapter implements ApplicationRunnable {

    private readonly app: Application = express();
    private server: Server | null = null;

    // configuração do express
    // o logger é injetado para que possamos logar eventos do servidor
    public constructor(
        private log: Logger,
        private evidenceController: EvidenceController,
        private userController: UserController,
        private authController: AuthController,
        private materialController: MaterialController,
        private prizeController: PrizeController,
        private deliveryController: DeliveryController,
        private uploadController: UploadController,
        private tokens: TokenServicePort,
        private jwkProvider: JwkProviderPort
    ) {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.configureDocs()
        this.configureRoutes();
        this.app.use(errorHandler(this.log));
    }

    private configureRoutes() {
        registerRoutes(
            this.app,
            {
                evidenceController: this.evidenceController,
                userController: this.userController,
                authController: this.authController,
                materialController: this.materialController,
                prizeController: this.prizeController,
                deliveryController: this.deliveryController,
                uploadController: this.uploadController
            },
            this.tokens,
            this.jwkProvider
        )
    }

    private configureDocs() {
        this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    public async run(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(port, "0.0.0.0", () => {
                this.log.info(`Server running on port ${port}`);
                resolve();
            });

            this.server.on('error', (err) => {
                this.log.error(`Error starting server on port ${port}`, err);
                reject(err);
            });
        });
    }

    public async stop(): Promise<void> {
        if (this.server) {
            this.server.close(() => {
                this.log.info('Server Stopped');
            });
        }
    }
}