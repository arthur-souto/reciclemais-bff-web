import { Material } from "../../models/material";

export default interface MaterialRepositoryPort {
    save(material: Material): Promise<Material>;
    findById(id: number): Promise<Material | null>;
    findAll(): Promise<Material[]>;
    update(material: Material): Promise<Material>;
    delete(id: number): Promise<void>;
}
