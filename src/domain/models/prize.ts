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

    constructor(
        id_prize: number,
        name_prize: string,
        points_prize: number,
        description: string,
        fk_admin: Admin
    ) {
        this.id_prize = id_prize;
        this.name_prize = name_prize;
        this.points_prize = points_prize;
        this.description = description;
        this.fk_admin = fk_admin;
    }

    getId_prize(): number {
        return this.id_prize;
    }

    setId_prize(id_prize: number): void {
        this.id_prize = id_prize;
    }

    getName_prize(): string {
        return this.name_prize;
    }

    setName_prize(name_prize: string): void {
        this.name_prize = name_prize;
    }

    getPoints_prize(): number {
        return this.points_prize;
    }

    setPoints_prize(points_prize: number): void {
        this.points_prize = points_prize;
    }

    getDescription(): string {
        return this.description;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    getFk_admin(): Admin {
        return this.fk_admin;
    }

    setFk_admin(fk_admin: Admin): void {
        this.fk_admin = fk_admin;
    }
}