import { Admin } from "./admin";

export interface IMaterial {
    id_material: number;
    name_material: string;
    importance: number;
    points_material: number;
    fk_admin: Admin
}

export class Material implements IMaterial {
    id_material: number;
    name_material: string;
    importance: number;
    points_material: number;
    fk_admin: Admin;
}

