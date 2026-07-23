import { Admin } from "./admin";



export class Prize {
    id: null | string = null;
    name: string;
    required_Points: number;
    description: string;
    fk_admin: Admin;

    constructor(
        id: null | string = null,
        name: string,
        required_Points: number,
        description: string,
        fk_admin: Admin
    ) {
        this.id = id;
        this.name = name;
        this.required_Points = required_Points;
        this.description = description;
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

    getRequired_Points(): number {
        return this.required_Points;
    }

    setRequired_Points(required_Points: number): void {
        this.required_Points = required_Points;
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