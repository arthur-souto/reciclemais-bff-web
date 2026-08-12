import { PrizeStatus, PrizeType } from "../domain/models/prize";
import { PrizeRedemption } from "../domain/models/prizeRedemption";
import PrizeRepositoryPort from "../domain/ports/repository/PrizeRepositoryPort";
import UserRepositoryPort from "../domain/ports/repository/UserRepositoryPort";
import PrizeRedemptionRepositoryPort from "../domain/ports/repository/PrizeRedemptionRepositoryPort";
import TransactionManagerPort from "../domain/ports/TransactionManagerPort";
import AppError from "../domain/errors/AppError";
import { toPrizeRedemptionResponse } from "../adapters/out/mapper/PrizeRedemptionMapper";
import { mapPaginatedResult, PaginationParams } from "../domain/dto/Pagination";

export default class PrizeRedemptionUseCase {

    public constructor(
        private readonly prizeRepository: PrizeRepositoryPort,
        private readonly userRepository: UserRepositoryPort,
        private readonly prizeRedemptionRepository: PrizeRedemptionRepositoryPort,
        private readonly transactionManager: TransactionManagerPort
    ) { }

    public async redeem(prizeId: string, userId: string) {
        
        const numericId = this.parseId(prizeId);
        const prize = await this.prizeRepository.findById(numericId);

        if (!prize) {
            throw new AppError("Prêmio não encontrado", 404);
        }

        if (prize.getStatus() !== PrizeStatus.ACTIVE) {
            throw new AppError("Prêmio indisponível para resgate", 400);
        }

        const expirationDate = prize.getExpiration_date();
        if (expirationDate && expirationDate.getTime() < Date.now()) {
            throw new AppError("Prêmio expirado", 400);
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }

        if (user.getTotalScore() < prize.getRequired_points()) {
            throw new AppError("Pontos insuficientes para resgatar este prêmio", 400);
        }

        if (await this.prizeRedemptionRepository.existsByUserAndPrize(userId, numericId)) {
            throw new AppError("Prêmio já resgatado por este usuário", 400);
        }

        const redemption = await this.transactionManager.run(async (tx) => {

            if (prize.getType() === PrizeType.PHYSICAL) {
                const decrementedPrize = await this.prizeRepository.decrementQuantity(numericId, tx);
                if (!decrementedPrize) {
                    throw new AppError("Prêmio esgotado", 400);
                }
            }

            const decrementedUser = await this.userRepository.decrementScoreIfEnough(
                user,
                prize.getRequired_points(),
                tx
            );

            if (!decrementedUser) {
                throw new AppError("Pontos insuficientes para resgatar este prêmio", 400);
            }

            return this.prizeRedemptionRepository.create(
                new PrizeRedemption(null, numericId, userId),
                tx
            );
        });

        return toPrizeRedemptionResponse(redemption);
    }

    public async listByUser(userId: string, pagination: PaginationParams) {
        const result = await this.prizeRedemptionRepository.findByUser(userId, pagination);
        return mapPaginatedResult(result, toPrizeRedemptionResponse);
    }

    public async listByPrize(prizeId: string, pagination: PaginationParams) {
        const numericId = this.parseId(prizeId);
        const result = await this.prizeRedemptionRepository.findByPrize(numericId, pagination);
        return mapPaginatedResult(result, toPrizeRedemptionResponse);
    }

    private parseId(id: string): number {
        const numericId = Number(id);
        if (!Number.isInteger(numericId) || numericId <= 0) {
            throw new AppError("ID inválido", 400);
        }
        return numericId;
    }
}
