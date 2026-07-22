import { Material } from "./material";
import { User } from "./user";

export interface IDelivery {
    id_delivery: number;
    delivery_Local: string;
    material_type: string;
    status: status;
    material_quantity: number;
    fk_user: User;
    fk_material: Material;
}

export enum status {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
}

export class Delivery implements IDelivery {
    id_delivery: number;
    delivery_Local: string;
    material_type: string;
    status: status;
    material_quantity: number;
    fk_user: User;
    fk_material: Material;

    constructor(
        id_delivery: number,
        delivery_Local: string,
        material_type: string,
        status: status,
        material_quantity: number,
        fk_user: User,
        fk_material: Material
    ) {
        this.id_delivery = id_delivery;
        this.delivery_Local = delivery_Local;
        this.material_type = material_type;
        this.status = status;
        this.material_quantity = material_quantity;
        this.fk_user = fk_user;
        this.fk_material = fk_material;
    }

    getId_delivery(): number {
        return this.id_delivery;
    }

    setId_delivery(id_delivery: number): void {
        this.id_delivery = id_delivery;
    }

    getDelivery_Local(): string {
        return this.delivery_Local;
    }

    setDelivery_Local(delivery_Local: string): void {
        this.delivery_Local = delivery_Local;
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

    getMaterial_quantity(): number {
        return this.material_quantity;
    }

    setMaterial_quantity(material_quantity: number): void {
        this.material_quantity = material_quantity;
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