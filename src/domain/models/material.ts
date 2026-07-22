import { Admin } from "./admin";

export class Material{
    id: null | string = null;
    name: string;
    importance: number;
    points_value: number;
    fk_admin: Admin;

    constructor(
        id: null | string = null,
        name: string,
        importance: number,
        points_value: number,
        fk_admin: Admin
    ) {
        this.id = id;
        this.name = name;
        this.importance = importance;
        this.points_value = points_value;
        this.fk_admin = fk_admin;
    }

    getId(): string | null {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
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