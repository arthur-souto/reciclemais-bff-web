export class Material {
    id: null | number = null;
    name: string;
    importance: number;
    points_value: number;
    fk_user: string | null;

    constructor(
        id: null | number = null,
        name: string,
        importance: number,
        points_value: number,
        fk_user: string | null = null
    ) {
        this.id = id;
        this.name = name;
        this.importance = importance;
        this.points_value = points_value;
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

    getFk_user(): string | null {
        return this.fk_user;
    }

    setFk_user(fk_user: string | null): void {
        this.fk_user = fk_user;
    }
}
