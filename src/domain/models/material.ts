import { Admin } from "./admin";

export interface IMaterial {
    id_material: number;
    name_material: string;
    importance: number;
    points_material: number;
    fk_admin: Admin;
}

export class Material implements IMaterial {
    id_material: number;
    name_material: string;
    importance: number;
    points_material: number;
    fk_admin: Admin;

    constructor(
        id_material: number,
        name_material: string,
        importance: number,
        points_material: number,
        fk_admin: Admin
    ) {
        this.id_material = id_material;
        this.name_material = name_material;
        this.importance = importance;
        this.points_material = points_material;
        this.fk_admin = fk_admin;
    }

    getId_material(): number {
        return this.id_material;
    }

    setId_material(id_material: number): void {
        this.id_material = id_material;
    }

    getName_material(): string {
        return this.name_material;
    }

    setName_material(name_material: string): void {
        this.name_material = name_material;
    }

    getImportance(): number {
        return this.importance;
    }

    setImportance(importance: number): void {
        this.importance = importance;
    }

    getPoints_material(): number {
        return this.points_material;
    }

    setPoints_material(points_material: number): void {
        this.points_material = points_material;
    }

    getFk_admin(): Admin {
        return this.fk_admin;
    }

    setFk_admin(fk_admin: Admin): void {
        this.fk_admin = fk_admin;
    }
}