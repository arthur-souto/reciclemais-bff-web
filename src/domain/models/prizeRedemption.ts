export class PrizeRedemption {
    id: null | number = null;
    fk_prize: number;
    fk_user: string;
    redeemed_at: Date;

    constructor(
        id: null | number = null,
        fk_prize: number,
        fk_user: string,
        redeemed_at: Date = new Date()
    ) {
        this.id = id;
        this.fk_prize = fk_prize;
        this.fk_user = fk_user;
        this.redeemed_at = redeemed_at;
    }

    getId(): number | null {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getFk_prize(): number {
        return this.fk_prize;
    }

    getFk_user(): string {
        return this.fk_user;
    }

    getRedeemed_at(): Date {
        return this.redeemed_at;
    }
}
