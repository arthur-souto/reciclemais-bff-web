import { PrizeRedemption } from "../../models/prizeRedemption";
import { PaginatedResult, PaginationParams } from "../../dto/Pagination";

export default interface PrizeRedemptionRepositoryPort {
    create(redemption: PrizeRedemption, tx?: unknown): Promise<PrizeRedemption>;
    findByUser(fk_user: string, pagination: PaginationParams): Promise<PaginatedResult<PrizeRedemption>>;
    findByPrize(fk_prize: number, pagination: PaginationParams): Promise<PaginatedResult<PrizeRedemption>>;
    existsByUserAndPrize(fk_user: string, fk_prize: number): Promise<boolean>;
}
