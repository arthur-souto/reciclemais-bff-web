import { PrizeRedemption } from "../../../domain/models/prizeRedemption";

export function toPrizeRedemptionResponse(redemption: PrizeRedemption): {
    id: number | null;
    fk_prize: number;
    fk_user: string;
    redeemed_at: Date;
} {
    return {
        id: redemption.getId(),
        fk_prize: redemption.getFk_prize(),
        fk_user: redemption.getFk_user(),
        redeemed_at: redemption.getRedeemed_at(),
    };
}
