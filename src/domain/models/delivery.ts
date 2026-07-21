import { Material } from "./material";
import { User } from "./User";


export interface IDelivery {
    id_delivery: number;
    delivery_Local: string;
    material_type: string;
    status: status
    material_quantity: number;
    fk_user: User;
    fk_material:Material;

}

export enum status {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
}

export class Delivery implements IDelivery{
    id_delivery: number;
    delivery_Local: string;
    material_type: string;
    status: status;
    material_quantity: number;
    fk_user: User;
    fk_material: Material;
}