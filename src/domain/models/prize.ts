export enum PrizeStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export enum PrizeType {
    PHYSICAL = "PHYSICAL",
    DIGITAL = "DIGITAL",
    DISCOUNT = "DISCOUNT",
}

export class Prize {
    id: null | number = null;
    name: string;
    required_points: number;
    quantity: number | null;
    image_url: string | null;
    description: string;
    status: PrizeStatus;
    type: PrizeType;
    category: string | null;
    expiration_date: Date | null;
    created_at: Date;
    updated_at: Date;
    fk_created_by: string | null;

    constructor(
        id: null | number = null,
        name: string,
        required_points: number,
        quantity: number | null,
        image_url: string | null,
        description: string,
        status: PrizeStatus,
        type: PrizeType,
        category: string | null,
        expiration_date: Date | null,
        created_at: Date,
        updated_at: Date,
        fk_created_by: string | null = null
    ) {
        this.id = id;
        this.name = name;
        this.required_points = required_points;
        this.quantity = quantity;
        this.image_url = image_url;
        this.description = description;
        this.status = status;
        this.type = type;
        this.category = category;
        this.expiration_date = expiration_date;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.fk_created_by = fk_created_by;
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

    getQuantity(): number | null {
        return this.quantity;
    }

    setQuantity(quantity: number | null): void {
        this.quantity = quantity;
    }

    getImage_url(): string | null {
        return this.image_url;
    }

    setImage_url(image_url: string | null): void {
        this.image_url = image_url;
    }

    getDescription(): string {
        return this.description;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    getStatus(): PrizeStatus {
        return this.status;
    }

    setStatus(status: PrizeStatus): void {
        this.status = status;
    }

    getType(): PrizeType {
        return this.type;
    }

    setType(type: PrizeType): void {
        this.type = type;
    }

    getCategory(): string | null {
        return this.category;
    }

    setCategory(category: string | null): void {
        this.category = category;
    }

    getExpiration_date(): Date | null {
        return this.expiration_date;
    }

    setExpiration_date(expiration_date: Date | null): void {
        this.expiration_date = expiration_date;
    }

    getCreated_at(): Date {
        return this.created_at;
    }

    setCreated_at(created_at: Date): void {
        this.created_at = created_at;
    }

    getUpdated_at(): Date {
        return this.updated_at;
    }

    setUpdated_at(updated_at: Date): void {
        this.updated_at = updated_at;
    }

    getFk_created_by(): string | null {
        return this.fk_created_by;
    }

    setFk_created_by(fk_created_by: string | null): void {
        this.fk_created_by = fk_created_by;
    }
}
