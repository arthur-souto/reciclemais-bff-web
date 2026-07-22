

export class Admin {
    id: number;
    password: string;
    email: string;
    role: string;

    constructor(
        id: number,
        password: string,
        email: string,
        role: string
    ) {
        this.id = id;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getPassword(): string {
        return this.password;
    }

    setPassword(password: string): void {
        this.password = password;
    }

    getEmail(): string {
        return this.email;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    getRole(): string {
        return this.role;
    }

    setRole(role: string): void {
        this.role = role;
    }
}