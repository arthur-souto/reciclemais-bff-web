export type UserRole = "USER" | "ADMIN" | "ASSOCIATE";

export class User {

    private id: null | string = null;
    private name: string;
    private email: string;
    private cpf: string;
    private password: string;
    private role: UserRole;
    private profile_image: string | null;
    private phone: string | null;
    private cep: string | null;
    private address: string | null;
    private total_score: number;
    private created_at: Date;
    private updated_at: Date;

    constructor(
        id: string | null,
        name: string,
        email: string,
        cpf: string,
        password: string,
        role: UserRole = "USER",
        profile_image: string | null = null,
        phone: string | null = null,
        cep: string | null = null,
        address: string | null = null,
        total_score: number = 0,
        created_at: Date = new Date(),
        updated_at: Date = new Date()
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.password = password;
        this.role = role;
        this.profile_image = profile_image;
        this.phone = phone;
        this.cep = cep;
        this.address = address;
        this.total_score = total_score;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    public getId(): string | null {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
    return this.email;
    }

    public getCpf(): string {
        return this.cpf;
    }

    public getPassword(): string {
        return this.password;
    }

    public getRole(): UserRole {
        return this.role;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public setCpf(cpf: string): void {
        this.cpf = cpf;
    }

    public setPassword(password: string): void {
        this.password = password;
    }

    public setRole(role: UserRole): void {
        this.role = role;
    }

    public getProfileImage(): string | null {
        return this.profile_image;
    }

    public setProfileImage(profile_image: string | null): void {
        this.profile_image = profile_image;
    }

    public getPhone(): string | null {
        return this.phone;
    }

    public setPhone(phone: string | null): void {
        this.phone = phone;
    }

    public getCep(): string | null {
        return this.cep;
    }

    public setCep(cep: string | null): void {
        this.cep = cep;
    }

    public getAddress(): string | null {
        return this.address;
    }

    public setAddress(address: string | null): void {
        this.address = address;
    }

    public getTotalScore(): number {
        return this.total_score;
    }

    public setTotalScore(total_score: number): void {
        this.total_score = total_score;
    }

    public getCreatedAt(): Date {
        return this.created_at;
    }

    public getUpdatedAt(): Date {
        return this.updated_at;
    }

    public setUpdatedAt(updated_at: Date): void {
        this.updated_at = updated_at;
    }
}

