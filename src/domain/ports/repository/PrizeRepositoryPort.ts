import { Prize } from "../../models/prize";
import { PaginatedResult, PaginationParams } from "../../dto/Pagination";

export default interface PrizeRepositoryPort {
    save(prize: Prize): Promise<Prize>;
    findById(id: number): Promise<Prize | null>;
    findAll(pagination: PaginationParams): Promise<PaginatedResult<Prize>>;
    update(prize: Prize): Promise<Prize>;
    decrementQuantity(prizeId: number, tx?: unknown): Promise<boolean>;
    delete(id: number): Promise<void>;
}
