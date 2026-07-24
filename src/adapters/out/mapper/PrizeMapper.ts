import { Prize } from "../../../domain/models/prize";
import { CreatePrizeDto } from "../../request/CreatePrizeDTO";
import { UpdatePrizeDto } from "../../request/UpdatePrizeDTO";

export function toPrizeResponse(prize: Prize): {
    id: number | null;
    name: string;
    required_points: number;
    description: string;
    fk_user: string | null;
} {
    return {
        id: prize.getId(),
        name: prize.getName(),
        required_points: prize.getRequired_points(),
        description: prize.getDescription(),
        fk_user: prize.getFk_user(),
    };
}

export function fromPrizeCreateRequest(req: CreatePrizeDto, fk_user: string): Prize {
    return new Prize(null, req.name, req.required_points, req.description, fk_user);
}

export function applyPrizeUpdateRequest(prize: Prize, req: UpdatePrizeDto): Prize {
    if (req.name !== undefined) prize.setName(req.name);
    if (req.required_points !== undefined) prize.setRequired_points(req.required_points);
    if (req.description !== undefined) prize.setDescription(req.description);
    return prize;
}
