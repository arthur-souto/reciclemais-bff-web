import { Application } from "express";
import ApplicationRunnable from "../../../domain/ports/ApplicationRunnablePort";
import express from "express";
import cors from "cors";
import { Server } from 'http'
import Logger from "../../../domain/ports/LoggerPort";
import multer from "multer";
import EvidenceController from "./EvidenceController";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../../../infrastructure/config/Swagger";
import { validate } from "./middleware/validate";
import { CreateUserDto } from "../../request/CreateUserDTO";
import { registerRoutes } from "./route";
import UserController from "./UserController";

export default class ExpressServerAdapter implements ApplicationRunnable {

    private readonly app: Application = express();
    private readonly upload = multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 20 * 1024 * 1024 }
    })

    private server: Server | null = null;

    // configuração do express
    // o logger é injetado para que possamos logar eventos do servidor
    public constructor(private log: Logger, private evidenceController: EvidenceController, private userController: UserController) {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.configureDocs()
        this.configureRoutes();
    }

    private configureRoutes() {
        registerRoutes(
            this.app,
            {
                evidenceController: this.evidenceController,
                userController: this.userController
            }
        )
    }

    private configureDocs() {
        this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    public async run(port: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(port, () => {
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