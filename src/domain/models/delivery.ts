import { Material } from "./material";
import { User } from "./user";

export enum DeliveryStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
}

export class Delivery {
    private id: null | number = null;
    private local: string;
    private material_type: string;
    private status: DeliveryStatus;
    private quantity: number;
    private weight: number;
    private total_score: number;
    private evidence_url: string | null;
    private collected_at: Date;
    private latitude: number;
    private longitude: number;
    private created_at: Date;
    private updated_at: Date;
    private fk_user: string | null;
    private fk_material: number | null;
    private fk_approved_by: string | null;
    private material: Material | null = null;

    constructor(
        id: number | null = null,
        local: string,
        material_type: string,
        status: DeliveryStatus,
        quantity: number,
        weight: number,
        total_score: number,
        evidence_url: string | null = null,
        collected_at: Date,
        latitude: number,
        longitude: number,
        created_at: Date,
        updated_at: Date,
        fk_user: string | null = null,
        fk_material: number | null = null,
        fk_approved_by: string | null = null
    ) {
        this.id = id;
        this.local = local;
        this.material_type = material_type;
        this.status = status;
        this.quantity = quantity;
        this.weight = weight;
        this.total_score = total_score;
        this.evidence_url = evidence_url;
        this.collected_at = collected_at;
        this.latitude = latitude;
        this.longitude = longitude;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.fk_user = fk_user;
        this.fk_material = fk_material;
        this.fk_approved_by = fk_approved_by;
    }

    getMaterial(): Material | null {
        return this.material;
    }

    getId(): number | null {
        return this.id;
    }

    setMaterial(material: Material): void {
        this.material = material;
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

    getWeight(): number {
        return this.weight;
    }

    setWeight(weight: number): void {
        this.weight = weight;
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

    getCollected_at(): Date {
        return this.collected_at;
    }

    setCollected_at(collected_at: Date): void {
        this.collected_at = collected_at;
    }

    getLatitude(): number {
        return this.latitude;
    }

    setLatitude(latitude: number): void {
        this.latitude = latitude;
    }

    getLongitude(): number {
        return this.longitude;
    }

    setLongitude(longitude: number): void {
        this.longitude = longitude;
    }



    getTotal_score(): number {
        return this.total_score;
    }

    setTotal_score(total_score: number): void {
        this.total_score = total_score;
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

    getFk_approved_by(): string | null {
        return this.fk_approved_by;
    }

    setFk_approved_by(user: string | null): void {
        this.fk_approved_by = user;
    }
}
