export enum DeliveryStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
}

export class Delivery {
    id: null | number = null;
    local: string;
    material_type: string;
    status: DeliveryStatus;
    quantity: number;
    evidence_url: string | null;
    fk_user: string | null;
    fk_material: number | null;

    constructor(
        id: null | number = null,
        local: string,
        material_type: string,
        status: DeliveryStatus,
        quantity: number,
        evidence_url: string | null = null,
        fk_user: string | null = null,
        fk_material: number | null = null
    ) {
        this.id = id;
        this.local = local;
        this.material_type = material_type;
        this.status = status;
        this.quantity = quantity;
        this.evidence_url = evidence_url;
        this.fk_user = fk_user;
        this.fk_material = fk_material;
    }

    getId(): number | null {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getLocal(): string {
        return this.local;
    }

    setLocal(local: string): void {
        this.local = local;
    }

    getMaterial_type(): string {
        return this.material_type;
    }

    setMaterial_type(material_type: string): void {
        this.material_type = material_type;
    }

    getStatus(): DeliveryStatus {
        return this.status;
    }

    setStatus(status: DeliveryStatus): void {
        this.status = status;
    }

    getQuantity(): number {
        return this.quantity;
    }

    setQuantity(quantity: number): void {
        this.quantity = quantity;
    }

    getEvidence_url(): string | null {
        return this.evidence_url;
    }

    setEvidence_url(evidence_url: string | null): void {
        this.evidence_url = evidence_url;
    }

    getFk_user(): string | null {
        return this.fk_user;
    }

    setFk_user(fk_user: string | null): void {
        this.fk_user = fk_user;
    }

    getFk_material(): number | null {
        return this.fk_material;
    }

    setFk_material(fk_material: number | null): void {
        this.fk_material = fk_material;
    }
}
