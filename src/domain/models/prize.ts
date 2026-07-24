export class Prize {
    id: null | number = null;
    name: string;
    required_points: number;
    description: string;
    fk_user: string | null;

    constructor(
        id: null | number = null,
        name: string,
        required_points: number,
        description: string,
        fk_user: string | null = null
    ) {
        this.id = id;
        this.name = name;
        this.required_points = required_points;
        this.description = description;
        this.fk_user = fk_user;
    }

    getId(): number | null {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getRequired_points(): number {
        return this.required_points;
    }

    setRequired_points(required_points: number): void {
        this.required_points = required_points;
    }

    getDescription(): string {
        return this.description;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    getFk_user(): string | null {
        return this.fk_user;
    }

    setFk_user(fk_user: string | null): void {
        this.fk_user = fk_user;
    }
}
