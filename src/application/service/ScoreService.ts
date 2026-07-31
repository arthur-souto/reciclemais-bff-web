import AppError from "../../domain/errors/AppError";
import { Delivery, DeliveryStatus } from "../../domain/models/delivery";
import { User } from "../../domain/models/user";
import Logger from "../../domain/ports/LoggerPort";
import DeliveryRepositoryPort from "../../domain/ports/repository/DeliveryRepositoryPort";
import UserRepositoryPort from "../../domain/ports/repository/UserRepositoryPort";
import { ImageStoragePort, UploadFileInput } from "../../domain/ports/StoragePort";
import TransactionManagerPort from "../../domain/ports/TransactionManagerPort";
import { EvidenceAnalysisResult } from "../EvidenceUseCases";


export default class ScoreService {

    constructor(
        private readonly deliveryRepository: DeliveryRepositoryPort,
        private readonly userRepository: UserRepositoryPort,
        private readonly transactionManager: TransactionManagerPort,
        private readonly uploadFile: ImageStoragePort,
        private readonly log: Logger
    ) {

    }


    public async execute({result, delivery, user, uploadInput}: {
        result: EvidenceAnalysisResult,
        uploadInput: UploadFileInput,
        delivery: Delivery,
        user: User
    }) {
        
        if(result.valid) {

            if(delivery.getStatus() === DeliveryStatus.PENDING) {
                await this.initTransaction({
                    user,
                    score: result.finalScore,
                    delivery,
                    input: uploadInput
                })
            }

            this.log.info("Operação transacional executada com sucesso.")
        }

    }

    private async initTransaction({user, score, delivery, input}: {
        user: User,
        score: number,
        delivery: Delivery,
        input: UploadFileInput
    }) {

        await this.transactionManager.run(async (tx) => {
            const result =  await this.uploadFile.upload(input);
            delivery.setStatus(DeliveryStatus.COMPLETED);
            delivery.setTotal_score(score);
            delivery.setEvidence_url(result.url);
            await this.userRepository.incrementScore(user, score, tx);
            await this.deliveryRepository.update(delivery, tx)
        })
    }

    public async getEntitiesForAction({ userId, deliveryId}: {
        userId: string,
        deliveryId: number,
    }) {
        const delivery = await this.deliveryRepository.findByIdIncludeDelivery(deliveryId);
        const user = await this.userRepository.findById(userId);

        if (!delivery || !user) {
            throw new AppError("Entrega/Usuario não encontrado", 404);
        }

        this.log.info("Delivery recebida para avaliação", delivery);

        const material = delivery.getMaterial();

        if (!material) {
            throw new AppError("Entrega não possui nenhum material", 400);
        }

        return {
            user: user,
            delivery: delivery,
            material: material
        }
    }
}
