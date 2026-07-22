import { Admin } from "./admin";

export class Material{
    id_material: number;
    name: string;
    importance: number;
    points_value: number;
    fk_admin: Admin;

    constructor(
        id_material: number,
        name: string,
        importance: number,
        points_value: number,
        fk_admin: Admin
    ) {
        this.id_material = id_material;
        this.name = name;
        this.importance = importance;
        this.points_value = points_value;
        this.fk_admin = fk_admin;
    }

    getId_material(): number {
        return this.id_material;
    }

    setId_material(id_material: number): void {
        this.id_material = id_material;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getImportance(): number {
        return this.importance;
    }

    setImportance(importance: number): void {
        this.importance = importance;
    }

    getPoints_value(): number {
        return this.points_value;
    }

    setPoints_value(points_value: number): void {
        this.points_value = points_value;
    }

    getFk_admin(): Admin {
        return this.fk_admin;
    }

    setFk_admin(fk_admin: Admin): void {
        this.fk_admin = fk_admin;
    }
}