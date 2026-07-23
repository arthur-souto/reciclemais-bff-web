import { Material } from "./material";
import { User } from "./user";



export enum status {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
}

export class Delivery {
    id: null | string = null;
    local: string;
    material_type: string;
    status: status;
    quantity: number;
    fk_user: User;
    fk_material: Material;

    constructor(
        id: null | string = null,
        local: string,
        material_type: string,
        status: status,
        quantity: number,
        fk_user: User,
        fk_material: Material
    ) {
        this.id = id;
        this.local = local;
        this.material_type = material_type;
        this.status = status;
        this.quantity = quantity;
        this.fk_user = fk_user;
        this.fk_material = fk_material;
    }

    getId(): string | null {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    getLocal(): string {
        return this.local;
    }

    setLocal(local: string): void {
        this.local = local;
    }

    getMaterial_type(): string {
        return this.material_type;
    }

    setMaterial_type(material_type: string): void {
        this.material_type = material_type;
    }

    getStatus(): status {
        return this.status;
    }

    setStatus(status: status): void {
        this.status = status;
    }

    getQuantity(): number {
        return this.quantity;
    }

    setQuantity(quantity: number): void {
        this.quantity = quantity;
    }

    getFk_user(): User {
        return this.fk_user;
    }

    setFk_user(fk_user: User): void {
        this.fk_user = fk_user;
    }

    getFk_material(): Material {
        return this.fk_material;
    }

    setFk_material(fk_material: Material): void {
        this.fk_material = fk_material;
    }
}