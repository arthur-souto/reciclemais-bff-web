export type UserRole = "USER" | "ADMIN" | "ASSOCIATE";

export class User {

    private id: null | string = null;
    private name: string;
    private email: string;
    private cpf: string;
    private password: string;
    private role: UserRole;

    constructor(
        id: string | null,
        name: string,
        email: string,
        cpf: string,
        password: string,
        role: UserRole = "USER"
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.cpf = cpf;
        this.password = password;
        this.role = role;
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
}

