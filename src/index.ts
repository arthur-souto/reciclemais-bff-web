import "dotenv/config";
import "reflect-metadata";
import EvidenceController from "./adapters/in/http/controller/EvidenceController";
import ExpressServerAdapter from "./adapters/in/http/ExpressServerAdpater";
import GroqServiceAdpater from "./adapters/out/ai/GroqServiceAdpater";
import PinoLogger from "./adapters/out/logging/PinoLoggerAdpater";
import EvidenceUseCases from "./application/EvidenceUseCases";
import ApplicationRunnable from "./domain/ports/ApplicationRunnablePort";
import Logger from "./domain/ports/LoggerPort";
import { logBanner } from "./infrastructure/config/Banner";
import { poll } from "./infrastructure/database/client";
import UserUseCase from "./application/UserUseCase";
import DrizzleUserRepository from "./adapters/out/repositories/DrizzleUserRepository";
import UserRepositoryPort from "./domain/ports/repository/UserRepositoryPort";
import UserController from "./adapters/in/http/controller/UserController";
import Argon2PasswordHasher from "./adapters/out/security/Argon2PasswordHasher";
import AuthUseCases from "./application/AuthUseCases";
import AuthController from "./adapters/in/http/controller/AuthController";
import JwtTokenService from "./adapters/out/security/JwtTokenService";
import MaterialUseCase from "./application/MaterialUseCase";
import DrizzleMaterialRepository from "./adapters/out/repositories/DrizzleMaterialRepository";
import MaterialRepositoryPort from "./domain/ports/repository/MaterialRepositoryPort";
import MaterialController from "./adapters/in/http/controller/MaterialController";
import PrizeUseCase from "./application/PrizeUseCase";
import DrizzlePrizeRepository from "./adapters/out/repositories/DrizzlePrizeRepository";
import PrizeRepositoryPort from "./domain/ports/repository/PrizeRepositoryPort";
import PrizeController from "./adapters/in/http/controller/PrizeController";
import DeliveryUseCase from "./application/DeliveryUseCase";
import DrizzleDeliveryRepository from "./adapters/out/repositories/DrizzleDeliveryRepository";
import DeliveryRepositoryPort from "./domain/ports/repository/DeliveryRepositoryPort";
import DeliveryController from "./adapters/in/http/controller/DeliveryController";

const logger: Logger = new PinoLogger();
const passwordHasher = new Argon2PasswordHasher();
const tokenService = new JwtTokenService(process.env.JWT_SECRET!, process.env.JWT_EXPIRES_IN);

//groq service adapter
const groqService = new GroqServiceAdpater(
    process.env.GROQ_API_KEY!,
    process.env.GROQ_MODEL || "qwen/qwen3.6-27b",
    logger, process.env.GROQ_VISION_MODEL
|| "qwen/qwen3.6-27b");

//repositories
const userRepository: UserRepositoryPort = new DrizzleUserRepository()
const materialRepository: MaterialRepositoryPort = new DrizzleMaterialRepository()
const prizeRepository: PrizeRepositoryPort = new DrizzlePrizeRepository()
const deliveryRepository: DeliveryRepositoryPort = new DrizzleDeliveryRepository()

//use cases
const evidenceUseCases = new EvidenceUseCases(groqService);
const userUseCases = new UserUseCase(userRepository, passwordHasher)
const authUseCases = new AuthUseCases(userRepository, passwordHasher, tokenService)
const materialUseCases = new MaterialUseCase(materialRepository)
const prizeUseCases = new PrizeUseCase(prizeRepository)
const deliveryUseCases = new DeliveryUseCase(deliveryRepository, materialRepository)

// controllers
const evidenceController = new EvidenceController(evidenceUseCases, logger);
const userController = new UserController(userUseCases, logger);
const authController = new AuthController(authUseCases, logger);
const materialController = new MaterialController(materialUseCases, logger);
const prizeController = new PrizeController(prizeUseCases, logger);
const deliveryController = new DeliveryController(deliveryUseCases, logger);

// application
const app: ApplicationRunnable = new ExpressServerAdapter(
    logger,
    evidenceController,
    userController,
    authController,
    materialController,
    prizeController,
    deliveryController,
    tokenService
);

app.run(Number(process.env.PORT)).then(() => {
    logBanner(logger, {
        appName: "RecicleMais",
        version: "1.0.0",
        port: 3000,
        environment: process.env.NODE_ENV || "development",
    });
}).catch(() => {
    process.exit(1);
});

const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);
    poll.end().then(() => logger.info("Database connection pool closed"));
    app.stop().then(() => process.exit(0));
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
