import { Prize, PrizeStatus } from "../../../domain/models/prize";
import { CreatePrizeDto } from "../../request/CreatePrizeDTO";
import { UpdatePrizeDto } from "../../request/UpdatePrizeDTO";

export function toPrizeResponse(prize: Prize): {
    id: number | null;
    name: string;
    required_points: number;
    image_url: string | null;
    description: string;
    status: PrizeStatus;
    category: string | null;
    expiration_date: Date | null;
    created_at: Date;
    updated_at: Date;
    fk_created_by: string | null;
} {
    return {
        id: prize.getId(),
        name: prize.getName(),
        required_points: prize.getRequired_points(),
        image_url: prize.getImage_url(),
        description: prize.getDescription(),
        status: prize.getStatus(),
        category: prize.getCategory(),
        expiration_date: prize.getExpiration_date(),
        created_at: prize.getCreated_at(),
        updated_at: prize.getUpdated_at(),
        fk_created_by: prize.getFk_created_by(),
    };
}

export function fromPrizeCreateRequest(req: CreatePrizeDto, fk_created_by: string): Prize {
    return new Prize(
        null,
        req.name,
        req.required_points,
        req.image_url ?? null,
        req.description,
        PrizeStatus.ACTIVE,
        req.category,
        req.expiration_date ?? null,
        new Date(),
        new Date(),
        fk_created_by
    );
}

export function applyPrizeUpdateRequest(prize: Prize, req: UpdatePrizeDto): Prize {
    if (req.name !== undefined) prize.setName(req.name);
    if (req.required_points !== undefined) prize.setRequired_points(req.required_points);
    if (req.description !== undefined) prize.setDescription(req.description);
    if (req.category !== undefined) prize.setCategory(req.category);
    if (req.image_url !== undefined) prize.setImage_url(req.image_url);
    if (req.expiration_date !== undefined) prize.setExpiration_date(req.expiration_date);
    if (req.status !== undefined) prize.setStatus(req.status);
    return prize;
}
