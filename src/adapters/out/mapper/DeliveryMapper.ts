import { Delivery, DeliveryStatus } from "../../../domain/models/delivery";
import { Material } from "../../../domain/models/material";
import { User } from "../../../domain/models/user";
import { CreateDeliveryDto } from "../../request/CreateDeliveryDTO";
import { UpdateDeliveryDto } from "../../request/UpdateDeliveryDTO";

export function toDeliveryResponse(delivery: Delivery): {
    id: number | null;
    local: string;
    material_type: string;
    status: DeliveryStatus;
    quantity: number;
    weight: number;
    total_score: number;
    evidence_url: string | null;
    collected_at: Date;
    latitude: number;
    longitude: number;
    created_at: Date;
    updated_at: Date;
    fk_user: string | null;
    fk_material: number | null;
    fk_approved_by: string | null;
    material: Material | null;
} {
    return {
        id: delivery.getId(),
        local: delivery.getLocal(),
        material_type: delivery.getMaterial_type(),
        status: delivery.getStatus(),
        quantity: delivery.getQuantity(),
        weight: delivery.getWeight(),
        total_score: delivery.getTotal_score(),
        evidence_url: delivery.getEvidence_url(),
        collected_at: delivery.getCollected_at(),
        latitude: delivery.getLatitude(),
        longitude: delivery.getLongitude(),
        created_at: delivery.getCreated_at(),
        updated_at: delivery.getUpdated_at(),
        fk_user: delivery.getFk_user(),
        fk_material: delivery.getFk_material(),
        fk_approved_by: delivery.getFk_approved_by(),
        material: delivery.getMaterial()
    };
}

export function fromDeliveryCreateRequest(req: CreateDeliveryDto, fk_user: string,fk_approved_by:string | null = null): Delivery {
    return new Delivery(
        null,
        req.local,
        req.material_type,
        DeliveryStatus.PENDING,
        req.quantity,
        req.weight,
        0,
        req.evidence_url ?? null,
        req.collected_at,
        req.latitude,
        req.longitude,
        new Date(),
        new Date(),
        fk_user,
        req.fk_material,
        fk_approved_by
    );
}

export function applyDeliveryUpdateRequest(delivery: Delivery, req: UpdateDeliveryDto): Delivery {
    if (req.local !== undefined) delivery.setLocal(req.local);
    if (req.material_type !== undefined) delivery.setMaterial_type(req.material_type);
    if (req.quantity !== undefined) delivery.setQuantity(req.quantity);
    if (req.total_score !== undefined) delivery.setTotal_score(req.total_score);
    if (req.evidence_url !== undefined) delivery.setEvidence_url(req.evidence_url);
    if (req.fk_material !== undefined) delivery.setFk_material(req.fk_material);
    if (req.status !== undefined) delivery.setStatus(req.status);
    return delivery;
}
