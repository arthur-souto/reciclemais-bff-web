import { Delivery } from "../../models/delivery";
import { PaginatedResult, PaginationParams } from "../../dto/Pagination";

export default interface DeliveryRepositoryPort {
    save(delivery: Delivery): Promise<Delivery>;
    findById(id: number): Promise<Delivery | null>;
    findByIdIncludeDelivery(id: number): Promise<Delivery | null>;
    findAll(pagination: PaginationParams): Promise<PaginatedResult<Delivery>>;
    update(delivery: Delivery): Promise<Delivery>;
    delete(id: number): Promise<void>;
}
