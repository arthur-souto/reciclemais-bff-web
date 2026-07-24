import { Prize } from "../../models/prize";

export default interface PrizeRepositoryPort {
    save(prize: Prize): Promise<Prize>;
    findById(id: number): Promise<Prize | null>;
    findAll(): Promise<Prize[]>;
    update(prize: Prize): Promise<Prize>;
    delete(id: number): Promise<void>;
}
