import { Delivery, DeliveryStatus } from "../../../domain/models/delivery";
import { CreateDeliveryDto } from "../../request/CreateDeliveryDTO";
import { UpdateDeliveryDto } from "../../request/UpdateDeliveryDTO";

export function toDeliveryResponse(delivery: Delivery): {
    id: number | null;
    local: string;
    material_type: string;
    status: DeliveryStatus;
    quantity: number;
    evidence_url: string | null;
    fk_user: string | null;
    fk_material: number | null;
} {
    return {
        id: delivery.getId(),
        local: delivery.getLocal(),
        material_type: delivery.getMaterial_type(),
        status: delivery.getStatus(),
        quantity: delivery.getQuantity(),
        evidence_url: delivery.getEvidence_url(),
        fk_user: delivery.getFk_user(),
        fk_material: delivery.getFk_material(),
    };
}

export function fromDeliveryCreateRequest(req: CreateDeliveryDto, fk_user: string): Delivery {
    return new Delivery(
        null,
        req.local,
        req.material_type,
        DeliveryStatus.PENDING,
        req.quantity,
        req.evidence_url ?? null,
        fk_user,
        req.fk_material
    );
}

export function applyDeliveryUpdateRequest(delivery: Delivery, req: UpdateDeliveryDto): Delivery {
    if (req.local !== undefined) delivery.setLocal(req.local);
    if (req.material_type !== undefined) delivery.setMaterial_type(req.material_type);
    if (req.quantity !== undefined) delivery.setQuantity(req.quantity);
    if (req.evidence_url !== undefined) delivery.setEvidence_url(req.evidence_url);
    if (req.fk_material !== undefined) delivery.setFk_material(req.fk_material);
    if (req.status !== undefined) delivery.setStatus(req.status);
    return delivery;
}
