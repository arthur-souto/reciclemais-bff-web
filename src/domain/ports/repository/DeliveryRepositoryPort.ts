import { Delivery } from "../../models/delivery";

export default interface DeliveryRepositoryPort {
    save(delivery: Delivery): Promise<Delivery>;
    findById(id: number): Promise<Delivery | null>;
    findAll(): Promise<Delivery[]>;
    update(delivery: Delivery): Promise<Delivery>;
    delete(id: number): Promise<void>;
}
