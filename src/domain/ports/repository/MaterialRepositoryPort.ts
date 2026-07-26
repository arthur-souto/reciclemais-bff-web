import { Material } from "../../models/material";
import { PaginatedResult, PaginationParams } from "../../dto/Pagination";

export default interface MaterialRepositoryPort {
    save(material: Material): Promise<Material>;
    findById(id: number): Promise<Material | null>;
    findAll(pagination: PaginationParams): Promise<PaginatedResult<Material>>;
    findByTarget(target: string | null, pagination: PaginationParams): Promise<PaginatedResult<Material>>
    update(material: Material): Promise<Material>;
    delete(id: number): Promise<void>;
}
