import { Admin } from "./admin";


export interface IPrize {
    id_prize: number;
    name_prize: string;
    points_prize: number;
    description: string;
    fk_admin: Admin;
}

export class Prize implements IPrize {
    id_prize: number;
    name_prize: string;
    points_prize: number;
    description: string;
    fk_admin: Admin;
}